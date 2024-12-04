-- Create function to reorder products
CREATE OR REPLACE FUNCTION reorder_products(
  p_catalog_id UUID,
  p_product_id UUID,
  p_new_position INTEGER
)
RETURNS void
LANGUAGE plpgsql
AS $$
DECLARE
  v_old_position INTEGER;
  v_max_position INTEGER;
BEGIN
  -- Get the current position of the product
  SELECT position INTO v_old_position
  FROM products
  WHERE id = p_product_id AND catalog_id = p_catalog_id;

  -- Get the maximum position
  SELECT COALESCE(MAX(position), 0) INTO v_max_position
  FROM products
  WHERE catalog_id = p_catalog_id;

  -- Ensure new position is within valid range
  IF p_new_position < 1 THEN
    p_new_position := 1;
  ELSIF p_new_position > v_max_position THEN
    p_new_position := v_max_position;
  END IF;

  -- Update positions
  IF v_old_position < p_new_position THEN
    -- Moving down: update products in between
    UPDATE products
    SET position = position - 1
    WHERE catalog_id = p_catalog_id
      AND position > v_old_position
      AND position <= p_new_position;
  ELSIF v_old_position > p_new_position THEN
    -- Moving up: update products in between
    UPDATE products
    SET position = position + 1
    WHERE catalog_id = p_catalog_id
      AND position >= p_new_position
      AND position < v_old_position;
  END IF;

  -- Update the position of the target product
  UPDATE products
  SET position = p_new_position
  WHERE id = p_product_id AND catalog_id = p_catalog_id;
END;
$$;

-- Add RLS policy for the function
GRANT EXECUTE ON FUNCTION reorder_products TO authenticated;