import { AnimationType } from "@/constants/components/RedirectAnimation.types"

interface RedirectAnimationProps {
    animationType?: AnimationType;
    duration?: number;
}


const RedirectAnimation = ({ animationType = AnimationType.out, duration = 400 }: RedirectAnimationProps) => {
    // Create an array of colors for cleaner rendering
    const stripes = [
        "bg-indigo-500",
        "bg-indigo-400",
        "bg-indigo-300",
        "bg-indigo-200",
        "bg-indigo-300",
        "bg-indigo-400",
        "bg-indigo-500"
    ];

    const animationName: string = animationType;

    return (
        <div className="fixed left-0 top-0 w-screen h-screen flex z-50 overflow-hidden pointer-events-none">
            {stripes.map((color, index) => (
                <div
                    key={index}
                    className={`${color} h-full w-[calc((1/7)*100%)]`}
                    style={{
                        animation: animationName,
                        animationDuration: `${duration}ms`,
                        animationDelay: `${(index + 1) * 50}ms`,
                        animationFillMode: "forwards",
                    }}
                />
            ))}
        </div>
    );
};

export default RedirectAnimation;