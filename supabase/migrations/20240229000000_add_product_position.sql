-- Add position column to products table
ALTER TABLE products ADD COLUMN position INTEGER;

-- Create function to auto-set position for new products
CREATE OR REPLACE FUNCTION set_product_position()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.position IS NULL THEN
    SELECT COALESCE(MAX(position), 0) + 1
    INTO NEW.position
    FROM products
    WHERE catalog_id = NEW.catalog_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to auto-set position
CREATE TRIGGER set_product_position_trigger
  BEFORE INSERT ON products
  FOR EACH ROW
  EXECUTE FUNCTION set_product_position();

-- Update existing products with positions
WITH numbered_products AS (
  SELECT id, ROW_NUMBER() OVER (PARTITION BY catalog_id ORDER BY created_at) as row_num
  FROM products
)
UPDATE products p
SET position = np.row_num
FROM numbered_products np
WHERE p.id = np.id;