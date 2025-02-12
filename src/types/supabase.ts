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
      brands: {
        Row: {
          catalog_id: string
          created_at: string | null
          id: string
          logo_url: string | null
          name: string
        }
        Insert: {
          catalog_id: string
          created_at?: string | null
          id?: string
          logo_url?: string | null
          name: string
        }
        Update: {
          catalog_id?: string
          created_at?: string | null
          id?: string
          logo_url?: string | null
          name?: string
        }
        Relationships: [
          {
            foreignKeyName: "brands_catalog_id_fkey"
            columns: ["catalog_id"]
            isOneToOne: false
            referencedRelation: "catalogs"
            referencedColumns: ["id"]
          },
        ]
      }
      catalogs: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          is_published: boolean | null
          name: string
          slug: string
          updated_at: string | null
          url_path: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          is_published?: boolean | null
          name: string
          slug: string
          updated_at?: string | null
          url_path?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          is_published?: boolean | null
          name?: string
          slug?: string
          updated_at?: string | null
          url_path?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "catalogs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      categories: {
        Row: {
          catalog_id: string | null
          created_at: string
          icon: string
          id: string
          name: string
          position: number
          slug: string
        }
        Insert: {
          catalog_id?: string | null
          created_at?: string
          icon: string
          id?: string
          name: string
          position: number
          slug: string
        }
        Update: {
          catalog_id?: string | null
          created_at?: string
          icon?: string
          id?: string
          name?: string
          position?: number
          slug?: string
        }
        Relationships: []
      }
      product_images: {
        Row: {
          created_at: string | null
          id: string
          is_primary: boolean
          position: number | null
          product_id: string
          url: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_primary?: boolean
          position?: number | null
          product_id: string
          url: string
        }
        Update: {
          created_at?: string | null
          id?: string
          is_primary?: boolean
          position?: number | null
          product_id?: string
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_images_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          brand: string
          brand_id: string | null
          catalog_id: string | null
          category_id: string
          created_at: string
          description: string | null
          flags: string[] | null
          id: string
          image_url: string
          is_published: boolean | null
          is_visible: boolean | null
          position: number | null
          price: number | null
          promo_text: string | null
          show_promo: boolean | null
          slug: string
          stock_status: string | null
          title: string
          updated_at: string
          visible: boolean
        }
        Insert: {
          brand: string
          brand_id?: string | null
          catalog_id?: string | null
          category_id: string
          created_at?: string
          description?: string | null
          flags?: string[] | null
          id?: string
          image_url: string
          is_published?: boolean | null
          is_visible?: boolean | null
          position?: number | null
          price?: number | null
          promo_text?: string | null
          show_promo?: boolean | null
          slug: string
          stock_status?: string | null
          title: string
          updated_at?: string
          visible?: boolean
        }
        Update: {
          brand?: string
          brand_id?: string | null
          catalog_id?: string | null
          category_id?: string
          created_at?: string
          description?: string | null
          flags?: string[] | null
          id?: string
          image_url?: string
          is_published?: boolean | null
          is_visible?: boolean | null
          position?: number | null
          price?: number | null
          promo_text?: string | null
          show_promo?: boolean | null
          slug?: string
          stock_status?: string | null
          title?: string
          updated_at?: string
          visible?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "products_brand_id_fkey"
            columns: ["brand_id"]
            isOneToOne: false
            referencedRelation: "brands"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "products_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string
          full_name: string
          id: string
          logo_url: string | null
          username: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email: string
          full_name: string
          id: string
          logo_url?: string | null
          username?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string
          full_name?: string
          id?: string
          logo_url?: string | null
          username?: string | null
        }
        Relationships: []
      }
      subscription_plans: {
        Row: {
          catalog_limit: number
          created_at: string | null
          id: string
          name: string
          price: number
          product_limit: number
          stripe_price_id: string | null
          type: Database["public"]["Enums"]["plan_type"]
          updated_at: string | null
        }
        Insert: {
          catalog_limit: number
          created_at?: string | null
          id?: string
          name: string
          price: number
          product_limit: number
          stripe_price_id?: string | null
          type: Database["public"]["Enums"]["plan_type"]
          updated_at?: string | null
        }
        Update: {
          catalog_limit?: number
          created_at?: string | null
          id?: string
          name?: string
          price?: number
          product_limit?: number
          stripe_price_id?: string | null
          type?: Database["public"]["Enums"]["plan_type"]
          updated_at?: string | null
        }
        Relationships: []
      }
      user_subscriptions: {
        Row: {
          cancel_at_period_end: boolean | null
          created_at: string | null
          current_period_end: string
          current_period_start: string
          id: string
          plan_id: string
          status: string
          stripe_customer_id: string | null
          stripe_subscription_id: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          cancel_at_period_end?: boolean | null
          created_at?: string | null
          current_period_end: string
          current_period_start: string
          id?: string
          plan_id: string
          status: string
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          cancel_at_period_end?: boolean | null
          created_at?: string | null
          current_period_end?: string
          current_period_start?: string
          id?: string
          plan_id?: string
          status?: string
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_subscriptions_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "subscription_plans"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_subscriptions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      plan_type: "free" | "basic" | "pro"
      stock_status: "in_stock" | "low_stock" | "out_of_stock"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
