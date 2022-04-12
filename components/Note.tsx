import {DatedObj, NoteObj} from "../models/models";
import {format} from "date-fns";
import {Dispatch, SetStateAction, useState} from "react";
import axios from "axios";
import Button from "./headless/Button";
import {FiTrash} from "react-icons/fi";
import Modal from "./headless/Modal";

export default function Note({note, notesIter, setNotesIter}: {note: DatedObj<NoteObj>, notesIter: number, setNotesIter: Dispatch<SetStateAction<number>>}) {
    const [isDeleteLoading, setIsDeleteLoading] = useState<boolean>(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState<boolean>(false);

    function onDelete() {
        setIsDeleteLoading(true);

        axios
            .delete("/api/note", {data: {id: note._id}})
            .then(() => setNotesIter(notesIter + 1))
            .catch(e => console.log(e))
            .finally(() => setIsDeleteLoading(false));
    }


    return (
        <div className="p-4 hover:bg-gray-50">
            <div className="flex items-center">
                <p className="text-xs">{format(new Date(note.createdAt), "MMM d 'at' h:mm a")}</p>
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
        </div>
    );
}