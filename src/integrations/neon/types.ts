export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
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
        Insert: {
          created_at?: string
          id?: string
          order_id: string
          platform_fee?: number
          price_at_purchase: number
          product_id: string
        }
        Update: {
          created_at?: string
          id?: string
          order_id?: string
          platform_fee?: number
          price_at_purchase?: number
          product_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
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
        Insert: {
          buyer_id: string
          created_at?: string
          id?: string
          platform_fee_collected?: number
          status?: Database["public"]["Enums"]["order_status"]
          total_amount?: number
          updated_at?: string
        }
        Update: {
          buyer_id?: string
          created_at?: string
          id?: string
          platform_fee_collected?: number
          status?: Database["public"]["Enums"]["order_status"]
          total_amount?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "orders_buyer_id_fkey"
            columns: ["buyer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
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
        Insert: {
          category?: Database["public"]["Enums"]["product_category"]
          created_at?: string
          description?: string | null
          discount_price?: number | null
          file_url?: string | null
          id?: string
          preview_url?: string | null
          price: number
          status?: Database["public"]["Enums"]["product_status"]
          store_id: string
          title: string
          updated_at?: string
        }
        Update: {
          category?: Database["public"]["Enums"]["product_category"]
          created_at?: string
          description?: string | null
          discount_price?: number | null
          file_url?: string | null
          id?: string
          preview_url?: string | null
          price?: number
          status?: Database["public"]["Enums"]["product_status"]
          store_id?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "products_store_id_fkey"
            columns: ["store_id"]
            isOneToOne: false
            referencedRelation: "stores"
            referencedColumns: ["id"]
          },
        ]
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
        Insert: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          membership_status?: Database["public"]["Enums"]["membership_status"]
          role?: Database["public"]["Enums"]["app_role"]
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          membership_status?: Database["public"]["Enums"]["membership_status"]
          role?: Database["public"]["Enums"]["app_role"]
          updated_at?: string
          user_id?: string
        }
        Relationships: []
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
        Insert: {
          commission_tier?: Database["public"]["Enums"]["commission_tier"]
          created_at?: string
          description?: string | null
          id?: string
          logo_url?: string | null
          monthly_subscription_active?: boolean
          seller_id: string
          slug: string
          store_name: string
          updated_at?: string
        }
        Update: {
          commission_tier?: Database["public"]["Enums"]["commission_tier"]
          created_at?: string
          description?: string | null
          id?: string
          logo_url?: string | null
          monthly_subscription_active?: boolean
          seller_id?: string
          slug?: string
          store_name?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "stores_seller_id_fkey"
            columns: ["seller_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
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
        Insert: {
          active?: boolean
          created_at?: string
          expires_at: string
          id?: string
          plan_type: Database["public"]["Enums"]["plan_type"]
          starts_at?: string
          user_id: string
        }
        Update: {
          active?: boolean
          created_at?: string
          expires_at?: string
          id?: string
          plan_type?: Database["public"]["Enums"]["plan_type"]
          starts_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "subscriptions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_order_owner: { Args: { _order_id: string }; Returns: boolean }
      is_store_owner: { Args: { _store_id: string }; Returns: boolean }
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
      product_status: "draft" | "published" | "unpublished"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

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
      ],
      product_status: ["draft", "published", "unpublished"],
    },
  },
} as const
