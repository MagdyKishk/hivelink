import { useEffect, useState } from "react";
import FormInput from "../common/form/FormInput"
import Button from "../common/Button";
import { Link, useNavigate } from "react-router-dom";
import PasswordValidation from "../common/form/PasswordValidation";
import RoutesList from "@/constants/Routes/RoutesList";
import { useAuth } from "@/store";
import validator from "@/constants/validation";

const SignupPage = () => {
    const [firstName, setFirstName] = useState<string>("");
    const [lastName, setLastName] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [confirmPassword, setConfirmPassword] = useState<string>("");
    const [error, setError] = useState<string>("");
    const navigate = useNavigate();

    const { signup, authError, isLoadingAuth, isAuthenticated } = useAuth();

    async function handleFormSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()

        if (password !== confirmPassword) {
            setError("Passwords do not match")
            return
        }

        if (!validator.email.regex.address.test(email)) {
            setError("Invalid email format")
            return
        }
        if (!validator.password.regex.password.test(password)) {
            setError("Invalid password format")
            return
        }

        await signup(firstName, lastName, email, password)
    }

    useEffect(() => {
        if (authError) {
            setError(authError)
        }
    }, [authError])
    
    useEffect(() => {
        if (!isLoadingAuth && isAuthenticated) {
            navigate(RoutesList.home)
        }
    }, [isLoadingAuth, isAuthenticated])

    return (
        <div className="h-screen flex flex-col justify-center items-center">
            <form onSubmit={(e) => handleFormSubmit(e)} className="bg-white max-w-md w-full mx-auto shadow-lg rounded-md overflow-hidden">
                <div className="p-6 bg-indigo-600">
                    <h1 className="text-white font-bold text-2xl">Signup</h1>
                </div>
                <div className="p-6 flex flex-col gap-4">
                    <div className="flex gap-6">
                        <FormInput
                            name="firstName"
                            value={firstName}
                            setValue={setFirstName}
                            inputType={"text"}
                            placeholder="First Name"
                        />
                        <FormInput
                            name="lastName"
                            value={lastName}
                            setValue={setLastName}
                            inputType={"text"}
                            placeholder="Last Name"
                        />
                    </div>
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
                    <FormInput
                        name="confirmPassword"
                        value={confirmPassword}
                        setValue={setConfirmPassword}
                        inputType={"password"}
                        placeholder="Confirm Password"
                    />
                    <PasswordValidation password={password} />
                    {error && 
                        <div className="flex justify-center mt-2 w-full bg-red-50 rounded-md p-2">
                            <p className="text-center text-sm text-red-500">{error}</p>
                        </div>
                    }
                    <div className="flex justify-center mt-2 w-full">
                        <Button
                            variant="default"
                            size="default"
                            fullWidth
                            className="text-center"
                            disabled={isLoadingAuth}
                        >
                            Sign Up
                        </Button>
                    </div>
                    <p className="text-center mt-2 text-sm text-gray-600">
                        Already have an account? {""}
                        <Link to={RoutesList.auth.login} className="text-indigo-600 hover:text-indigo-500">Log in</Link>
                    </p>
                </div>
            </form>
        </div>
    )
}

export default SignupPage