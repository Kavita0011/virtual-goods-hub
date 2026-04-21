export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      order_items: {
        Row: {
          created_at: string
          id: string
          order_id: string
          platform_fee: number
          price_at_purchase: number
          product_id: string
        }
      }
      orders: {
        Row: {
          buyer_id: string
          created_at: string
          id: string
          platform_fee_collected: number
          status: Database["public"]["Enums"]["order_status"]
          total_amount: number
          updated_at: string
        }
      }
      products: {
        Row: {
          category: Database["public"]["Enums"]["product_category"]
          created_at: string
          description: string | null
          discount_price: number | null
          file_url: string | null
          id: string
          preview_url: string | null
          price: number
          status: Database["public"]["Enums"]["product_status"]
          store_id: string
          title: string
          updated_at: string
        }
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          full_name: string | null
          id: string
          membership_status: Database["public"]["Enums"]["membership_status"]
          role: Database["public"]["Enums"]["app_role"]
          updated_at: string
          user_id: string
        }
      }
      stores: {
        Row: {
          commission_tier: Database["public"]["Enums"]["commission_tier"]
          created_at: string
          description: string | null
          id: string
          logo_url: string | null
          monthly_subscription_active: boolean
          seller_id: string
          slug: string
          store_name: string
          updated_at: string
        }
      }
      subscriptions: {
        Row: {
          active: boolean
          created_at: string
          expires_at: string
          id: string
          plan_type: Database["public"]["Enums"]["plan_type"]
          starts_at: string
          user_id: string
        }
      }
      users: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string
          email_verified: boolean
          full_name: string | null
          id: string
          password_hash: string | null
          role: Database["public"]["Enums"]["app_role"]
          updated_at: string
        }
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
      }
    }
    Enums: {
      app_role: "admin" | "seller" | "buyer"
      commission_tier: "basic" | "pro"
      membership_status: "free" | "member"
      order_status: "pending" | "completed" | "failed" | "refunded"
      plan_type: "seller_pro" | "buyer_member"
      product_category:
        | "ebook"
        | "template"
        | "anime_art"
        | "birthday_card"
        | "anniversary_card"
        | "landing_page"
        | "logo_design"
        | "podcast"
        | "other"
        | "jewelry"
        | "art"
        | "nail_art"
        | "nail_design"
        | "shower"
        | "baby_shower"
        | "wedding"
        | "invitation"
        | "poster"
        | "banner"
        | "social_media"
        | "print_design"
        | "graphic_design"
        | "ui_ux"
        | "web_design"
        | "illustration"
        | "vector_art"
        | "3d_model"
        | "photo_edit"
        | "font"
        | "texture"
      product_status: "draft" | "published" | "unpublished"
    }
  }
}

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "seller", "buyer"],
      commission_tier: ["basic", "pro"],
      membership_status: ["free", "member"],
      order_status: ["pending", "completed", "failed", "refunded"],
      plan_type: ["seller_pro", "buyer_member"],
      product_category: [
        "ebook",
        "template",
        "anime_art",
        "birthday_card",
        "anniversary_card",
        "landing_page",
        "logo_design",
        "podcast",
        "other",
        "jewelry",
        "art",
        "nail_art",
        "nail_design",
        "shower",
        "baby_shower",
        "wedding",
        "invitation",
        "poster",
        "banner",
        "social_media",
        "print_design",
        "graphic_design",
        "ui_ux",
        "web_design",
        "illustration",
        "vector_art",
        "3d_model",
        "photo_edit",
        "font",
        "texture"
      ],
      product_status: ["draft", "published", "unpublished"],
    },
  },
} as const;