import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { supabase } from "../../../lib/supabase";
import { Check, X, EyeOff, Eye } from "lucide-react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const passwordRequirements = [
    { label: "8+ characters", test: (p: string) => p.length >= 8 },
    { label: "Uppercase letter", test: (p: string) => /[A-Z]/.test(p) },
    { label: "Lowercase letter", test: (p: string) => /[a-z]/.test(p) },
    { label: "Number", test: (p: string) => /\d/.test(p) },
    {
        label: "Special character",
        test: (p: string) => /[!@#$%^&*]/.test(p),
    },
    {
        label: "Match",
        test: (p: string, c?: string) => p === c,
    },
];

const newPasswordSchema = z.object({
    password: z.string().min(6),
    confirmPassword: z.string().min(6),
});

type NewPasswordFormValues = z.infer<typeof newPasswordSchema>;

const NewPasswordForm = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const navigate = useNavigate();

    const {
        register,
        watch,
        handleSubmit,
        formState: { errors },
    } = useForm<NewPasswordFormValues>({
        resolver: zodResolver(newPasswordSchema),
        defaultValues: {
            password: "",
            confirmPassword: "",
        },
    });

    const formData = watch();

    const onSubmit = async (formData: NewPasswordFormValues) => {
        if (!validateData(formData.password, formData.confirmPassword)) {
            return;
        }

        const { data, error } = await supabase.auth.updateUser({
            password: formData.password,
        });

        if (error) {
            toast.error("An error occurred. Please try again.");
            return;
        }

        toast.success("Password updated successfully.", {
            duration: 5000,
        });

        navigate("/admin/catalogs");

        console.log(data, error);
    };

    const validateData = (password: string, confirmPassword: string) => {
        const tests = passwordRequirements.map(({ test }) => test);
        return tests
            .map((test) => test(password, confirmPassword))
            .every(Boolean);
    };

    return (
        <>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div>
                    <label
                        htmlFor="password"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-200"
                    >
                        Password
                    </label>
                    <div className="mt-1 relative">
                        <input
                            id="password"
                            required={true}
                            type={showPassword ? "text" : "password"}
                            value={formData.password}
                            {...register("password")}
                            className={`block w-full pr-10 rounded-md shadow-sm sm:text-sm px-4 py-3 border ${
                                errors.password
                                    ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                                    : "border-gray-300 focus:ring-[#ed1c24] focus:border-[#ed1c24]"
                            }`}
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-500"
                        >
                            {showPassword ? (
                                <EyeOff
                                    className="h-5 w-5"
                                    aria-hidden="true"
                                />
                            ) : (
                                <Eye className="h-5 w-5" aria-hidden="true" />
                            )}
                        </button>
                    </div>
                    {errors.password && (
                        <p className="mt-2 text-sm text-red-600">
                            {errors.password.message}
                        </p>
                    )}
                </div>
                <div>
                    <label
                        htmlFor="confirmPassword"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-200"
                    >
                        Confirm Password
                    </label>
                    <div className="mt-1 relative">
                        <input
                            id="confirmPassword"
                            required={true}
                            type={showConfirmPassword ? "text" : "password"}
                            {...register("confirmPassword")}
                            className={`block w-full rounded-md border-gray-300 shadow-sm focus:border-[#ed1c24] focus:ring-[#ed1c24] sm:text-sm px-4 py-3 border`}
                        />
                        <button
                            type="button"
                            onClick={() =>
                                setShowConfirmPassword(!showConfirmPassword)
                            }
                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-500"
                        >
                            {showConfirmPassword ? (
                                <EyeOff
                                    className="h-5 w-5"
                                    aria-hidden="true"
                                />
                            ) : (
                                <Eye className="h-5 w-5" aria-hidden="true" />
                            )}
                        </button>
                    </div>
                </div>
                <div>
                    <div className="mt-4 space-y-2">
                        {passwordRequirements.map(({ label, test }) => (
                            <div
                                key={label}
                                className="flex items-center space-x-2"
                            >
                                {test(
                                    formData.password,
                                    formData.confirmPassword
                                ) ? (
                                    <Check className="w-4 h-4 text-green-500" />
                                ) : (
                                    <X className="w-4 h-4 text-gray-300" />
                                )}
                                <span
                                    className={`text-sm ${
                                        test(
                                            formData.password,
                                            formData.confirmPassword
                                        )
                                            ? "text-green-500"
                                            : "text-gray-500"
                                    }`}
                                >
                                    {label}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
                <div>
                    <button
                        type="submit"
                        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                    >
                        Reset Password
                    </button>
                </div>
            </form>
        </>
    );
};

export default NewPasswordForm;
