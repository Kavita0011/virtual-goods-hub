
-- 1. Fix product-previews upload policy - scope to store owners
DROP POLICY IF EXISTS "Sellers can upload previews" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can upload previews" ON storage.objects;

CREATE POLICY "Store owners can upload previews"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'product-previews'
  AND auth.role() = 'authenticated'
  AND EXISTS (
    SELECT 1 FROM public.stores
    WHERE seller_id = auth.uid()
  )
);

-- 2. Fix product-files upload policy - scope to store owners
DROP POLICY IF EXISTS "Sellers can upload files" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can upload files" ON storage.objects;

CREATE POLICY "Store owners can upload product files"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'product-files'
  AND auth.role() = 'authenticated'
  AND EXISTS (
    SELECT 1 FROM public.stores
    WHERE seller_id = auth.uid()
  )
);

-- 3. Add DELETE policy for product-files (store owners only)
CREATE POLICY "Store owners can delete own product files"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'product-files'
  AND EXISTS (
    SELECT 1 FROM public.products p
    JOIN public.stores s ON s.id = p.store_id
    WHERE p.file_url LIKE '%' || storage.filename(name) || '%'
    AND s.seller_id = auth.uid()
  )
);

-- 4. Add UPDATE policy for product-files (store owners only)
CREATE POLICY "Store owners can update own product files"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'product-files'
  AND EXISTS (
    SELECT 1 FROM public.products p
    JOIN public.stores s ON s.id = p.store_id
    WHERE p.file_url LIKE '%' || storage.filename(name) || '%'
    AND s.seller_id = auth.uid()
  )
);

-- 5. Add DELETE policy for product-previews (store owners only)
DROP POLICY IF EXISTS "Sellers can delete previews" ON storage.objects;

CREATE POLICY "Store owners can delete previews"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'product-previews'
  AND EXISTS (
    SELECT 1 FROM public.stores
    WHERE seller_id = auth.uid()
  )
);

-- 6. Add UPDATE policy for product-previews (store owners only)
DROP POLICY IF EXISTS "Sellers can update previews" ON storage.objects;

CREATE POLICY "Store owners can update previews"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'product-previews'
  AND EXISTS (
    SELECT 1 FROM public.stores
    WHERE seller_id = auth.uid()
  )
);
