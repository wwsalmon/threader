import {Dispatch, SetStateAction, useCallback, useEffect, useMemo, useState} from "react";
import {withHistory} from "slate-history";
import {Editable, ReactEditor, Slate, useFocused, useSelected, withReact} from "slate-react";
import {createEditor, Descendant, Node, Text} from "slate";
import Prism from "prismjs";
import "../../utils/prismMarkdown";
import classNames from "classnames";

export const slateInitValue: Descendant[] = [{
    type: "paragraph",
    children: [{text: ""}],
}];

const Leaf = ({attributes, children, leaf}) => {
    const focused = useFocused();
    const selected = useSelected();
    const showSource = focused && selected;

    if (leaf.url) {
        const {text} = leaf;
        const [t, label, url] = text.match(/\[(.*)\]\((.*)\)/);

        return (
            <span {...attributes}>
                <span className={classNames(!showSource && "hidden")}>{children}</span>
                {!showSource && (
                    <a href={url} contentEditable={false} className="underline">{label}</a>
                )}
            </span>
        );
    }

    return (
        <span
            {...attributes}
            className={classNames(
                leaf.bold && "font-bold",
                leaf.italic && "italic",
                leaf.h1 && "font-bold text-3xl",
                leaf.h2 && "font-bold text-2xl",
                leaf.h3 && "font-bold text-xl",
                leaf.h4 && "font-bold text-lg",
                leaf.blockquote && "inline-block border-l-4 pl-2 text-gray-500 italic",
                leaf.code && "font-[monospace] bg-gray-100",
                leaf.list && "inline-block pl-2 border-l-2",
            )}
        >
      {children}
    </span>
    );
};

export default function Editor({mdValue, setMdValue}: {mdValue: string, setMdValue: Dispatch<SetStateAction<string>>}) {
    const editor = useMemo(() => withHistory(withReact(createEditor() as ReactEditor)), []);
    const renderLeaf = useCallback(props => <Leaf {...props} />, []);

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
        <Slate
            editor={editor}
            value={mdValue.split("\n").map(d => ({type: "p", children: [{text: d}]}))}
            // @ts-ignore -- for more permanent fix better define CustomElement
            onChange={d => setMdValue(d.map(x => x.children[0].text).join("\n"))}
        >
            <Editable
                placeholder="Write some markdown"
                decorate={decorate}
                renderLeaf={renderLeaf}
            />
        </Slate>
    );
}