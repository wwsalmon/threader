import {GetServerSideProps} from "next";
import getThisUser from "../utils/getThisUser";
import {ssrRedirect} from "next-response-helpers";
import cleanForJSON from "../utils/cleanForJSON";
import {DatedObj, NoteObj, ThreadObj, UserObj} from "../models/models";
import Button from "../components/headless/Button";
import {Dispatch, SetStateAction, useEffect, useState} from "react";
import axios from "axios";
import classNames from "classnames";
import Modal from "../components/headless/Modal";
import useSWR from "swr";
import fetcher from "../utils/fetcher";
import Note from "../components/Note";
import SEO from "../components/SEO";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

function NewThread({threadsIter, setThreadsIter}: {threadsIter: number, setThreadsIter: Dispatch<SetStateAction<number>>}) {
    const [name, setName] = useState<string>("");
    const [urlName, setUrlName] = useState<string>("");
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

    function onCreate() {
        setIsLoading(true);
        axios.post("/api/thread", {name, urlName}).then(() => setThreadsIter(threadsIter + 1)).catch(e => console.log(e)).finally(() => setIsLoading(false));
    }

    return (
        <>
            <Button
                className="mt-auto bg-brand-300 h-12 w-full text-center text-xs hover:bg-brand-400 font-bold"
                onClick={() => setIsModalOpen(true)}
            >
                new thread
            </Button>
            <Modal isOpen={isModalOpen} setIsOpen={setIsModalOpen} maxWidth={400}>
                <p className="font-bold mb-4">New thread</p>
                <input type="text" autoFocus={true} className="w-full border-b my-2 py-2 outline-none" value={name} onChange={e => setName(e.target.value)} placeholder="Name"/>
                <input type="text" className="w-full border-b my-2 py-2 outline-none" value={urlName} onChange={e => setUrlName(e.target.value)} placeholder="urlName"/>
                <Button
                    isLoading={isLoading}
                    onClick={onCreate}
                    className="font-bold text-sm px-4 py-2 bg-brand-300 text-white hover:bg-brand-400 mt-4"
                >
                    Create
                </Button>
            </Modal>
        </>
    )
}

export default function App({thisUser}: {thisUser: DatedObj<UserObj>}) {
    const [threads, setThreads] = useState<DatedObj<ThreadObj>[]>([]);
    const [threadsIter, setThreadsIter] = useState<number>(null);
    const [selectedThread, setSelectedThread] = useState<DatedObj<ThreadObj> | null>(threads.length ? threads[0] : null);
    const [notes, setNotes] = useState<DatedObj<NoteObj>[]>([]);
    const [notesIter, setNotesIter] = useState<number>(0);
    const [isNotesLoading, setIsNotesLoading] = useState<boolean>(false);

    const {data} = useSWR<{ notes: DatedObj<NoteObj>[] }>(`/api/note?threadId=${selectedThread ? selectedThread._id : null}&iter=${notesIter}`, threads.length ? fetcher : () => ({notes: []}));
    const {data: threadsData} = useSWR<{threads: DatedObj<ThreadObj>[]}>(`/api/thread?iter=${threadsIter}`, fetcher);

    useEffect(() => {
        if (data && data.notes) {
            setNotes(data.notes);
        }
    }, [data]);

    useEffect(() => {
        if (threadsData && threadsData.threads) {
            setThreads(threadsData.threads);
        }
    }, [threadsData]);

    function onNewNote() {
        if (!selectedThread) return;
        setIsNotesLoading(true);
        axios.post("/api/note", {threadId: selectedThread._id}).then(() => {
            setNotesIter(notesIter + 1);
        }).catch(e => console.log(e)).finally(() => setIsNotesLoading(false));
    }

    return (
        <>
            <SEO title="Your threads"/>
            <div className="max-w-4xl flex relative mx-auto">
                <div className="flex-shrink-0 w-60 bg-brand-700 sticky top-0 left-0 h-screen text-white flex flex-col">
                    <div className="h-16 flex items-center px-4">
                        <img
                            src={thisUser.image}
                            alt={`Profile picture of ${thisUser.name}`}
                            className="h-10 w-10 rounded-full"
                        />
                        <div className="ml-4 overflow-x-hidden">
                            <p>{thisUser.name}</p>
                            <p className="text-xs truncate opacity-50">/@{thisUser.username}</p>
                        </div>
                    </div>
                    <div className="flex-grow-1">
                        {threadsData ? threads.length ? threads.map(thread => (
                            <button
                                key={thread._id}
                                onClick={() => {
                                    setNotes([]);
                                    setSelectedThread(thread)
                                }}
                                disabled={selectedThread._id === thread._id}
                                className={classNames("h-9 w-full px-4 text-xs text-left outline-none", selectedThread && thread._id === selectedThread._id && "bg-brand-500 font-bold")}
                            >
                                {thread.name}
                            </button>
                        )) : (
                            <p>no threads here yet. click "new thread" to add one</p>
                        ) : (
                            <div className="px-4">
                                <Skeleton height={24} count={3} className="opacity-25 mb-1"/>
                            </div>
                        )}
                    </div>
                    <NewThread threadsIter={threadsIter} setThreadsIter={setThreadsIter}/>
                </div>
                <div className="w-full min-h-screen border-r">
                    {selectedThread && (
                        <>
                            <div className="h-16 flex items-center px-4 bg-brand-50 sticky top-0 left-0 w-full border-b">
                                <div>
                                    <p>{selectedThread.name}</p>
                                    <p className="text-xs underline">{selectedThread.urlName}</p>
                                </div>
                                <Button
                                    className="ml-auto h-8 px-2 bg-brand-300 hover:bg-brand-400 font-bold text-xs text-white"
                                    onClick={onNewNote}
                                    isLoading={isNotesLoading}
                                >
                                    new note
                                </Button>
                            </div>
                            <div>
                                {(data || notes.length) ? notes.length ? notes.map(note => (
                                    <Note note={note} notesIter={notesIter} setNotesIter={setNotesIter} key={note._id}/>
                                )) : (
                                    <p className="text-center mt-8 text-gray-500">no notes here yet. click "new note" to
                                        add one</p>
                                ) : (
                                    <div className="px-4">
                                        <Skeleton height={120} count={3} className="mt-4"/>
                                    </div>
                                )}
                            </div>
                        </>
                    )}
                </div>
            </div>
        </>
    );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    try {
        const thisUser = await getThisUser(context);

        if (!thisUser) return ssrRedirect("/auth/signin");

        return {props: cleanForJSON({thisUser})};
    }
    catch (e) {
        console.log(e);
        return ssrRedirect("/");
    }
};