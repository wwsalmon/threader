import Button from "./headless/Button";
import {FaGoogle} from "react-icons/fa";

export default function SignInButton({className}: {className?: string}) {
    return (
        <Button href="/auth/signin" className={className || ""}>
            <div className="flex items-center">
                <FaGoogle/><span className="ml-2">Sign in</span>
            </div>
        </Button>
    );
}