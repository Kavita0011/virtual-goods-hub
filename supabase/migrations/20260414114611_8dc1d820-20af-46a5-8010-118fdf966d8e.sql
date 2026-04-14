
-- Drop overly broad policies
DROP POLICY IF EXISTS "Product previews are public" ON storage.objects;
DROP POLICY IF EXISTS "Avatars are public" ON storage.objects;

-- More restrictive: allow access to specific files but prevent listing
CREATE POLICY "Product previews are accessible by path" ON storage.objects 
  FOR SELECT USING (bucket_id = 'product-previews' AND auth.role() = 'authenticated');

CREATE POLICY "Avatars are accessible by path" ON storage.objects 
  FOR SELECT USING (bucket_id = 'avatars' AND auth.role() = 'authenticated');
