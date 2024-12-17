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
        const { priceId, successUrl, cancelUrl } = await req.json();
        if (!priceId) {
            throw new Error('Missing required parameters');
        }

        // Get or create Stripe customer
        const { data: subscription } = await supabaseAdmin
            .from('user_subscriptions')
            .select('stripe_customer_id')
            .eq('user_id', user.id)
            .maybeSingle();

        const { data: plan } = await supabaseAdmin
            .from('subscription_plans')
            .select('id')
            .eq('stripe_price_id', priceId)
            .single();

        let customerId = subscription?.stripe_customer_id;

        if (!customerId) {
            const customer = await stripe.customers.create({
                email: user.email,
                metadata: {
                    supabaseUid: user.id,
                },
            });
            customerId = customer.id;
        }

        // Create Stripe checkout session
        const session = await stripe.checkout.sessions.create({
            customer: customerId,
            line_items: [
                {
                    price: priceId,
                    quantity: 1,
                },
            ],
            mode: 'subscription',
            success_url: successUrl,
            cancel_url: cancelUrl,
            allow_promotion_codes: true,
            billing_address_collection: 'required',
            payment_method_types: ['card'],
            subscription_data: {
                metadata: {
                    supabaseUid: user.id,
                },
            },
        });

        const { data: user_sub } = await supabaseAdmin.from('user_subscriptions').select('id').eq('user_id', user.id).single();
        if (user_sub) {
            await supabaseAdmin.from('user_subscriptions').update({
                plan_id: plan.id,
                status: 'active',
                current_period_start: new Date(),
                current_period_end: new Date(),
                cancel_at_period_end: false,
                stripe_subscription_id: session.id,
            }).eq('id', user_sub.id);
        } else {
            await supabaseAdmin.from('user_subscriptions').insert({
                user_id: user.id,
                plan_id: plan.id,
                stripe_customer_id: customerId,
                status: 'active',
                current_period_start: new Date(),
                current_period_end: new Date(),
                cancel_at_period_end: false,
                stripe_subscription_id: session.id,
            });
        }

        return new Response(
            JSON.stringify({ sessionId: session.id }),
            {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                status: 200,
            }
        );
    } catch (error) {
        console.error('Checkout session creation failed:', error);
        return new Response(
            JSON.stringify({ error: error.message }),
            {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                status: 400,
            }
        );
    }
});
