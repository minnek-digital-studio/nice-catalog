-- Add username column to profiles table
ALTER TABLE profiles ADD COLUMN username TEXT UNIQUE;

-- Create index for faster username lookups
CREATE INDEX profiles_username_idx ON profiles (username);

-- Update RLS policies to include username checks
CREATE POLICY "Usernames are publicly readable"
  ON profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can update their own username"
  ON profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (
    -- Ensure username is unique (handled by UNIQUE constraint)
    -- Ensure username format is valid (handled by application logic)
    auth.uid() = id
  );