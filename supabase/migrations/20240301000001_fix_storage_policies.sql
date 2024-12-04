-- Drop existing policies to avoid conflicts
drop policy if exists "Public Access" on storage.objects;
drop policy if exists "Authenticated users can upload product images" on storage.objects;
drop policy if exists "Users can update their own product images" on storage.objects;
drop policy if exists "Users can delete their own product images" on storage.objects;

-- Create more specific policies
create policy "Anyone can view product images"
  on storage.objects for select
  using ( bucket_id = 'products' );

create policy "Anyone can view brand logos"
  on storage.objects for select
  using ( bucket_id = 'brands' );

create policy "Authenticated users can upload images"
  on storage.objects for insert
  with check (
    auth.role() = 'authenticated' and
    (bucket_id = 'products' or bucket_id = 'brands')
  );

create policy "Users can update their own images"
  on storage.objects for update
  using (
    auth.role() = 'authenticated' and
    (bucket_id = 'products' or bucket_id = 'brands')
  );

create policy "Users can delete their own images"
  on storage.objects for delete
  using (
    auth.role() = 'authenticated' and
    (bucket_id = 'products' or bucket_id = 'brands')
  );

-- Make buckets public
update storage.buckets
set public = true
where id in ('products', 'brands');