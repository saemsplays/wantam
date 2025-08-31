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
    PostgrestVersion: "12.2.3 (519615d)"
  }
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
          created_by: string | null
          id: string
          is_verified: boolean | null
          message_body: string
          recipients: Json
          subject: string
          template_name: string
          updated_at: string | null
          use_count: number | null
          user_name: string | null
          verified_at: string | null
          verified_by: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          id?: string
          is_verified?: boolean | null
          message_body: string
          recipients: Json
          subject: string
          template_name: string
          updated_at?: string | null
          use_count?: number | null
          user_name?: string | null
          verified_at?: string | null
          verified_by?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          id?: string
          is_verified?: boolean | null
          message_body?: string
          recipients?: Json
          subject?: string
          template_name?: string
          updated_at?: string | null
          use_count?: number | null
          user_name?: string | null
          verified_at?: string | null
          verified_by?: string | null
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
          is_verified: boolean | null
          metadata: Json | null
          slug: string | null
          title: string
          updated_at: string
          uses_count: number | null
          verified_at: string | null
          verified_by: string | null
          views_count: number | null
        }
        Insert: {
          body: string
          created_at?: string
          created_by?: string | null
          id?: string
          is_public?: boolean | null
          is_verified?: boolean | null
          metadata?: Json | null
          slug?: string | null
          title: string
          updated_at?: string
          uses_count?: number | null
          verified_at?: string | null
          verified_by?: string | null
          views_count?: number | null
        }
        Update: {
          body?: string
          created_at?: string
          created_by?: string | null
          id?: string
          is_public?: boolean | null
          is_verified?: boolean | null
          metadata?: Json | null
          slug?: string | null
          title?: string
          updated_at?: string
          uses_count?: number | null
          verified_at?: string | null
          verified_by?: string | null
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
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
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
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
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
        Args: { tapped: boolean; viewed: boolean }
        Returns: undefined
      }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user"
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
      app_role: ["admin", "moderator", "user"],
    },
  },
} as const
