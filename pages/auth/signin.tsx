import {GetServerSideProps} from "next";
import getThisUser from "../../utils/getThisUser";
import {ssrRedirect} from "next-response-helpers";
import {getSession, signIn} from "next-auth/react";
import {useEffect} from "react";

export default function SignOut({}: {}) {
    useEffect(() => {
        signIn("google")
    })

    return (
        <></>
    );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    try {
        const session = await getSession(context);

        if (!session) return {props: {}};

        const thisUser = await getThisUser(context);

        if (!thisUser) return ssrRedirect("/auth/newaccount");

        return ssrRedirect("/app");
    }
    catch (e) {
        console.log(e);
        return ssrRedirect("/");
    }
};