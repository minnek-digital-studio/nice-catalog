-- Drop the problematic policy
DROP POLICY IF EXISTS "Ensure unique URL paths across all users" ON catalogs;

-- Modify the existing policies to be more specific and avoid recursion
DROP POLICY IF EXISTS "Published catalogs are viewable by everyone" ON catalogs;
DROP POLICY IF EXISTS "Users can insert own catalogs" ON catalogs;
DROP POLICY IF EXISTS "Users can update own catalogs" ON catalogs;
DROP POLICY IF EXISTS "Users can delete own catalogs" ON catalogs;

-- Create new, more specific policies
CREATE POLICY "Published catalogs are viewable by everyone"
  ON catalogs FOR SELECT
  USING (is_published = true OR auth.uid() = user_id);

CREATE POLICY "Users can insert own catalogs"
  ON catalogs FOR INSERT
  WITH CHECK (
    auth.uid() = user_id
    AND NOT EXISTS (
      SELECT 1 FROM catalogs c2
      WHERE c2.url_path = (
        SELECT username FROM profiles WHERE profiles.id = auth.uid()
      ) || '/' || NEW.slug
    )
  );

CREATE POLICY "Users can update own catalogs"
  ON catalogs FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (
    NOT EXISTS (
      SELECT 1 FROM catalogs c2
      WHERE c2.url_path = (
        SELECT username FROM profiles WHERE profiles.id = auth.uid()
      ) || '/' || NEW.slug
      AND c2.id != NEW.id
    )
  );

CREATE POLICY "Users can delete own catalogs"
  ON catalogs FOR DELETE
  USING (auth.uid() = user_id);