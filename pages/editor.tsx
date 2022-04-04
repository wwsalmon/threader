import {useCallback, useMemo, useState} from "react";
import {withHistory} from "slate-history";
import {Editable, ReactEditor, Slate, withReact} from "slate-react";
import {createEditor, Descendant, Text} from "slate";
import Prism from "prismjs";
import "../utils/prismMarkdown";
import classNames from "classnames";

export const slateInitValue: Descendant[] = [{
    type: "paragraph",
    children: [{text: ""}],
}];

const Leaf = ({attributes, children, leaf}) => {
    return (
        <span
            {...attributes}
            className={classNames(
                leaf.bold && "font-bold",
                leaf.italic && "italic",
                leaf.h1 && "font-bold text-3xl",
                leaf.h2 && "font-bold text-2xl",
            )}
        >
      {children}
    </span>
    );
};

export default function Editor({}: {}) {
    const editor = useMemo(() => withHistory(withReact(createEditor() as ReactEditor)), []);
    const renderLeaf = useCallback(props => <Leaf {...props} />, []);
    const [value, setValue] = useState<Descendant[]>([{type: "p", children: [{text: ""}]}]);

    const decorate = useCallback(([node, path]) => {
        const ranges = [];

        if (!Text.isText(node)) {
            return ranges;
        }

        const getLength = token => {
            if (typeof token === "string") {
                return token.length;
            } else if (typeof token.content === "string") {
                return token.content.length;
            } else {
                return token.content.reduce((l, t) => l + getLength(t), 0);
            }
        };

        const tokens = Prism.tokenize(node.text, Prism.languages.markdown);

        console.log(tokens);

        let start = 0;

        for (const token of tokens) {
            const length = getLength(token);
            const end = start + length;

            if (typeof token !== "string") {
                ranges.push({
                    [token.type]: true,
                    anchor: {path, offset: start},
                    focus: {path, offset: end},
                });
            }

            start = end;
        }

        return ranges;
    }, []);

    return (
        <div className="max-w-4xl mx-auto px-4 py-24">
            <Slate editor={editor} value={value} onChange={d => setValue(d)}>
                <Editable
                    placeholder="Write some markdown"
                    decorate={decorate}
                    renderLeaf={renderLeaf}
                />
            </Slate>
        </div>
    );
}