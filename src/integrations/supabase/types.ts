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
      additional_services: {
        Row: {
          created_at: string
          description: string | null
          id: string
          is_optional: boolean | null
          name: string
          price: number
          service_type: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          is_optional?: boolean | null
          name: string
          price?: number
          service_type: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          is_optional?: boolean | null
          name?: string
          price?: number
          service_type?: string
        }
        Relationships: []
      }
      cities: {
        Row: {
          country_id: string | null
          created_at: string
          id: string
          name: string
        }
        Insert: {
          country_id?: string | null
          created_at?: string
          id?: string
          name: string
        }
        Update: {
          country_id?: string | null
          created_at?: string
          id?: string
          name?: string
        }
        Relationships: [
          {
            foreignKeyName: "cities_country_id_fkey"
            columns: ["country_id"]
            isOneToOne: false
            referencedRelation: "countries"
            referencedColumns: ["id"]
          },
        ]
      }
      countries: {
        Row: {
          code: string
          created_at: string
          id: string
          name: string
        }
        Insert: {
          code: string
          created_at?: string
          id?: string
          name: string
        }
        Update: {
          code?: string
          created_at?: string
          id?: string
          name?: string
        }
        Relationships: []
      }
      customer_bookings: {
        Row: {
          booking_date: string
          created_at: string | null
          customer_email: string
          customer_name: string
          id: string
          notes: string | null
          phone: string | null
          program_id: string | null
          status: string | null
        }
        Insert: {
          booking_date: string
          created_at?: string | null
          customer_email: string
          customer_name: string
          id?: string
          notes?: string | null
          phone?: string | null
          program_id?: string | null
          status?: string | null
        }
        Update: {
          booking_date?: string
          created_at?: string | null
          customer_email?: string
          customer_name?: string
          id?: string
          notes?: string | null
          phone?: string | null
          program_id?: string | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "customer_bookings_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "programs"
            referencedColumns: ["id"]
          },
        ]
      }
      day_tours: {
        Row: {
          activity_type: string | null
          created_at: string
          day_id: string | null
          description: string | null
          end_time: string | null
          id: string
          images: Json | null
          location: string | null
          notes: string | null
          sort_order: number
          start_time: string | null
          title: string
        }
        Insert: {
          activity_type?: string | null
          created_at?: string
          day_id?: string | null
          description?: string | null
          end_time?: string | null
          id?: string
          images?: Json | null
          location?: string | null
          notes?: string | null
          sort_order?: number
          start_time?: string | null
          title: string
        }
        Update: {
          activity_type?: string | null
          created_at?: string
          day_id?: string | null
          description?: string | null
          end_time?: string | null
          id?: string
          images?: Json | null
          location?: string | null
          notes?: string | null
          sort_order?: number
          start_time?: string | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "day_tours_day_id_fkey"
            columns: ["day_id"]
            isOneToOne: false
            referencedRelation: "program_days"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string | null
          email: string
          full_name: string | null
          id: string
          is_approved: boolean | null
          role: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          full_name?: string | null
          id: string
          is_approved?: boolean | null
          role?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          full_name?: string | null
          id?: string
          is_approved?: boolean | null
          role?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      program_categories: {
        Row: {
          created_at: string
          description: string | null
          id: string
          name: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          name: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      program_days: {
        Row: {
          city_id: string | null
          created_at: string
          day_number: number
          description: string | null
          id: string
          program_id: string | null
          sort_order: number
          title: string
        }
        Insert: {
          city_id?: string | null
          created_at?: string
          day_number: number
          description?: string | null
          id?: string
          program_id?: string | null
          sort_order?: number
          title: string
        }
        Update: {
          city_id?: string | null
          created_at?: string
          day_number?: number
          description?: string | null
          id?: string
          program_id?: string | null
          sort_order?: number
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "program_days_city_id_fkey"
            columns: ["city_id"]
            isOneToOne: false
            referencedRelation: "cities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "program_days_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "programs"
            referencedColumns: ["id"]
          },
        ]
      }
      program_services: {
        Row: {
          created_at: string
          id: string
          is_included: boolean | null
          program_id: string | null
          service_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          is_included?: boolean | null
          program_id?: string | null
          service_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          is_included?: boolean | null
          program_id?: string | null
          service_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "program_services_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "programs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "program_services_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "additional_services"
            referencedColumns: ["id"]
          },
        ]
      }
      programs: {
        Row: {
          activities: string[]
          category_id: string | null
          cities: string[]
          country: string
          created_at: string | null
          description: string | null
          difficulty_level: string | null
          duration: string
          featured_image: string | null
          gallery: Json | null
          hotels: string[]
          id: string
          includes: string[]
          is_available: boolean | null
          max_participants: number | null
          min_participants: number | null
          name: string
          price: string
          season: string | null
          updated_at: string | null
        }
        Insert: {
          activities: string[]
          category_id?: string | null
          cities: string[]
          country: string
          created_at?: string | null
          description?: string | null
          difficulty_level?: string | null
          duration: string
          featured_image?: string | null
          gallery?: Json | null
          hotels: string[]
          id?: string
          includes: string[]
          is_available?: boolean | null
          max_participants?: number | null
          min_participants?: number | null
          name: string
          price: string
          season?: string | null
          updated_at?: string | null
        }
        Update: {
          activities?: string[]
          category_id?: string | null
          cities?: string[]
          country?: string
          created_at?: string | null
          description?: string | null
          difficulty_level?: string | null
          duration?: string
          featured_image?: string | null
          gallery?: Json | null
          hotels?: string[]
          id?: string
          includes?: string[]
          is_available?: boolean | null
          max_participants?: number | null
          min_participants?: number | null
          name?: string
          price?: string
          season?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "programs_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "program_categories"
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
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
