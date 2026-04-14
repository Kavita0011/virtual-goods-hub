
-- Enums
CREATE TYPE public.app_role AS ENUM ('admin', 'seller', 'buyer');
CREATE TYPE public.membership_status AS ENUM ('free', 'member');
CREATE TYPE public.commission_tier AS ENUM ('basic', 'pro');
CREATE TYPE public.product_category AS ENUM ('ebook', 'template', 'anime_art', 'birthday_card', 'anniversary_card', 'landing_page', 'logo_design', 'podcast', 'other');
CREATE TYPE public.product_status AS ENUM ('draft', 'published', 'unpublished');
CREATE TYPE public.order_status AS ENUM ('pending', 'completed', 'failed', 'refunded');
CREATE TYPE public.plan_type AS ENUM ('seller_pro', 'buyer_member');

-- Profiles table
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  avatar_url TEXT,
  role public.app_role NOT NULL DEFAULT 'buyer',
  membership_status public.membership_status NOT NULL DEFAULT 'free',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Profiles are viewable by everyone" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Stores table
CREATE TABLE public.stores (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  seller_id UUID NOT NULL REFERENCES public.profiles(user_id) ON DELETE CASCADE,
  store_name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  logo_url TEXT,
  commission_tier public.commission_tier NOT NULL DEFAULT 'basic',
  monthly_subscription_active BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.stores ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Stores are viewable by everyone" ON public.stores FOR SELECT USING (true);
CREATE POLICY "Sellers can create own store" ON public.stores FOR INSERT WITH CHECK (auth.uid() = seller_id);
CREATE POLICY "Sellers can update own store" ON public.stores FOR UPDATE USING (auth.uid() = seller_id);
CREATE POLICY "Sellers can delete own store" ON public.stores FOR DELETE USING (auth.uid() = seller_id);

-- Products table
CREATE TABLE public.products (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  store_id UUID NOT NULL REFERENCES public.stores(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  category public.product_category NOT NULL DEFAULT 'other',
  price INTEGER NOT NULL CHECK (price > 0),
  discount_price INTEGER,
  file_url TEXT,
  preview_url TEXT,
  status public.product_status NOT NULL DEFAULT 'draft',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Security definer to check store ownership
CREATE OR REPLACE FUNCTION public.is_store_owner(_store_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.stores WHERE id = _store_id AND seller_id = auth.uid()
  )
$$;

CREATE POLICY "Published products viewable by everyone" ON public.products FOR SELECT USING (status = 'published' OR public.is_store_owner(store_id));
CREATE POLICY "Store owners can insert products" ON public.products FOR INSERT WITH CHECK (public.is_store_owner(store_id));
CREATE POLICY "Store owners can update products" ON public.products FOR UPDATE USING (public.is_store_owner(store_id));
CREATE POLICY "Store owners can delete products" ON public.products FOR DELETE USING (public.is_store_owner(store_id));

-- Subscriptions table
CREATE TABLE public.subscriptions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.profiles(user_id) ON DELETE CASCADE,
  plan_type public.plan_type NOT NULL,
  starts_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  expires_at TIMESTAMPTZ NOT NULL,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own subscriptions" ON public.subscriptions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own subscriptions" ON public.subscriptions FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Orders table
CREATE TABLE public.orders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  buyer_id UUID NOT NULL REFERENCES public.profiles(user_id) ON DELETE CASCADE,
  total_amount INTEGER NOT NULL DEFAULT 0,
  platform_fee_collected INTEGER NOT NULL DEFAULT 0,
  status public.order_status NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Buyers can view own orders" ON public.orders FOR SELECT USING (auth.uid() = buyer_id);
CREATE POLICY "Buyers can create orders" ON public.orders FOR INSERT WITH CHECK (auth.uid() = buyer_id);
CREATE POLICY "Buyers can update own orders" ON public.orders FOR UPDATE USING (auth.uid() = buyer_id);

-- Order items table
CREATE TABLE public.order_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES public.products(id),
  price_at_purchase INTEGER NOT NULL,
  platform_fee INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

-- Security definer to check order ownership
CREATE OR REPLACE FUNCTION public.is_order_owner(_order_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.orders WHERE id = _order_id AND buyer_id = auth.uid()
  )
$$;

CREATE POLICY "Buyers can view own order items" ON public.order_items FOR SELECT USING (public.is_order_owner(order_id));
CREATE POLICY "Buyers can insert order items" ON public.order_items FOR INSERT WITH CHECK (public.is_order_owner(order_id));

-- User roles table (for admin checks without recursion)
CREATE TABLE public.user_roles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  UNIQUE (user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role
  )
$$;

CREATE POLICY "Users can view own roles" ON public.user_roles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins can manage roles" ON public.user_roles FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Updated_at trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_stores_updated_at BEFORE UPDATE ON public.stores FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON public.products FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON public.orders FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, full_name, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE((NEW.raw_user_meta_data->>'role')::public.app_role, 'buyer')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Product limit trigger (5 products max for basic tier)
CREATE OR REPLACE FUNCTION public.check_product_limit()
RETURNS TRIGGER AS $$
DECLARE
  store_tier public.commission_tier;
  product_count INTEGER;
BEGIN
  SELECT commission_tier INTO store_tier FROM public.stores WHERE id = NEW.store_id;
  
  IF store_tier = 'basic' THEN
    SELECT COUNT(*) INTO product_count FROM public.products WHERE store_id = NEW.store_id;
    IF product_count >= 5 THEN
      RAISE EXCEPTION 'Basic tier stores are limited to 5 products. Upgrade to Pro for unlimited products.';
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER trigger_limit_check
  BEFORE INSERT ON public.products
  FOR EACH ROW EXECUTE FUNCTION public.check_product_limit();

-- Commission calculation trigger
CREATE OR REPLACE FUNCTION public.calculate_commission()
RETURNS TRIGGER AS $$
DECLARE
  store_tier public.commission_tier;
  fee_rate NUMERIC;
BEGIN
  SELECT s.commission_tier INTO store_tier
  FROM public.products p
  JOIN public.stores s ON s.id = p.store_id
  WHERE p.id = NEW.product_id;

  IF store_tier = 'pro' THEN
    fee_rate := 0.15;
  ELSE
    fee_rate := 0.40;
  END IF;

  NEW.platform_fee := ROUND(NEW.price_at_purchase * fee_rate);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER trigger_commission_calc
  BEFORE INSERT ON public.order_items
  FOR EACH ROW EXECUTE FUNCTION public.calculate_commission();

-- Indexes
CREATE INDEX idx_stores_seller ON public.stores(seller_id);
CREATE INDEX idx_products_store ON public.products(store_id);
CREATE INDEX idx_products_category ON public.products(category);
CREATE INDEX idx_products_status ON public.products(status);
CREATE INDEX idx_orders_buyer ON public.orders(buyer_id);
CREATE INDEX idx_order_items_order ON public.order_items(order_id);
CREATE INDEX idx_subscriptions_user ON public.subscriptions(user_id);

-- Storage bucket for product files
INSERT INTO storage.buckets (id, name, public) VALUES ('product-files', 'product-files', false);
INSERT INTO storage.buckets (id, name, public) VALUES ('product-previews', 'product-previews', true);
INSERT INTO storage.buckets (id, name, public) VALUES ('avatars', 'avatars', true);

-- Storage policies
CREATE POLICY "Product previews are public" ON storage.objects FOR SELECT USING (bucket_id = 'product-previews');
CREATE POLICY "Avatars are public" ON storage.objects FOR SELECT USING (bucket_id = 'avatars');
CREATE POLICY "Authenticated users can upload avatars" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "Users can update own avatar" ON storage.objects FOR UPDATE USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "Authenticated users can upload previews" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'product-previews' AND auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can upload product files" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'product-files' AND auth.role() = 'authenticated');
CREATE POLICY "Users can access purchased files" ON storage.objects FOR SELECT USING (bucket_id = 'product-files' AND auth.role() = 'authenticated');
