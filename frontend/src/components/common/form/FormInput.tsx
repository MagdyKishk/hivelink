import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useState } from "react"

interface FormInputProps {
    /** Input field name attribute */
    name: string,
    /** Current input value */
    value: string,
    /** Function to update the input value */
    setValue: React.Dispatch<React.SetStateAction<string>>,
    /** Placeholder text */
    placeholder?: string,
    /** Input type - defaults to "text" */
    inputType?: ("text" | "number" | "password" | "email" | "file"),
    /** Optional CSS classes to add to input wrapper */
    className?: string,
    /** Optional error message to display */
    error?: string
}

/**
 * Reusable form input component with password visibility toggle
 */
const FormInput = ({ 
    name, 
    value, 
    setValue, 
    inputType = "text", 
    placeholder,
    className = "",
    error
}: FormInputProps) => {
    const [showPassword, setShowPassword] = useState(false)

    const togglePasswordVisibility = () => {
        setShowPassword(prev => !prev)
    }

    const getInputType = () => {
        if (inputType === "password") {
            return showPassword ? "text" : "password"
        }
        return inputType
    }

    return (
        <div className="w-full">
            <div className={`px-4 py-3 w-full border rounded-lg transition-all duration-200 bg-white shadow-sm
                ${error ? "border-red-500 hover:border-red-600" : "border-gray-200 hover:border-gray-300 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-100"}
                ${className} flex items-center gap-3`}
            >
                <input
                    name={name}
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    type={getInputType()}
                    placeholder={placeholder}
                    className="w-full focus:outline-none text-gray-800 placeholder-gray-400 bg-transparent"
                />
                {inputType === "password" && (
                    <span
                        onClick={togglePasswordVisibility}
                        className="cursor-pointer text-gray-400 hover:text-indigo-500 transition-colors duration-200 focus:outline-none focus:text-indigo-600"
                    >
                        <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} className="w-5 h-5" />
                    </span>
                )}
            </div>
            {error && (
                <p className="mt-2 text-sm text-red-500 font-medium">{error}</p>
            )}
        </div>
    )
}

export default FormInput;