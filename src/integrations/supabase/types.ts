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
      action_counts: {
        Row: {
          action_type: string
          count: number | null
        }
        Insert: {
          action_type: string
          count?: number | null
        }
        Update: {
          action_type?: string
          count?: number | null
        }
        Relationships: []
      }
      email_templates: {
        Row: {
          created_at: string | null
          id: string
          message_body: string
          recipients: Json
          subject: string
          template_name: string
          updated_at: string | null
          use_count: number | null
          user_name: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          message_body: string
          recipients: Json
          subject: string
          template_name: string
          updated_at?: string | null
          use_count?: number | null
          user_name?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          message_body?: string
          recipients?: Json
          subject?: string
          template_name?: string
          updated_at?: string | null
          use_count?: number | null
          user_name?: string | null
        }
        Relationships: []
      }
      templates: {
        Row: {
          body: string
          created_at: string
          created_by: string | null
          id: string
          is_public: boolean | null
          metadata: Json | null
          slug: string | null
          title: string
          updated_at: string
          uses_count: number | null
          views_count: number | null
        }
        Insert: {
          body: string
          created_at?: string
          created_by?: string | null
          id?: string
          is_public?: boolean | null
          metadata?: Json | null
          slug?: string | null
          title: string
          updated_at?: string
          uses_count?: number | null
          views_count?: number | null
        }
        Update: {
          body?: string
          created_at?: string
          created_by?: string | null
          id?: string
          is_public?: boolean | null
          metadata?: Json | null
          slug?: string | null
          title?: string
          updated_at?: string
          uses_count?: number | null
          views_count?: number | null
        }
        Relationships: []
      }
      user_actions: {
        Row: {
          action_type: string
          created_at: string | null
          id: number
        }
        Insert: {
          action_type: string
          created_at?: string | null
          id?: number
        }
        Update: {
          action_type?: string
          created_at?: string | null
          id?: number
        }
        Relationships: []
      }
      user_counts: {
        Row: {
          emails_sent: number
          id: number
          last_updated: string
          viewers: number
        }
        Insert: {
          emails_sent?: number
          id?: number
          last_updated?: string
          viewers?: number
        }
        Update: {
          emails_sent?: number
          id?: number
          last_updated?: string
          viewers?: number
        }
        Relationships: []
      }
      verified_emails: {
        Row: {
          category: string | null
          created_at: string
          display_name: string
          email_address: string
          id: number
          is_verified: boolean
          trust_score: number
        }
        Insert: {
          category?: string | null
          created_at?: string
          display_name: string
          email_address: string
          id?: never
          is_verified?: boolean
          trust_score?: number
        }
        Update: {
          category?: string | null
          created_at?: string
          display_name?: string
          email_address?: string
          id?: never
          is_verified?: boolean
          trust_score?: number
        }
        Relationships: []
      }
    }
    Views: {
      aggregate_stats: {
        Row: {
          emails_sent: number | null
          emails_total: number | null
          viewers: number | null
          views_total: number | null
        }
        Relationships: []
      }
    }
    Functions: {
      generate_slug: {
        Args: { title_text: string }
        Returns: string
      }
      increment_action_count: {
        Args: { action: string }
        Returns: undefined
      }
      increment_template_usage: {
        Args: { template_id: string }
        Returns: undefined
      }
      increment_template_views: {
        Args: { template_id: string }
        Returns: undefined
      }
      increment_user_action: {
        Args: { action_type_param: string }
        Returns: undefined
      }
      update_user_actions: {
        Args: { viewed: boolean; tapped: boolean }
        Returns: undefined
      }
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
