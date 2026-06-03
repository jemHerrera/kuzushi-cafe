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
      account_privacy_settings: {
        Row: {
          account_id: string
          backtakes: Database["public"]["Enums"]["privacy_type"]
          created_date: string
          guard_passes: Database["public"]["Enums"]["privacy_type"]
          journal_entries: Database["public"]["Enums"]["privacy_type"]
          profile: Database["public"]["Enums"]["privacy_type"]
          reversals: Database["public"]["Enums"]["privacy_type"]
          submissions: Database["public"]["Enums"]["privacy_type"]
          sweeps: Database["public"]["Enums"]["privacy_type"]
          taps: Database["public"]["Enums"]["privacy_type"]
          updated_date: string
        }
        Insert: {
          account_id: string
          backtakes?: Database["public"]["Enums"]["privacy_type"]
          created_date?: string
          guard_passes?: Database["public"]["Enums"]["privacy_type"]
          journal_entries?: Database["public"]["Enums"]["privacy_type"]
          profile?: Database["public"]["Enums"]["privacy_type"]
          reversals?: Database["public"]["Enums"]["privacy_type"]
          submissions?: Database["public"]["Enums"]["privacy_type"]
          sweeps?: Database["public"]["Enums"]["privacy_type"]
          taps?: Database["public"]["Enums"]["privacy_type"]
          updated_date?: string
        }
        Update: {
          account_id?: string
          backtakes?: Database["public"]["Enums"]["privacy_type"]
          created_date?: string
          guard_passes?: Database["public"]["Enums"]["privacy_type"]
          journal_entries?: Database["public"]["Enums"]["privacy_type"]
          profile?: Database["public"]["Enums"]["privacy_type"]
          reversals?: Database["public"]["Enums"]["privacy_type"]
          submissions?: Database["public"]["Enums"]["privacy_type"]
          sweeps?: Database["public"]["Enums"]["privacy_type"]
          taps?: Database["public"]["Enums"]["privacy_type"]
          updated_date?: string
        }
        Relationships: [
          {
            foreignKeyName: "account_privacy_settings_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: true
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          },
        ]
      }
      accounts: {
        Row: {
          auth_provider: Database["public"]["Enums"]["auth_provider"]
          auth_user_id: string
          belt: Database["public"]["Enums"]["belt"]
          birthday: string | null
          created_date: string
          email: string
          first_name: string | null
          id: string
          last_name: string | null
          profile_photo: string | null
          updated_date: string
          weight: Database["public"]["Enums"]["weight_class"]
        }
        Insert: {
          auth_provider: Database["public"]["Enums"]["auth_provider"]
          auth_user_id: string
          belt?: Database["public"]["Enums"]["belt"]
          birthday?: string | null
          created_date?: string
          email: string
          first_name?: string | null
          id?: string
          last_name?: string | null
          profile_photo?: string | null
          updated_date?: string
          weight?: Database["public"]["Enums"]["weight_class"]
        }
        Update: {
          auth_provider?: Database["public"]["Enums"]["auth_provider"]
          auth_user_id?: string
          belt?: Database["public"]["Enums"]["belt"]
          birthday?: string | null
          created_date?: string
          email?: string
          first_name?: string | null
          id?: string
          last_name?: string | null
          profile_photo?: string | null
          updated_date?: string
          weight?: Database["public"]["Enums"]["weight_class"]
        }
        Relationships: []
      }
      journal_entries: {
        Row: {
          account_id: string
          category: Database["public"]["Enums"]["category"]
          created_date: string
          id: string
          intensity: Database["public"]["Enums"]["intensity"] | null
          is_attempt: boolean
          is_no_gi: boolean | null
          is_successful: boolean | null
          name: string
          notes: string | null
          setup: string
          trained_date: string
          training_partner_id: string | null
          updated_date: string
        }
        Insert: {
          account_id: string
          category: Database["public"]["Enums"]["category"]
          created_date?: string
          id?: string
          intensity?: Database["public"]["Enums"]["intensity"] | null
          is_attempt?: boolean
          is_no_gi?: boolean | null
          is_successful?: boolean | null
          name: string
          notes?: string | null
          setup: string
          trained_date?: string
          training_partner_id?: string | null
          updated_date?: string
        }
        Update: {
          account_id?: string
          category?: Database["public"]["Enums"]["category"]
          created_date?: string
          id?: string
          intensity?: Database["public"]["Enums"]["intensity"] | null
          is_attempt?: boolean
          is_no_gi?: boolean | null
          is_successful?: boolean | null
          name?: string
          notes?: string | null
          setup?: string
          trained_date?: string
          training_partner_id?: string | null
          updated_date?: string
        }
        Relationships: [
          {
            foreignKeyName: "journal_entries_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "journal_entries_training_partner_id_fkey"
            columns: ["training_partner_id"]
            isOneToOne: false
            referencedRelation: "training_partners"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          account_id: string
          category: Database["public"]["Enums"]["notification_category"]
          created_date: string
          heading: string
          id: string
          is_read: boolean
          text: string
          updated_date: string
        }
        Insert: {
          account_id: string
          category: Database["public"]["Enums"]["notification_category"]
          created_date?: string
          heading: string
          id?: string
          is_read?: boolean
          text: string
          updated_date?: string
        }
        Update: {
          account_id?: string
          category?: Database["public"]["Enums"]["notification_category"]
          created_date?: string
          heading?: string
          id?: string
          is_read?: boolean
          text?: string
          updated_date?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          },
        ]
      }
      technique_tags: {
        Row: {
          category: Database["public"]["Enums"]["category"]
          created_date: string
          generated_by_account_id: string | null
          is_public: boolean
          key: string
          label: string
          updated_date: string
        }
        Insert: {
          category: Database["public"]["Enums"]["category"]
          created_date?: string
          generated_by_account_id?: string | null
          is_public?: boolean
          key: string
          label: string
          updated_date?: string
        }
        Update: {
          category?: Database["public"]["Enums"]["category"]
          created_date?: string
          generated_by_account_id?: string | null
          is_public?: boolean
          key?: string
          label?: string
          updated_date?: string
        }
        Relationships: [
          {
            foreignKeyName: "technique_tags_generated_by_account_id_fkey"
            columns: ["generated_by_account_id"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          },
        ]
      }
      training_partner_requests: {
        Row: {
          created_date: string
          id: string
          recipient_account_id: string
          requester_account_id: string
          updated_date: string
        }
        Insert: {
          created_date?: string
          id?: string
          recipient_account_id: string
          requester_account_id: string
          updated_date?: string
        }
        Update: {
          created_date?: string
          id?: string
          recipient_account_id?: string
          requester_account_id?: string
          updated_date?: string
        }
        Relationships: [
          {
            foreignKeyName: "training_partner_requests_recipient_account_id_fkey"
            columns: ["recipient_account_id"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "training_partner_requests_requester_account_id_fkey"
            columns: ["requester_account_id"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          },
        ]
      }
      training_partners: {
        Row: {
          created_date: string
          first_name: string | null
          id: string
          last_name: string | null
          owner_account_id: string
          partner_account_id: string | null
          partner_age: Database["public"]["Enums"]["age_class"] | null
          partner_belt: Database["public"]["Enums"]["belt"] | null
          partner_weight: Database["public"]["Enums"]["weight_class"] | null
          updated_date: string
        }
        Insert: {
          created_date?: string
          first_name?: string | null
          id?: string
          last_name?: string | null
          owner_account_id: string
          partner_account_id?: string | null
          partner_age?: Database["public"]["Enums"]["age_class"] | null
          partner_belt?: Database["public"]["Enums"]["belt"] | null
          partner_weight?: Database["public"]["Enums"]["weight_class"] | null
          updated_date?: string
        }
        Update: {
          created_date?: string
          first_name?: string | null
          id?: string
          last_name?: string | null
          owner_account_id?: string
          partner_account_id?: string | null
          partner_age?: Database["public"]["Enums"]["age_class"] | null
          partner_belt?: Database["public"]["Enums"]["belt"] | null
          partner_weight?: Database["public"]["Enums"]["weight_class"] | null
          updated_date?: string
        }
        Relationships: [
          {
            foreignKeyName: "training_partners_owner_account_id_fkey"
            columns: ["owner_account_id"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "training_partners_partner_account_id_fkey"
            columns: ["partner_account_id"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      are_training_partners: {
        Args: { first_account_id: string; second_account_id: string }
        Returns: boolean
      }
      can_view_account_profile: {
        Args: { target_account_id: string }
        Returns: boolean
      }
      can_view_journal_entries: {
        Args: {
          entry_category: Database["public"]["Enums"]["category"]
          target_account_id: string
        }
        Returns: boolean
      }
      current_account_id: { Args: never; Returns: string }
    }
    Enums: {
      age_class:
        | "unknown"
        | "kid"
        | "teen"
        | "young-adult"
        | "30s"
        | "40s"
        | "50s"
        | "60s"
        | "70s"
        | "80s"
        | "90s"
      auth_provider: "google" | "magic-link"
      belt:
        | "unknown"
        | "white"
        | "blue"
        | "purple"
        | "brown"
        | "black"
        | "coral"
      category:
        | "submission"
        | "takedown"
        | "sweep"
        | "guard-pass"
        | "reversal"
        | "back-take"
        | "leg-entry"
        | "escape"
        | "tap"
        | "off-balance"
        | "position"
        | "guard-retention"
        | "other"
      intensity: "playful" | "casual" | "intense"
      notification_category: "journal-entry-partner" | "chat"
      privacy_type: "public" | "training-partners" | "private"
      weight_class: "unknown" | "feather" | "light" | "middle" | "heavy"
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
      age_class: [
        "unknown",
        "kid",
        "teen",
        "young-adult",
        "30s",
        "40s",
        "50s",
        "60s",
        "70s",
        "80s",
        "90s",
      ],
      auth_provider: ["google", "magic-link"],
      belt: ["unknown", "white", "blue", "purple", "brown", "black", "coral"],
      category: [
        "submission",
        "takedown",
        "sweep",
        "guard-pass",
        "reversal",
        "back-take",
        "leg-entry",
        "escape",
        "tap",
        "off-balance",
        "position",
        "guard-retention",
        "other",
      ],
      intensity: ["playful", "casual", "intense"],
      notification_category: ["journal-entry-partner", "chat"],
      privacy_type: ["public", "training-partners", "private"],
      weight_class: ["unknown", "feather", "light", "middle", "heavy"],
    },
  },
} as const
