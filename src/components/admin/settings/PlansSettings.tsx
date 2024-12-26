import { useEffect, useState } from "react";
import {
    getSubscriptionPlans,
    getCurrentSubscription,
    createCheckoutSession,
    cancelSubscription,
    createSubscription,
} from "../../../lib/stripe";
import { Loader2, Check, AlertTriangle } from "lucide-react";
import { toast } from "react-hot-toast";
import type { Database } from "../../../types/supabase";
import { useSearchParams } from "react-router-dom";
import PlanButtonSettings from "./PlanButtonSettings";

type Plan = Database["public"]["Tables"]["subscription_plans"]["Row"];
type Subscription =
    Database["public"]["Tables"]["user_subscriptions"]["Row"] & {
        plan: Plan;
    };

export default function PlansSettings() {
    const [loading, setLoading] = useState(true);
    const [plans, setPlans] = useState<Plan[]>([]);
    const [currentSubscription, setCurrentSubscription] =
        useState<Subscription | null>(null);
    const [upgrading, setUpgrading] = useState(false);
    const [canceling, setCanceling] = useState(false);
    const [searchParams] = useSearchParams();

    useEffect(() => {
        const params = Object.fromEntries([...searchParams]);
        if (params?.success === "true") {
            finishCheckout(
                params.session_id,
                params.plan_id,
                params.customer_id
            );
        }

        if (params?.success === "false") {
            toast.error("Failed to finish checkout");
        }

        loadPlansAndSubscription();
    }, []); //eslint-disable-line

    const loadPlansAndSubscription = async () => {
        try {
            const [plansData, subscriptionData] = await Promise.all([
                getSubscriptionPlans(),
                getCurrentSubscription(),
            ]);
            setPlans(plansData);
            setCurrentSubscription(subscriptionData as Subscription);
        } catch (error) {
            console.error("Error loading plans:", error);
            toast.error("Failed to load subscription data");
        } finally {
            setLoading(false);
        }
    };

    const handleUpgrade = async (priceId: string) => {
        try {
            setUpgrading(true);
            await createCheckoutSession(priceId);
        } catch (error) {
            if (error instanceof Error)
                return toast.error(error.message || "Failed to start checkout");
            toast.error("Failed to cancel subscription");
        } finally {
            setUpgrading(false);
        }
    };

    const handleCancel = async () => {
        if (!confirm("Are you sure you want to cancel your subscription?"))
            return;

        try {
            setCanceling(true);
            await cancelSubscription();
            await loadPlansAndSubscription();
            toast.success("Subscription cancelled successfully");
        } catch (error) {
            if (error instanceof Error)
                return toast.error(
                    error.message || "Failed to cancel subscription"
                );
            toast.error("Failed to cancel subscription");
        } finally {
            setCanceling(false);
        }
    };

    const finishCheckout = async (
        sessionId: string,
        planId: string,
        customerId: string
    ) => {
        try {
            await createSubscription(sessionId, planId, customerId);
            await loadPlansAndSubscription();
            toast.success("Subscription started successfully");
        } catch (error) {
            if (error instanceof Error)
                return toast.error(
                    error.message || "Failed to finish checkout"
                );
            console.log("Error", error);
            toast.error("Failed to finish checkout");
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-medium text-gray-900">
                    Subscription Plans
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                    Choose the plan that best fits your needs
                </p>
            </div>

            {currentSubscription?.cancel_at_period_end && (
                <div className="rounded-md bg-yellow-50 p-4">
                    <div className="flex">
                        <div className="flex-shrink-0">
                            <AlertTriangle className="h-5 w-5 text-yellow-400" />
                        </div>
                        <div className="ml-3">
                            <h3 className="text-sm font-medium text-yellow-800">
                                Subscription Ending
                            </h3>
                            <div className="mt-2 text-sm text-yellow-700">
                                <p>
                                    Your subscription will end on{" "}
                                    {new Date(
                                        currentSubscription.current_period_end
                                    ).toLocaleDateString()}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {plans.map((plan) => {
                    const isCurrentPlan =
                        currentSubscription?.plan.id === plan.id;
                    const features = [
                        plan.catalog_limit === -1
                            ? "Unlimited catalogs"
                            : `Up to ${plan.catalog_limit} catalogs`,
                        plan.product_limit === -1
                            ? "Unlimited products"
                            : `Up to ${plan.product_limit} products`,
                        "Basic Analytics",
                        plan.type !== "free" && "Priority Support",
                        plan.type === "pro" && "API Access",
                    ].filter(Boolean);

                    return (
                        <div
                            key={plan.id}
                            className={`relative rounded-lg border ${
                                isCurrentPlan
                                    ? "border-[#ed1c24] ring-2 ring-[#ed1c24]"
                                    : "border-gray-200"
                            } bg-white p-6 shadow-sm`}
                        >
                            {isCurrentPlan && (
                                <div className="absolute -top-3 right-6">
                                    <span className="inline-flex items-center rounded-full bg-[#ed1c24] px-3 py-0.5 text-sm font-medium text-white">
                                        Current Plan
                                    </span>
                                </div>
                            )}
                            <div className="text-center">
                                <h3 className="text-lg font-medium text-gray-900">
                                    {plan.name}
                                </h3>
                                <div className="mt-4">
                                    <span className="text-4xl font-extrabold text-gray-900">
                                        ${plan.price}
                                    </span>
                                    <span className="text-base font-medium text-gray-500">
                                        /mo
                                    </span>
                                </div>
                                <ul className="mt-6 space-y-4">
                                    {features.map((feature, index) => (
                                        <li
                                            key={feature || index}
                                            className="flex items-center justify-center text-sm text-gray-500"
                                        >
                                            <Check className="h-4 w-4 text-[#ed1c24] mr-2" />
                                            {feature}
                                        </li>
                                    ))}
                                </ul>
                                {!isCurrentPlan && plan.stripe_price_id && (
                                    <PlanButtonSettings
                                        onClick={() =>
                                            handleUpgrade(plan.stripe_price_id!)
                                        }
                                        variant="upgrade"
                                    >
                                        {upgrading && (
                                            <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" />
                                        )}
                                        Upgrade to {plan.name}
                                    </PlanButtonSettings>
                                )}
                                {isCurrentPlan &&
                                    !currentSubscription.cancel_at_period_end &&
                                    plan.name !== "Free" && (
                                        <PlanButtonSettings
                                            onClick={handleCancel}
                                            variant="downgrade"
                                        >
                                            {canceling && (
                                                <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" />
                                            )}
                                            Cancel Subscription
                                        </PlanButtonSettings>
                                    )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
