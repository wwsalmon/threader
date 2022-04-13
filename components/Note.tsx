import {DatedObj, NoteObj} from "../models/models";
import {format} from "date-fns";
import {Dispatch, SetStateAction, useCallback, useState} from "react";
import axios from "axios";
import Button from "./headless/Button";
import {FiTrash} from "react-icons/fi";
import Modal from "./headless/Modal";
import {useAutosave} from "react-autosave";
import Editor from "./slate/Editor";

export default function Note({note, notesIter, setNotesIter}: {note: DatedObj<NoteObj>, notesIter: number, setNotesIter: Dispatch<SetStateAction<number>>}) {
    const [isDeleteLoading, setIsDeleteLoading] = useState<boolean>(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState<boolean>(false);
    const [value, setValue] = useState<string>(note.body);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    useAutosave({
        data: value, onSave: useCallback((value) => {
            if (!isLoading) {
                setIsLoading(true);

                axios
                    .post("/api/note", {noteId: note._id, body: value})
                    .then(() => setNotesIter(notesIter + 1))
                    .catch(e => console.log(e))
                    .finally(() => setIsLoading(false));
            }
        }, []), interval: 1000
    });

    function onDelete() {
        setIsDeleteLoading(true);

        axios
            .delete("/api/note", {data: {id: note._id}})
            .then(() => setNotesIter(notesIter + 1))
            .catch(e => console.log(e))
            .finally(() => setIsDeleteLoading(false));
    }


    return (
        <div className="p-4 hover:bg-gray-50 border-b">
            <div className="flex items-center">
                <p className="text-xs">
                    {format(new Date(note.createdAt), "MMM d 'at' h:mm a")} • {isLoading ? "Saving..." : note.body === value ? "All changes saved" : "Unsaved changes"}
                </p>
                <Button
                    className="p-2 hover:bg-gray-100 text-xs ml-auto"
                    onClick={() => setIsDeleteOpen(true)}
                ><FiTrash/></Button>
                <Modal isOpen={isDeleteOpen} setIsOpen={setIsDeleteOpen} maxWidth={400}>
                    <h3 className="font-bold mb-4">Are you sure you want to delete this note?</h3>
                    <Button
                        className="p-2 hover:bg-red-700 bg-red-500 text-xs text-white font-bold"
                        onClick={onDelete}
                        isLoading={isDeleteLoading}
                    >
                        Delete
                    </Button>
                </Modal>
            </div>
            <div className="my-2 text-xl leading-relaxed font-spectral">
                <Editor mdValue={value} setMdValue={setValue}/>
            </div>
        </div>
    );
}