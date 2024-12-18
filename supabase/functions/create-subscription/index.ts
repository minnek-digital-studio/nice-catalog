import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.7';
import Stripe from 'https://esm.sh/stripe@13.11.0';

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
    apiVersion: '2023-10-16',
    httpClient: Stripe.createFetchHttpClient(),
});

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-application-name',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

serve(async (req) => {
    try {
        // Handle CORS preflight
        if (req.method === 'OPTIONS') {
            return new Response('ok', { headers: corsHeaders });
        }

        // Verify request method
        if (req.method !== 'POST') {
            throw new Error(`Method ${req.method} not allowed`);
        }

        // Get Supabase configuration
        const supabaseUrl = Deno.env.get('SUPABASE_URL');
        const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
        if (!supabaseUrl || !supabaseKey) {
            throw new Error('Missing Supabase configuration');
        }

        // Initialize Supabase client
        const supabaseAdmin = createClient(supabaseUrl, supabaseKey, {
            auth: {
                autoRefreshToken: false,
                persistSession: false
            }
        });

        // Verify authentication
        const authHeader = req.headers.get('Authorization');
        if (!authHeader) {
            throw new Error('No authorization header');
        }

        const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(
            authHeader.replace('Bearer ', '')
        );

        if (authError || !user) {
            throw new Error('Invalid auth credentials');
        }

        // Parse request body
        const { planId, stripeId, customerId } = await req.json();
        if (!planId || !stripeId || !customerId) {
            throw new Error('Missing required parameters');
        }

        const { data: user_sub } = await supabaseAdmin.from('user_subscriptions').select('id, stripe_subscription_id').eq('user_id', user.id).single();
        if (user_sub) {
            if (user_sub.stripe_subscription_id != stripeId) {
                if (user_sub.stripe_subscription_id) {
                    // Retrieve the previous stripe subscription
                    const { subscription: stripeSubscription } = await stripe.checkout.sessions.retrieve(user_sub.stripe_subscription_id);

                    // Cancel previous stripe subscription
                    await stripe.subscriptions.cancel(stripeSubscription);
                }

                await supabaseAdmin.from('user_subscriptions').update({
                    plan_id: planId,
                    status: 'active',
                    current_period_start: new Date(),
                    current_period_end: new Date(),
                    cancel_at_period_end: false,
                    stripe_subscription_id: stripeId,
                }).eq('id', user_sub.id);
            }
        } else {
            const s = await supabaseAdmin.from('user_subscriptions').insert({
                user_id: user.id,
                plan_id: planId,
                stripe_customer_id: customerId,
                status: 'active',
                current_period_start: new Date(),
                current_period_end: new Date(),
                cancel_at_period_end: false,
                stripe_subscription_id: stripeId,
            });
        }

        return new Response(
            JSON.stringify({ ok: true }),
            {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                status: 200,
            }
        );
    } catch (error) {
        console.error('Subscription creation failed:', error);
        return new Response(
            JSON.stringify({ error: error.message }),
            {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                status: 400,
            }
        );
    }
});
