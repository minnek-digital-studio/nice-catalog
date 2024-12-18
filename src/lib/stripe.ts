import { loadStripe } from '@stripe/stripe-js';
import { supabase } from './supabase';
import type { Database } from '../types/supabase';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

type Plan = Database['public']['Tables']['subscription_plans']['Row'];
type Subscription = Database['public']['Tables']['user_subscriptions']['Row'];

export async function createCheckoutSession(priceId: string) {
    try {
        const { data: { session }, error: authError } = await supabase.auth.getSession();

        if (authError) throw new Error('Authentication required');
        if (!session?.user) throw new Error('Please log in to subscribe');

        const successUrl = new URL('/admin/settings', window.location.origin).href;
        const cancelUrl = new URL('/admin/settings', window.location.origin).href;
        const { data: { sessionId } } = await supabase.functions.invoke('create-checkout-session', {
            body: { priceId, successUrl, cancelUrl, hash: '#plans' },
            headers: {
                Authorization: `Bearer ${session.access_token}`,

            },
        });

        const stripe = await stripePromise;
        if (!stripe) throw new Error('Stripe failed to load');

        const { error } = await stripe.redirectToCheckout({ sessionId });
        if (error) throw error;
    } catch (error) {
        console.error('Error creating checkout session:', error);
        throw error;
    }
}

export async function getCurrentSubscription(): Promise<Subscription | null> {
    try {
        const { data: subscription, error } = await supabase
            .from('user_subscriptions')
            .select('*, plan:subscription_plans(*)')
            .single();

        if (error) throw error;
        return subscription;
    } catch (error) {
        console.error('Error getting subscription:', error);
        return null;
    }
}

export async function getSubscriptionPlans(): Promise<Plan[]> {
    try {
        const { data: plans, error } = await supabase
            .from('subscription_plans')
            .select('*')
            .order('price');

        if (error) throw error;
        return plans;
    } catch (error) {
        console.error('Error getting subscription plans:', error);
        return [];
    }
}

export async function cancelSubscription() {
    try {
        const { data: { session }, error: authError } = await supabase.auth.getSession();

        if (authError) throw new Error('Authentication required');
        if (!session?.user) throw new Error('Please log in to unsubscribe');

        const { data: subscription } = await supabase.
            from('user_subscriptions')
            .select('id, stripe_subscription_id')
            .eq('user_id', session.user.id)
            .single();

        const { error } = await supabase.functions.invoke('cancel-subscription', {
            body: {
                stripeId: subscription?.stripe_subscription_id,
                subscriptionId: subscription?.id,
            },
            headers: {
                Authorization: `Bearer ${session.access_token}`,

            },
        });
        if (error) throw error;
    } catch (error) {
        console.error('Error canceling subscription:', error);
        throw error;
    }
}

export async function createSubscription(stripeId: string, planId: string, customerId: string) {
    try {
        const { data: { session }, error: authError } = await supabase.auth.getSession();

        if (authError) throw new Error('Authentication required');
        if (!session?.user) throw new Error('Please log in to unsubscribe');

        const { error } = await supabase.functions.invoke('create-subscription', {
            body: {
                stripeId,
                planId,
                customerId,
            },
            headers: {
                Authorization: `Bearer ${session.access_token}`,

            },
        });

        if (error) throw error;
    } catch (error) {
        console.error('Error creating subscription:', error);
        throw error;
    }
}
