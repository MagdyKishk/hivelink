import { IconDefinition } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ButtonHTMLAttributes, forwardRef } from "react";
import { Link } from "react-router-dom";
import { cn } from "../../utils/cn.tsx";

const buttonVariants = {
    variant: {
        default: "bg-indigo-600 text-white hover:bg-indigo-700",
        outline: "border border-indigo-500 text-indigo-600 hover:bg-indigo-50",
        ghost: "hover:text-indigo-600 hover:bg-indigo-100",
    },
    size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 px-3",
        lg: "h-11 px-8",
        icon: "h-10 w-10",
    },
} as const;

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: keyof typeof buttonVariants.variant;
    size?: keyof typeof buttonVariants.size;
    icon?: IconDefinition;
    to?: string;
    fullWidth?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(({
    className,
    variant = "default",
    size = "default",
    icon,
    to,
    fullWidth,
    children,
    ...props
}, ref) => {
    const baseStyles = cn(
        "inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 disabled:pointer-events-none disabled:opacity-50",
        buttonVariants.variant[variant],
        buttonVariants.size[size],
        fullWidth && "w-full",
        className
    );

    const content = (
        <>
            {icon && <FontAwesomeIcon icon={icon} className={cn("h-4 w-4", children && "mr-2")} />}
            {children}
        </>
    );

    if (to) {
        return (
            <Link to={to} className={baseStyles}>
                {content}
            </Link>
        );
    }

    return (
        <button ref={ref} className={baseStyles} {...props}>
            {content}
        </button>
    );
});

Button.displayName = "Button";

export default Button;