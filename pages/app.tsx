import {GetServerSideProps} from "next";
import getThisUser from "../utils/getThisUser";
import {ssrRedirect} from "next-response-helpers";
import cleanForJSON from "../utils/cleanForJSON";
import {DatedObj, ThreadObj, UserObj} from "../models/models";
import Button from "../components/headless/Button";
import {Dispatch, SetStateAction, useEffect, useState} from "react";
import axios from "axios";
import classNames from "classnames";
import Modal from "../components/headless/Modal";

function NewThread({setThreads}: {setThreads: Dispatch<SetStateAction<DatedObj<ThreadObj>[]>>}) {
    const [name, setName] = useState<string>("");
    const [urlName, setUrlName] = useState<string>("");
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

    function onCreate() {
        setIsLoading(true);
        axios.post("/api/thread", {name, urlName}).then(() => {
            axios.get("/api/thread").then(res => setThreads(res.data.threads)).catch(e => console.log(e));
            setIsLoading(false);
            setName("");
            setUrlName("");
            setIsModalOpen(false);
        }).catch(e => console.log(e)).finally(() => setIsLoading(false));
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
    const [selectedThreadId, setSelectedThreadId] = useState<string>(threads.length && threads[0]._id);

    useEffect(() => {
        axios.get("/api/thread").then(res => setThreads(res.data.threads)).catch(e => console.log(e));
    }, []);

    return (
        <>
            <div className="max-w-4xl flex relative mx-auto">
                <div className="flex-shrink-0 w-60 bg-brand-700 sticky top-0 left-0 h-screen text-white flex flex-col">
                    <div className="h-16 flex items-center px-4">
                        <img src={thisUser.image} alt={`Profile picture of ${thisUser.name}`} className="h-10 w-10 rounded-full"/>
                        <div className="ml-4 overflow-x-hidden">
                            <p>{thisUser.name}</p>
                            <p className="text-xs truncate opacity-50">/@{thisUser.username}</p>
                        </div>
                    </div>
                    <div className="flex-grow-1">
                        {threads.map(thread => (
                            <Button
                                key={thread._id}
                                onClick={() => setSelectedThreadId(thread._id)}
                                className={classNames("h-9 w-full px-4 text-xs", thread._id === selectedThreadId && "bg-brand-500 font-bold")}
                            >
                                {thread.name}
                            </Button>
                        ))}
                    </div>
                    <NewThread setThreads={setThreads}/>
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