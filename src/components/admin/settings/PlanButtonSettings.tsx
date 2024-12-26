import { ButtonHTMLAttributes, useState } from "react";

interface PlanButtonSettingsProps
    extends ButtonHTMLAttributes<HTMLButtonElement> {
    onClick: () => Promise<unknown>;
    variant?: keyof typeof variantClasses;
}

const variantClasses = {
    upgrade:
        "mt-8 w-full inline-flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#ed1c24] hover:bg-[#d91920] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#ed1c24] disabled:opacity-50",
    downgrade:
        "mt-8 w-full inline-flex justify-center items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#ed1c24] disabled:opacity-50",
};

const PlanButtonSettings = ({
    onClick,
    variant = "upgrade",
    children,
}: PlanButtonSettingsProps) => {
    const [loading, setLoading] = useState(false);

    const handleClick = async () => {
        setLoading(true);
        await onClick();
        setLoading(false);
    };

    return (
        <button
            onClick={handleClick}
            disabled={loading}
            className={variantClasses[variant]}
        >
            {children}
        </button>
    );
};

export default PlanButtonSettings;
