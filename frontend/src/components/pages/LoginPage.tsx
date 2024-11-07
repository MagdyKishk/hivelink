import { useState } from "react";
import FormInput from "../common/form/FormInput"
import Button from "../common/Button";
import { Link } from "react-router-dom";
import RoutesList from "@/constants/Routes/RoutesList";

const LoginPage = () => {
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");

    function handleFormSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        console.log("hi")
    }

    return (
        <div className="h-screen flex flex-col justify-center items-center">
            <form onSubmit={(e) => handleFormSubmit(e)} className="bg-white max-w-md w-full mx-auto shadow-lg rounded-md overflow-hidden">
                <div className="p-6 bg-indigo-600">
                    <h1 className="text-white font-bold text-2xl">Login</h1>
                </div>
                <div className="p-6 flex flex-col gap-4">

                    <FormInput
                        name="email"
                        value={email}
                        setValue={setEmail}
                        inputType={"email"}
                        placeholder="Email"
                    />
                    <FormInput
                        name="password"
                        value={password}
                        setValue={setPassword}
                        inputType={"password"}
                        placeholder="Password"
                    />
                    <div className="flex justify-center mt-2 w-full">
                        <Button
                            variant="default"
                            size="default"
                            fullWidth
                            className="text-center"
                        >
                            Sign Up
                        </Button>
                    </div>
                    <p className="text-center mt-2 text-sm text-gray-600">
                        You don't have an account? {""}
                        <Link to={RoutesList.auth.signup} className="text-indigo-600 hover:text-indigo-500">Sign up</Link>
                    </p>
                </div>
            </form>
        </div>
    )
}

export default LoginPage