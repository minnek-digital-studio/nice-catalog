-- Create subscription plans table
CREATE TYPE plan_type AS ENUM ('free', 'basic', 'pro');

CREATE TABLE subscription_plans (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  type plan_type NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  catalog_limit INTEGER NOT NULL,
  product_limit INTEGER NOT NULL,
  stripe_price_id TEXT UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create user subscriptions table
CREATE TABLE user_subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  plan_id UUID NOT NULL REFERENCES subscription_plans(id),
  stripe_subscription_id TEXT UNIQUE,
  stripe_customer_id TEXT UNIQUE,
  status TEXT NOT NULL,
  current_period_start TIMESTAMPTZ NOT NULL,
  current_period_end TIMESTAMPTZ NOT NULL,
  cancel_at_period_end BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Insert default plans
INSERT INTO subscription_plans (name, type, price, catalog_limit, product_limit, stripe_price_id) VALUES
  ('Free', 'free', 0, 1, 10, NULL),
  ('Basic', 'basic', 9.99, 3, 50, 'price_basic'),
  ('Pro', 'pro', 29.99, -1, -1, 'price_pro');

-- Add RLS policies
ALTER TABLE subscription_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_subscriptions ENABLE ROW LEVEL SECURITY;

-- Plans are viewable by everyone
CREATE POLICY "Plans are viewable by everyone"
  ON subscription_plans FOR SELECT
  USING (true);

-- Users can view their own subscriptions
CREATE POLICY "Users can view own subscriptions"
  ON user_subscriptions FOR SELECT
  USING (auth.uid() = user_id);

-- Create function to check subscription limits
CREATE OR REPLACE FUNCTION check_subscription_limits()
RETURNS TRIGGER AS $$
DECLARE
  v_plan subscription_plans;
  v_catalog_count INTEGER;
  v_product_count INTEGER;
BEGIN
  -- Get user's current plan
  SELECT p.* INTO v_plan
  FROM subscription_plans p
  JOIN user_subscriptions s ON s.plan_id = p.id
  WHERE s.user_id = NEW.user_id
  AND s.status = 'active';

  IF v_plan IS NULL THEN
    -- If no subscription found, use free plan limits
    SELECT * INTO v_plan
    FROM subscription_plans
    WHERE type = 'free';
  END IF;

  -- Check catalog limit
  IF TG_TABLE_NAME = 'catalogs' THEN
    SELECT COUNT(*) INTO v_catalog_count
    FROM catalogs
    WHERE user_id = NEW.user_id;

    IF v_plan.catalog_limit != -1 AND v_catalog_count >= v_plan.catalog_limit THEN
      RAISE EXCEPTION 'Catalog limit reached for your subscription plan';
    END IF;
  END IF;

  -- Check product limit
  IF TG_TABLE_NAME = 'products' THEN
    SELECT COUNT(*) INTO v_product_count
    FROM products p
    JOIN catalogs c ON c.id = p.catalog_id
    WHERE c.user_id = NEW.user_id;

    IF v_plan.product_limit != -1 AND v_product_count >= v_plan.product_limit THEN
      RAISE EXCEPTION 'Product limit reached for your subscription plan';
    END IF;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers to enforce limits
CREATE TRIGGER check_catalog_limits
  BEFORE INSERT ON catalogs
  FOR EACH ROW
  EXECUTE FUNCTION check_subscription_limits();

CREATE TRIGGER check_product_limits
  BEFORE INSERT ON products
  FOR EACH ROW
  EXECUTE FUNCTION check_subscription_limits();