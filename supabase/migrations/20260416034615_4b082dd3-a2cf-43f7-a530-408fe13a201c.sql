
-- 1. Fix admin role self-assignment in handle_new_user trigger
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, full_name, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    CASE
      WHEN (NEW.raw_user_meta_data->>'role') = 'seller' THEN 'seller'::public.app_role
      ELSE 'buyer'::public.app_role
    END
  );
  RETURN NEW;
END;
$$;

-- 2. Fix profiles public exposure - restrict SELECT to own profile + admins
DROP POLICY IF EXISTS "Profiles are viewable by everyone" ON public.profiles;

CREATE POLICY "Users can view own profile"
ON public.profiles
FOR SELECT
USING (
  auth.uid() = user_id
  OR public.has_role(auth.uid(), 'admin')
);

-- 3. Fix storage policy for product-files bucket
DROP POLICY IF EXISTS "Users can access purchased files" ON storage.objects;

CREATE POLICY "Purchasers can access product files"
ON storage.objects
FOR SELECT
USING (
  bucket_id = 'product-files'
  AND EXISTS (
    SELECT 1 FROM public.order_items oi
    JOIN public.orders o ON o.id = oi.order_id
    JOIN public.products p ON p.id = oi.product_id
    WHERE p.file_url LIKE '%' || storage.filename(name) || '%'
    AND o.buyer_id = auth.uid()
    AND o.status = 'completed'
  )
);

-- Also allow store owners to access their own product files
CREATE POLICY "Store owners can access own product files"
ON storage.objects
FOR SELECT
USING (
  bucket_id = 'product-files'
  AND EXISTS (
    SELECT 1 FROM public.products p
    JOIN public.stores s ON s.id = p.store_id
    WHERE p.file_url LIKE '%' || storage.filename(name) || '%'
    AND s.seller_id = auth.uid()
  )
);
