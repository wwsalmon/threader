import Editor from "../components/slate/Editor";
import {useState} from "react";

export default function EditorPage({}: {}) {
    const [value, setValue] = useState<string>("");

    return (
        <div className="max-w-4xl mx-auto px-4 py-24">
            <Editor mdValue={value} setMdValue={setValue}/>
        </div>
    );
}