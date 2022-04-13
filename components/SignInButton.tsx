import Button from "./headless/Button";
import {FaGoogle} from "react-icons/fa";
import {signIn} from "next-auth/react";

export default function SignInButton({className}: {className?: string}) {
    return (
        <Button onClick={() => signIn("google")} className={className || ""}>
            <div className="flex items-center">
                <FaGoogle/><span className="ml-2">Sign in</span>
            </div>
        </Button>
    );
}