import SignInButton from "../components/SignInButton";
import {GetServerSideProps} from "next";
import getThisUser from "../utils/getThisUser";
import cleanForJSON from "../utils/cleanForJSON";
import {DatedObj, UserObj} from "../models/models";
import Button from "../components/headless/Button";
import SEO from "../components/SEO";

export default function Home({thisUser}: {thisUser: DatedObj<UserObj>}) {
    return (
        <div className="px-4 max-w-3xl mx-auto py-24 text-center">
            <SEO/>
            <div className="flex items-center justify-center">
                <img src="/logo.png" alt="Threader logo" className="h-6"/>
                <p className="ml-3 font-bold text-brand-300 text-xl">Threader</p>
            </div>
            <h1 className="text-4xl font-bold mt-8 mb-4">Take notes in threads</h1>
            <p className="text-xl font-font">Thinking happens over time. Your notes should too.</p>
            {thisUser ? (
                <Button className="bg-brand-300 hover:bg-brand-400 p-2 rounded-md text-white my-8" href="/app">
                    Go to app
                </Button>
            ) : (
                <SignInButton className="bg-brand-300 hover:bg-brand-400 text-white p-2 rounded-md my-4"/>
            )}
            <img src="/hero.png" alt="Screenshot of Threader" className="my-8 shadow-xl rounded-md"/>
            <p className="my-8">A side project by <a className="underline" href="https://twitter.com/wwsalmon">Samson Zhang</a></p>
        </div>
    );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    try {
        const thisUser = await getThisUser(context);

        return {props: cleanForJSON({thisUser})};
    }
    catch (e) {
        console.log(e);

        return {notFound: true};
    }
};