-- Enable the storage extension if not already enabled
create extension if not exists "storage" schema "storage";

-- Create products bucket
insert into storage.buckets (id, name)
values ('products', 'products')
on conflict (id) do nothing;

-- Create brands bucket
insert into storage.buckets (id, name)
values ('brands', 'brands')
on conflict (id) do nothing;

-- Set up storage policies for products bucket
create policy "Public Access"
  on storage.objects for select
  using ( bucket_id = 'products' );

create policy "Authenticated users can upload product images"
  on storage.objects for insert
  with check (
    bucket_id = 'products'
    and auth.role() = 'authenticated'
  );

create policy "Users can update their own product images"
  on storage.objects for update
  using (
    bucket_id = 'products'
    and auth.uid() = owner
  );

create policy "Users can delete their own product images"
  on storage.objects for delete
  using (
    bucket_id = 'products'
    and auth.uid() = owner
  );

-- Set up storage policies for brands bucket
create policy "Public Access"
  on storage.objects for select
  using ( bucket_id = 'brands' );

create policy "Authenticated users can upload brand logos"
  on storage.objects for insert
  with check (
    bucket_id = 'brands'
    and auth.role() = 'authenticated'
  );

create policy "Users can update their own brand logos"
  on storage.objects for update
  using (
    bucket_id = 'brands'
    and auth.uid() = owner
  );

create policy "Users can delete their own brand logos"
  on storage.objects for delete
  using (
    bucket_id = 'brands'
    and auth.uid() = owner
  );