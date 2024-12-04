-- Add username prefix to catalog URLs
ALTER TABLE catalogs
ADD COLUMN url_path TEXT GENERATED ALWAYS AS (
  (SELECT username FROM profiles WHERE profiles.id = user_id) || '/' || slug
) STORED;

-- Create unique index on the full URL path
CREATE UNIQUE INDEX catalogs_url_path_idx ON catalogs (url_path);

-- Update RLS policies for URL uniqueness
CREATE POLICY "Ensure unique URL paths across all users"
  ON catalogs
  FOR ALL
  USING (
    NOT EXISTS (
      SELECT 1 FROM catalogs c2
      WHERE c2.url_path = (
        SELECT username FROM profiles WHERE profiles.id = NEW.user_id
      ) || '/' || NEW.slug
      AND c2.id != COALESCE(NEW.id, '00000000-0000-0000-0000-000000000000'::uuid)
    )
  );