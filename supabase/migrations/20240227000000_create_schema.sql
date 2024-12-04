-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create enum for stock status
CREATE TYPE stock_status AS ENUM ('in_stock', 'low_stock', 'out_of_stock');

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create catalogs table
CREATE TABLE IF NOT EXISTS catalogs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  is_published BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  catalog_id UUID NOT NULL REFERENCES catalogs(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  icon TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(catalog_id, slug)
);

-- Create brands table
CREATE TABLE IF NOT EXISTS brands (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  catalog_id UUID NOT NULL REFERENCES catalogs(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  logo_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(catalog_id, name)
);

-- Create products table
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  catalog_id UUID NOT NULL REFERENCES catalogs(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  slug TEXT NOT NULL,
  description TEXT NOT NULL,
  brand TEXT NOT NULL,
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  image_url TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL CHECK (price >= 0),
  stock_status stock_status DEFAULT 'in_stock',
  flags TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(catalog_id, slug)
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE catalogs ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE brands ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Public profiles are viewable by everyone" ON profiles
  FOR SELECT USING (true);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- Catalogs policies
CREATE POLICY "Published catalogs are viewable by everyone" ON catalogs
  FOR SELECT USING (is_published = true OR auth.uid() = user_id);

CREATE POLICY "Users can insert own catalogs" ON catalogs
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own catalogs" ON catalogs
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own catalogs" ON catalogs
  FOR DELETE USING (auth.uid() = user_id);

-- Categories policies
CREATE POLICY "Categories are viewable by everyone" ON categories
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM catalogs 
      WHERE catalogs.id = categories.catalog_id 
      AND (catalogs.is_published = true OR catalogs.user_id = auth.uid())
    )
  );

CREATE POLICY "Users can insert categories to own catalogs" ON categories
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM catalogs 
      WHERE catalogs.id = catalog_id 
      AND catalogs.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update categories in own catalogs" ON categories
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM catalogs 
      WHERE catalogs.id = catalog_id 
      AND catalogs.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete categories from own catalogs" ON categories
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM catalogs 
      WHERE catalogs.id = catalog_id 
      AND catalogs.user_id = auth.uid()
    )
  );

-- Brands policies
CREATE POLICY "Brands are viewable by everyone" ON brands
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM catalogs 
      WHERE catalogs.id = brands.catalog_id 
      AND (catalogs.is_published = true OR catalogs.user_id = auth.uid())
    )
  );

CREATE POLICY "Users can insert brands to own catalogs" ON brands
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM catalogs 
      WHERE catalogs.id = catalog_id 
      AND catalogs.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update brands in own catalogs" ON brands
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM catalogs 
      WHERE catalogs.id = catalog_id 
      AND catalogs.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete brands from own catalogs" ON brands
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM catalogs 
      WHERE catalogs.id = catalog_id 
      AND catalogs.user_id = auth.uid()
    )
  );

-- Products policies
CREATE POLICY "Published products are viewable by everyone" ON products
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM catalogs 
      WHERE catalogs.id = products.catalog_id 
      AND (catalogs.is_published = true OR catalogs.user_id = auth.uid())
    )
  );

CREATE POLICY "Users can insert products to own catalogs" ON products
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM catalogs 
      WHERE catalogs.id = catalog_id 
      AND catalogs.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update products in own catalogs" ON products
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM catalogs 
      WHERE catalogs.id = catalog_id 
      AND catalogs.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete products from own catalogs" ON products
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM catalogs 
      WHERE catalogs.id = catalog_id 
      AND catalogs.user_id = auth.uid()
    )
  );

-- Create functions to auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_catalogs_updated_at
  BEFORE UPDATE ON catalogs
  FOR EACH ROW
  EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW
  EXECUTE PROCEDURE update_updated_at_column();