-- Add logo_url column to profiles table
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS logo_url TEXT;

-- Update storage policies to allow profile logo uploads
create policy "Users can upload their own profile logos"
  on storage.objects for insert
  with check (
    bucket_id = 'profiles' and
    auth.uid() = owner
  );

create policy "Users can update their own profile logos"
  on storage.objects for update
  using (
    bucket_id = 'profiles' and
    auth.uid() = owner
  );

create policy "Users can delete their own profile logos"
  on storage.objects for delete
  using (
    bucket_id = 'profiles' and
    auth.uid() = owner
  );

create policy "Profile logos are publicly accessible"
  on storage.objects for select
  using (bucket_id = 'profiles');

-- Create profiles bucket if it doesn't exist
insert into storage.buckets (id, name, public)
values ('profiles', 'profiles', true)
on conflict (id) do nothing;