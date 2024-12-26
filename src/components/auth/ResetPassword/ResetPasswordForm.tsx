import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { supabase } from "../../../lib/supabase";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useSearchParams } from "react-router-dom";
import NewPasswordForm from "./NewPasswordForm";

const ResetPasswordFormSchema = z.object({
    email: z.string().email(),
});

type ResetPasswordFormValues = z.infer<typeof ResetPasswordFormSchema>;

const ResetPasswordForm = () => {
    const [recovery, setRecovery] = useState(false);
    const [searchParams] = useSearchParams();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<ResetPasswordFormValues>({
        resolver: zodResolver(ResetPasswordFormSchema),
        defaultValues: {
            email: "",
        },
    });

    const onSubmit = async (formData: ResetPasswordFormValues) => {
        const { email } = formData;
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: "http://localhost:5173/reset-password",
        });
        if (error) {
            toast.error(error.message || "An error occurred.");
            return;
        }
        toast.success("Password reset email sent successfully.", {
            duration: 5000,
        });
    };

    useEffect(() => {
        supabase.auth.onAuthStateChange(async (event) => {
            if (event == "PASSWORD_RECOVERY") {
                setRecovery(true);
            }
        });
    }, []);

    useEffect(() => {
        const verifyToken = async () => {
            const token = searchParams.get("token");
            if (!token) return;
            await supabase.auth.verifyOtp({
                token_hash: token,
                type: "recovery",
            });
        };
        verifyToken();
    }, [searchParams]);

    if (recovery) {
        return <NewPasswordForm />;
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
                <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-200"
                >
                    Email
                </label>
                <div className="mt-1">
                    <input
                        type="email"
                        id="email"
                        {...register("email")}
                        className="block w-full shadow-sm sm:text-sm focus:ring-primary focus:border-primary-light border-gray-300 dark:border-gray-700 rounded-md px-4 py-3"
                    />
                </div>
                {errors.email && (
                    <p className="mt-2 text-sm text-red-600">
                        {errors.email.message}
                    </p>
                )}
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
    );
};

export default ResetPasswordForm;
