export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          extensions?: Json
          operationName?: string
          query?: string
          variables?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      account_blocks: {
        Row: {
          blocked_account_id: string
          blocker_account_id: string
          created_date: string
        }
        Insert: {
          blocked_account_id: string
          blocker_account_id: string
          created_date?: string
        }
        Update: {
          blocked_account_id?: string
          blocker_account_id?: string
          created_date?: string
        }
        Relationships: [
          {
            foreignKeyName: "account_blocks_blocked_account_id_fkey"
            columns: ["blocked_account_id"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "account_blocks_blocker_account_id_fkey"
            columns: ["blocker_account_id"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          },
        ]
      }
      account_privacy_settings: {
        Row: {
          account_id: string
          activity: Database["public"]["Enums"]["privacy_type"]
          created_date: string
          journal_entries: Database["public"]["Enums"]["privacy_type"]
          stats: Database["public"]["Enums"]["privacy_type"]
          updated_date: string
        }
        Insert: {
          account_id: string
          activity?: Database["public"]["Enums"]["privacy_type"]
          created_date?: string
          journal_entries?: Database["public"]["Enums"]["privacy_type"]
          stats?: Database["public"]["Enums"]["privacy_type"]
          updated_date?: string
        }
        Update: {
          account_id?: string
          activity?: Database["public"]["Enums"]["privacy_type"]
          created_date?: string
          journal_entries?: Database["public"]["Enums"]["privacy_type"]
          stats?: Database["public"]["Enums"]["privacy_type"]
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
          bio: string | null
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
          bio?: string | null
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
          bio?: string | null
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
      donation_checkout_sessions: {
        Row: {
          account_id: string
          amount: number
          checkout_url: string
          created_date: string
          currency: string
          id: string
          status: string
          updated_date: string
        }
        Insert: {
          account_id: string
          amount: number
          checkout_url: string
          created_date?: string
          currency?: string
          id: string
          status?: string
          updated_date?: string
        }
        Update: {
          account_id?: string
          amount?: number
          checkout_url?: string
          created_date?: string
          currency?: string
          id?: string
          status?: string
          updated_date?: string
        }
        Relationships: [
          {
            foreignKeyName: "donation_checkout_sessions_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          },
        ]
      }
      journal_entries: {
        Row: {
          account_id: string
          category: Database["public"]["Enums"]["category"]
          created_date: string
          id: string
          intensity: Database["public"]["Enums"]["intensity"] | null
          is_no_gi: boolean | null
          journal_type: Database["public"]["Enums"]["journal_type"] | null
          name: string
          notes: string | null
          setup: string | null
          trained_date: string | null
          training_partner_id: string | null
          updated_date: string
        }
        Insert: {
          account_id: string
          category: Database["public"]["Enums"]["category"]
          created_date?: string
          id?: string
          intensity?: Database["public"]["Enums"]["intensity"] | null
          is_no_gi?: boolean | null
          journal_type?: Database["public"]["Enums"]["journal_type"] | null
          name: string
          notes?: string | null
          setup?: string | null
          trained_date?: string | null
          training_partner_id?: string | null
          updated_date?: string
        }
        Update: {
          account_id?: string
          category?: Database["public"]["Enums"]["category"]
          created_date?: string
          id?: string
          intensity?: Database["public"]["Enums"]["intensity"] | null
          is_no_gi?: boolean | null
          journal_type?: Database["public"]["Enums"]["journal_type"] | null
          name?: string
          notes?: string | null
          setup?: string | null
          trained_date?: string | null
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
          source_account_id: string | null
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
          source_account_id?: string | null
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
          source_account_id?: string | null
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
          {
            foreignKeyName: "notifications_source_account_id_fkey"
            columns: ["source_account_id"]
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
          former_partner_account_id: string | null
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
          former_partner_account_id?: string | null
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
          former_partner_account_id?: string | null
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
            foreignKeyName: "training_partners_former_partner_account_id_fkey"
            columns: ["former_partner_account_id"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          },
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
      accept_training_partner_request: {
        Args: { accepting_account_id: string; requester_id: string }
        Returns: undefined
      }
      account_age_class: {
        Args: { birthday: string }
        Returns: Database["public"]["Enums"]["age_class"]
      }
      are_training_partners: {
        Args: { first_account_id: string; second_account_id: string }
        Returns: boolean
      }
      block_account: {
        Args: { account_id: string; blocked_account_id: string }
        Returns: undefined
      }
      can_view_account_section: {
        Args: {
          target_account_id: string
          viewer_account_id: string
          visibility: Database["public"]["Enums"]["privacy_type"]
        }
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
      detach_training_partner: {
        Args: { account_id: string; training_partner_id: string }
        Returns: undefined
      }
      get_public_profile: {
        Args: { target_account_id: string; viewer_account_id?: string }
        Returns: {
          belt: Database["public"]["Enums"]["belt"]
          bio: string
          can_view_activity: boolean
          can_view_journal_entries: boolean
          can_view_stats: boolean
          first_name: string
          id: string
          last_name: string
          profile_photo: string
          relationship_status: string
        }[]
      }
      get_public_stats: {
        Args: {
          stats_category: Database["public"]["Enums"]["category"]
          stats_end_exclusive: string
          stats_start: string
          successes_only?: boolean
          target_account_id: string
          viewer_account_id: string
        }
        Returns: {
          attempts: number
          label: string
          occurrences: number
          successes: number
        }[]
      }
      get_public_training_activity: {
        Args: {
          activity_end: string
          activity_start: string
          target_account_id: string
          viewer_account_id: string
        }
        Returns: {
          activity_date: string
          entry_count: number
        }[]
      }
      get_training_partner_profile_photos: {
        Args: { account_id: string; training_partner_ids: string[] }
        Returns: {
          id: string
          profile_photo: string
        }[]
      }
      get_training_partner_profiles: {
        Args: { account_id: string; training_partner_ids: string[] }
        Returns: {
          belt: Database["public"]["Enums"]["belt"]
          first_name: string
          id: string
          last_name: string
          profile_photo: string
          weight: Database["public"]["Enums"]["weight_class"]
        }[]
      }
      get_visible_journal_entry_partner_belts: {
        Args: { journal_entry_ids: string[]; target_account_id: string }
        Returns: {
          belt: Database["public"]["Enums"]["belt"]
          journal_entry_id: string
          training_partner_id: string
        }[]
      }
      list_training_partner_requests: {
        Args: {
          account_id: string
          request_direction: string
          result_limit: number
          result_offset: number
        }
        Returns: {
          belt: Database["public"]["Enums"]["belt"]
          bio: string
          birthday: string
          created_date: string
          email: string
          first_name: string
          id: string
          last_name: string
          profile_photo: string
          updated_date: string
          weight: Database["public"]["Enums"]["weight_class"]
        }[]
      }
      list_training_partners: {
        Args: {
          account_id: string
          result_limit: number
          result_offset: number
          search_text: string
        }
        Returns: {
          created_date: string
          first_name: string
          id: string
          is_account_backed: boolean
          last_name: string
          partner_account_id: string
          partner_age: Database["public"]["Enums"]["age_class"]
          partner_belt: Database["public"]["Enums"]["belt"]
          partner_weight: Database["public"]["Enums"]["weight_class"]
          profile_photo: string
          updated_date: string
        }[]
      }
      search_public_profiles: {
        Args: {
          result_limit: number
          result_offset: number
          search_text: string
          viewer_account_id?: string
        }
        Returns: {
          belt: Database["public"]["Enums"]["belt"]
          bio: string
          first_name: string
          id: string
          last_name: string
          profile_photo: string
          relationship_status: string
        }[]
      }
      send_journal_entry_assignment_notification: {
        Args: { assigning_account_id: string; journal_entry_id: string }
        Returns: {
          account_id: string
          category: Database["public"]["Enums"]["notification_category"]
          created_date: string
          heading: string
          id: string
          is_read: boolean
          source_account_id: string | null
          text: string
          updated_date: string
        }
        SetofOptions: {
          from: "*"
          to: "notifications"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      send_training_partner_request: {
        Args: { recipient_account_id: string; requester_account_id: string }
        Returns: {
          account_id: string
          category: Database["public"]["Enums"]["notification_category"]
          created_date: string
          heading: string
          id: string
          is_read: boolean
          source_account_id: string | null
          text: string
          updated_date: string
        }
        SetofOptions: {
          from: "*"
          to: "notifications"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      training_partner_relationship_status: {
        Args: { other_account_id: string; viewer_account_id: string }
        Returns: string
      }
      unblock_account: {
        Args: { account_id: string; blocked_account_id: string }
        Returns: undefined
      }
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
      journal_type: "attempt" | "success"
      notification_category:
        | "journal-entry-partner"
        | "chat"
        | "training-partner-request"
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
  graphql_public: {
    Enums: {},
  },
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
      journal_type: ["attempt", "success"],
      notification_category: [
        "journal-entry-partner",
        "chat",
        "training-partner-request",
      ],
      privacy_type: ["public", "training-partners", "private"],
      weight_class: ["unknown", "feather", "light", "middle", "heavy"],
    },
  },
} as const
