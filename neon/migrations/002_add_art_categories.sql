-- Add more art categories to Neon database

DO $$ BEGIN
  CREATE TYPE public.product_category AS ENUM (
    'ebook',
    'template',
    'anime_art',
    'birthday_card',
    'anniversary_card',
    'landing_page',
    'logo_design',
    'podcast',
    'other',
    -- New art categories
    'jewelry',
    'art',
    'nail_art',
    'nail_design',
    'shower',
    'baby_shower',
    'wedding',
    'invitation',
    'poster',
    'banner',
    'social_media',
    'print_design',
    'graphic_design',
    'ui_ux',
    'web_design',
    'illustration',
    'vector_art',
    '3d_model',
    'photo_edit',
    'font',
    'texture'
  );
EXCEPTION WHEN duplicate_object THEN null;
END $$;