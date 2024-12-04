import { loadStripe } from '@stripe/stripe-js';
import { supabase } from './supabase';
import type { Database } from '../types/supabase';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

type Plan = Database['public']['Tables']['subscription_plans']['Row'];
type Subscription = Database['public']['Tables']['user_subscriptions']['Row'];

export async function createCheckoutSession(priceId: string) {
  try {
    const { data: { session_id } } = await supabase.functions.invoke('create-checkout-session', {
      body: { priceId }
    });

    const stripe = await stripePromise;
    if (!stripe) throw new Error('Stripe failed to load');

    const { error } = await stripe.redirectToCheckout({ sessionId: session_id });
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
    const { error } = await supabase.functions.invoke('cancel-subscription');
    if (error) throw error;
  } catch (error) {
    console.error('Error canceling subscription:', error);
    throw error;
  }
}