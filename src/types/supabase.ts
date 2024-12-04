export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export interface Database {
    public: {
        Tables: {
            catalogs: {
                Row: {
                    id: string
                    name: string
                    slug: string
                    description: string | null
                    user_id: string
                    is_published: boolean
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    name: string
                    slug: string
                    description?: string | null
                    user_id: string
                    is_published?: boolean
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    name?: string
                    slug?: string
                    description?: string | null
                    user_id?: string
                    is_published?: boolean
                    created_at?: string
                    updated_at?: string
                }
            }
            categories: {
                Row: {
                    id: string
                    name: string
                    slug: string
                    icon: string
                    catalog_id: string
                    created_at: string
                }
                Insert: {
                    id?: string
                    name: string
                    slug: string
                    icon: string
                    catalog_id: string
                    created_at?: string
                }
                Update: {
                    id?: string
                    name?: string
                    slug?: string
                    icon?: string
                    catalog_id?: string
                    created_at?: string
                }
            }
            products: {
                Row: {
                    id: string
                    title: string
                    slug: string
                    description: string
                    brand: string
                    category_id: string
                    catalog_id: string
                    image_url: string
                    price: number
                    stock_status: 'in_stock' | 'out_of_stock' | 'low_stock'
                    flags: string[]
                    created_at: string
                    updated_at: string
                    show_price: boolean
                }
                Insert: {
                    id?: string
                    title: string
                    slug: string
                    description: string
                    brand: string
                    category_id: string
                    catalog_id: string
                    image_url: string
                    price: number
                    stock_status?: 'in_stock' | 'out_of_stock' | 'low_stock'
                    flags?: string[]
                    created_at?: string
                    updated_at?: string
                    show_price?: boolean
                }
                Update: {
                    id?: string
                    title?: string
                    slug?: string
                    description?: string
                    brand?: string
                    category_id?: string
                    catalog_id?: string
                    image_url?: string
                    price?: number
                    stock_status?: 'in_stock' | 'out_of_stock' | 'low_stock'
                    flags?: string[]
                    created_at?: string
                    updated_at?: string
                    show_price?: boolean
                }
            }
            profiles: {
                Row: {
                    id: string
                    email: string
                    full_name: string
                    avatar_url: string | null
                    created_at: string
                    is_admin: boolean
                }
                Insert: {
                    id: string
                    email: string
                    full_name: string
                    avatar_url?: string | null
                    created_at?: string
                    is_admin?: boolean
                }
                Update: {
                    id?: string
                    email?: string
                    full_name?: string
                    avatar_url?: string | null
                    created_at?: string
                    is_admin?: boolean
                }
            }
        }
        Views: {
            [_ in never]: never
        }
        Functions: {
            [_ in never]: never
        }
        Enums: {
            [_ in never]: never
        }
    }
}
