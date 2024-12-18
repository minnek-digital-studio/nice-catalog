import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import Stripe from 'https://esm.sh/stripe@12.0.0'

// Environment variables (ensure these are set in your Supabase project)
const STRIPE_SECRET_KEY = Deno.env.get('STRIPE_SECRET_KEY') || ''
const SUPABASE_URL = Deno.env.get('SUPABASE_URL') || ''
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''

// Initialize Stripe
const stripe = new Stripe(STRIPE_SECRET_KEY, {
    apiVersion: '2023-10-16'
})

// Initialize Supabase client with service role for admin operations
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-application-name',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

serve(async (req) => {

    // Handle CORS preflight
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders });
    }
    // Only allow POST requests
    if (req.method !== 'POST') {
        return new Response(JSON.stringify({ error: 'Method not allowed' }), {
            status: 405,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })
    }

    try {
        // Parse the incoming request body
        const {
            stripeId,
            subscriptionId
        } = await req.json()

        // Validate input
        if (!stripeId || !subscriptionId) {
            return new Response(JSON.stringify({
                error: 'Missing stripeId or subscriptionId'
            }), {
                status: 400,
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            })
        }

        // Retrieve the Stripe subscription
        const { subscription: stripeSubscription } = await stripe.checkout.sessions.retrieve(stripeId)

        // Cancel the Stripe subscription
        const deletedSubscription = await stripe.subscriptions.cancel(stripeSubscription)

        // Update user's subscription status in Supabase
        const { error: supabaseError } = await supabase
            .from('user_subscriptions')
            .update({
                stripe_subscription_id: null,
                status: 'canceled',
                plan_id: '5407b76a-5c2c-42de-a4ca-cb0654ca3800',
            })
            .eq('id', subscriptionId)

        if (supabaseError) {
            console.error('Supabase update error:', supabaseError)
            throw new Error('Failed to update user subscription status')
        }

        // Return success response
        return new Response(JSON.stringify({
            message: 'Subscription canceled successfully',
            subscription: deletedSubscription
        }), {
            status: 200,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })

    } catch (error) {
        console.error('Unsubscribe error:', error)

        // Handle specific Stripe errors
        if (error instanceof Stripe.errors.StripeError) {
            return new Response(JSON.stringify({
                error: 'Stripe error',
                details: error.message
            }), {
                status: error.statusCode || 500,
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            })
        }

        // Generic error handling
        return new Response(JSON.stringify({
            error: 'Failed to unsubscribe',
            details: error.message
        }), {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })
    }
})
