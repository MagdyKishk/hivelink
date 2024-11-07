interface PasswordValidationProps {
    password: string;
}

const PasswordValidation = ({ password }: PasswordValidationProps) => {
    // Validation checks
    const hasMinLength = password.length >= 8;
    const hasLowerCase = /[a-z]/.test(password);
    const hasUpperCase = /[A-Z]/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    // Calculate strength percentage
    const validationCount = [hasMinLength, hasLowerCase, hasUpperCase, hasSpecialChar].filter(Boolean).length;
    const strengthPercentage = (validationCount / 4) * 100;

    return (
        <div className="mt-2">
            {/* Strength indicator */}
            <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div 
                    className="h-2.5 rounded-full transition-all duration-300"
                    style={{
                        width: `${strengthPercentage}%`,
                        backgroundColor: strengthPercentage <= 25 ? '#ef4444' : 
                                       strengthPercentage <= 50 ? '#f97316' :
                                       strengthPercentage <= 75 ? '#eab308' : '#22c55e'
                    }}
                    aria-label="Password strength indicator"
                />
            </div>

            {/* Requirements list */}
            <ul className="mt-4 flex flex-col gap-2">
                <li className="flex items-center text-sm">
                    <span className={`mr-2 ${hasMinLength ? 'text-green-500' : 'text-gray-400'}`}>
                        {hasMinLength ? '✓' : '○'}
                    </span>
                    <span className={hasMinLength ? 'text-green-500' : 'text-gray-600'}>
                        At least 8 characters long
                    </span>
                </li>
                <li className="flex items-center text-sm">
                    <span className={`mr-2 ${hasLowerCase ? 'text-green-500' : 'text-gray-400'}`}>
                        {hasLowerCase ? '✓' : '○'}
                    </span>
                    <span className={hasLowerCase ? 'text-green-500' : 'text-gray-600'}>
                        At least one lowercase letter
                    </span>
                </li>
                <li className="flex items-center text-sm">
                    <span className={`mr-2 ${hasUpperCase ? 'text-green-500' : 'text-gray-400'}`}>
                        {hasUpperCase ? '✓' : '○'}
                    </span>
                    <span className={hasUpperCase ? 'text-green-500' : 'text-gray-600'}>
                        At least one uppercase letter
                    </span>
                </li>
                <li className="flex items-center text-sm">
                    <span className={`mr-2 ${hasSpecialChar ? 'text-green-500' : 'text-gray-400'}`}>
                        {hasSpecialChar ? '✓' : '○'}
                    </span>
                    <span className={hasSpecialChar ? 'text-green-500' : 'text-gray-600'}>
                        At least one special character
                    </span>
                </li>
            </ul>
        </div>
    );
}

export default PasswordValidation;