-- Neon-compatible schema for Virtual Goods Hub (simplified)

-- Enums
CREATE TYPE public.app_role AS ENUM ('admin', 'seller', 'buyer')
CREATE TYPE public.membership_status AS ENUM ('free', 'member')
CREATE TYPE public.commission_tier AS ENUM ('basic', 'pro')
CREATE TYPE public.product_category AS ENUM ('ebook', 'template', 'anime_art', 'birthday_card', 'anniversary_card', 'landing_page', 'logo_design', 'podcast', 'other')
CREATE TYPE public.product_status AS ENUM ('draft', 'published', 'unpublished')
CREATE TYPE public.order_status AS ENUM ('pending', 'completed', 'failed', 'refunded')
CREATE TYPE public.plan_type AS ENUM ('seller_pro', 'buyer_member')

-- Auth users table
CREATE TABLE public.users (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), email TEXT UNIQUE NOT NULL, password_hash TEXT, full_name TEXT, avatar_url TEXT, role public.app_role NOT NULL DEFAULT 'buyer', email_verified BOOLEAN DEFAULT false, created_at TIMESTAMPTZ NOT NULL DEFAULT now(), updated_at TIMESTAMPTZ NOT NULL DEFAULT now())

-- Profiles table
CREATE TABLE public.profiles (id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY, user_id UUID NOT NULL UNIQUE REFERENCES public.users(id) ON DELETE CASCADE, full_name TEXT, avatar_url TEXT, role public.app_role NOT NULL DEFAULT 'buyer', membership_status public.membership_status NOT NULL DEFAULT 'free', created_at TIMESTAMPTZ NOT NULL DEFAULT now(), updated_at TIMESTAMPTZ NOT NULL DEFAULT now())

-- Stores table
CREATE TABLE public.stores (id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY, seller_id UUID NOT NULL REFERENCES public.profiles(user_id) ON DELETE CASCADE, store_name TEXT NOT NULL, slug TEXT NOT NULL UNIQUE, description TEXT, logo_url TEXT, commission_tier public.commission_tier NOT NULL DEFAULT 'basic', monthly_subscription_active BOOLEAN NOT NULL DEFAULT false, created_at TIMESTAMPTZ NOT NULL DEFAULT now(), updated_at TIMESTAMPTZ NOT NULL DEFAULT now())

-- Products table
CREATE TABLE public.products (id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY, store_id UUID NOT NULL REFERENCES public.stores(id) ON DELETE CASCADE, title TEXT NOT NULL, description TEXT, category public.product_category NOT NULL DEFAULT 'other', price INTEGER NOT NULL CHECK (price > 0), discount_price INTEGER, file_url TEXT, preview_url TEXT, status public.product_status NOT NULL DEFAULT 'draft', created_at TIMESTAMPTZ NOT NULL DEFAULT now(), updated_at TIMESTAMPTZ NOT NULL DEFAULT now())

-- Subscriptions table
CREATE TABLE public.subscriptions (id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY, user_id UUID NOT NULL REFERENCES public.profiles(user_id) ON DELETE CASCADE, plan_type public.plan_type NOT NULL, starts_at TIMESTAMPTZ NOT NULL DEFAULT now(), expires_at TIMESTAMPTZ NOT NULL, active BOOLEAN NOT NULL DEFAULT true, created_at TIMESTAMPTZ NOT NULL DEFAULT now())

-- Orders table
CREATE TABLE public.orders (id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY, buyer_id UUID NOT NULL REFERENCES public.profiles(user_id) ON DELETE CASCADE, total_amount INTEGER NOT NULL DEFAULT 0, platform_fee_collected INTEGER NOT NULL DEFAULT 0, status public.order_status NOT NULL DEFAULT 'pending', created_at TIMESTAMPTZ NOT NULL DEFAULT now(), updated_at TIMESTAMPTZ NOT NULL DEFAULT now())

-- Order items table
CREATE TABLE public.order_items (id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY, order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE, product_id UUID NOT NULL REFERENCES public.products(id), price_at_purchase INTEGER NOT NULL, platform_fee INTEGER NOT NULL DEFAULT 0, created_at TIMESTAMPTZ NOT NULL DEFAULT now())

-- User roles table
CREATE TABLE public.user_roles (id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY, user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE, role public.app_role NOT NULL, UNIQUE (user_id, role))

-- Indexes
CREATE INDEX idx_users_email ON public.users(email)
CREATE INDEX idx_stores_seller ON public.stores(seller_id)
CREATE INDEX idx_stores_slug ON public.stores(slug)
CREATE INDEX idx_products_store ON public.products(store_id)
CREATE INDEX idx_products_category ON public.products(category)
CREATE INDEX idx_products_status ON public.products(status)
CREATE INDEX idx_orders_buyer ON public.orders(buyer_id)
CREATE INDEX idx_order_items_order ON public.order_items(order_id)
CREATE INDEX idx_subscriptions_user ON public.subscriptions(user_id)
CREATE INDEX idx_user_roles_user ON public.user_roles(user_id)
