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
    PostgrestVersion: "14.18"
  }
  public: {
    Tables: {
      admins: {
        Row: {
          created_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          user_id?: string
        }
        Relationships: []
      }
      contact_messages: {
        Row: {
          created_at: string
          email: string
          email_sent: boolean
          id: string
          ip_hash: string
          locale: Database["public"]["Enums"]["locale"]
          message: string
          name: string
          status: Database["public"]["Enums"]["message_status"]
          subject: string
        }
        Insert: {
          created_at?: string
          email: string
          email_sent?: boolean
          id?: string
          ip_hash: string
          locale?: Database["public"]["Enums"]["locale"]
          message: string
          name: string
          status?: Database["public"]["Enums"]["message_status"]
          subject?: string
        }
        Update: {
          created_at?: string
          email?: string
          email_sent?: boolean
          id?: string
          ip_hash?: string
          locale?: Database["public"]["Enums"]["locale"]
          message?: string
          name?: string
          status?: Database["public"]["Enums"]["message_status"]
          subject?: string
        }
        Relationships: []
      }
      engagement_roles: {
        Row: {
          engagement_id: string
          id: string
          label_en: string
          label_fr: string
          period: string
          sort_order: number
        }
        Insert: {
          engagement_id: string
          id?: string
          label_en?: string
          label_fr?: string
          period?: string
          sort_order?: number
        }
        Update: {
          engagement_id?: string
          id?: string
          label_en?: string
          label_fr?: string
          period?: string
          sort_order?: number
        }
        Relationships: [
          {
            foreignKeyName: "engagement_roles_engagement_id_fkey"
            columns: ["engagement_id"]
            isOneToOne: false
            referencedRelation: "engagements"
            referencedColumns: ["id"]
          },
        ]
      }
      engagements: {
        Row: {
          created_at: string
          id: string
          organization: string
          since: number | null
          sort_order: number
          text_en: string
          text_fr: string
          updated_at: string
          url: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          organization?: string
          since?: number | null
          sort_order?: number
          text_en?: string
          text_fr?: string
          updated_at?: string
          url?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          organization?: string
          since?: number | null
          sort_order?: number
          text_en?: string
          text_fr?: string
          updated_at?: string
          url?: string | null
        }
        Relationships: []
      }
      experience_technologies: {
        Row: {
          experience_id: string
          sort_order: number
          technology_id: string
        }
        Insert: {
          experience_id: string
          sort_order?: number
          technology_id: string
        }
        Update: {
          experience_id?: string
          sort_order?: number
          technology_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "experience_technologies_experience_id_fkey"
            columns: ["experience_id"]
            isOneToOne: false
            referencedRelation: "experiences"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "experience_technologies_technology_id_fkey"
            columns: ["technology_id"]
            isOneToOne: false
            referencedRelation: "technologies"
            referencedColumns: ["id"]
          },
        ]
      }
      experiences: {
        Row: {
          company: string
          created_at: string
          end_date: string | null
          id: string
          is_remote: boolean
          location: string
          message_en: string
          message_fr: string
          role_en: string
          role_fr: string
          sort_order: number
          start_date: string
          updated_at: string
        }
        Insert: {
          company?: string
          created_at?: string
          end_date?: string | null
          id?: string
          is_remote?: boolean
          location?: string
          message_en?: string
          message_fr?: string
          role_en?: string
          role_fr?: string
          sort_order?: number
          start_date: string
          updated_at?: string
        }
        Update: {
          company?: string
          created_at?: string
          end_date?: string | null
          id?: string
          is_remote?: boolean
          location?: string
          message_en?: string
          message_fr?: string
          role_en?: string
          role_fr?: string
          sort_order?: number
          start_date?: string
          updated_at?: string
        }
        Relationships: []
      }
      faq_items: {
        Row: {
          answer_en: string
          answer_fr: string
          created_at: string
          id: string
          is_published: boolean
          question_en: string
          question_fr: string
          sort_order: number
          updated_at: string
        }
        Insert: {
          answer_en?: string
          answer_fr?: string
          created_at?: string
          id?: string
          is_published?: boolean
          question_en?: string
          question_fr?: string
          sort_order?: number
          updated_at?: string
        }
        Update: {
          answer_en?: string
          answer_fr?: string
          created_at?: string
          id?: string
          is_published?: boolean
          question_en?: string
          question_fr?: string
          sort_order?: number
          updated_at?: string
        }
        Relationships: []
      }
      profile: {
        Row: {
          athena_en: string
          athena_fr: string
          availability_en: string
          availability_fr: string
          availability_modes: string[]
          available_from: string | null
          bio_en: string
          bio_fr: string
          full_name: string
          hephaistos_en: string
          hephaistos_fr: string
          id: boolean
          is_available: boolean
          languages_en: string
          languages_fr: string
          location: string
          og_image_path: string | null
          photo_alt_en: string
          photo_alt_fr: string
          photo_path: string | null
          public_email: string
          recit_en: string
          recit_fr: string
          seo_description_en: string
          seo_description_fr: string
          seo_title_en: string
          seo_title_fr: string
          tagline_en: string
          tagline_fr: string
          title_en: string
          title_fr: string
          updated_at: string
        }
        Insert: {
          athena_en?: string
          athena_fr?: string
          availability_en?: string
          availability_fr?: string
          availability_modes?: string[]
          available_from?: string | null
          bio_en?: string
          bio_fr?: string
          full_name?: string
          hephaistos_en?: string
          hephaistos_fr?: string
          id?: boolean
          is_available?: boolean
          languages_en?: string
          languages_fr?: string
          location?: string
          og_image_path?: string | null
          photo_alt_en?: string
          photo_alt_fr?: string
          photo_path?: string | null
          public_email?: string
          recit_en?: string
          recit_fr?: string
          seo_description_en?: string
          seo_description_fr?: string
          seo_title_en?: string
          seo_title_fr?: string
          tagline_en?: string
          tagline_fr?: string
          title_en?: string
          title_fr?: string
          updated_at?: string
        }
        Update: {
          athena_en?: string
          athena_fr?: string
          availability_en?: string
          availability_fr?: string
          availability_modes?: string[]
          available_from?: string | null
          bio_en?: string
          bio_fr?: string
          full_name?: string
          hephaistos_en?: string
          hephaistos_fr?: string
          id?: boolean
          is_available?: boolean
          languages_en?: string
          languages_fr?: string
          location?: string
          og_image_path?: string | null
          photo_alt_en?: string
          photo_alt_fr?: string
          photo_path?: string | null
          public_email?: string
          recit_en?: string
          recit_fr?: string
          seo_description_en?: string
          seo_description_fr?: string
          seo_title_en?: string
          seo_title_fr?: string
          tagline_en?: string
          tagline_fr?: string
          title_en?: string
          title_fr?: string
          updated_at?: string
        }
        Relationships: []
      }
      project_decisions: {
        Row: {
          created_at: string
          id: string
          project_id: string
          sort_order: number
          title_en: string
          title_fr: string
          tradeoff_en: string
          tradeoff_fr: string
          why_en: string
          why_fr: string
        }
        Insert: {
          created_at?: string
          id?: string
          project_id: string
          sort_order?: number
          title_en?: string
          title_fr?: string
          tradeoff_en?: string
          tradeoff_fr?: string
          why_en?: string
          why_fr?: string
        }
        Update: {
          created_at?: string
          id?: string
          project_id?: string
          sort_order?: number
          title_en?: string
          title_fr?: string
          tradeoff_en?: string
          tradeoff_fr?: string
          why_en?: string
          why_fr?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_decisions_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      project_images: {
        Row: {
          alt_en: string
          alt_fr: string
          caption_en: string
          caption_fr: string
          created_at: string
          id: string
          kind_en: string
          kind_fr: string
          path: string | null
          project_id: string
          ratio: string
          sort_order: number
        }
        Insert: {
          alt_en?: string
          alt_fr?: string
          caption_en?: string
          caption_fr?: string
          created_at?: string
          id?: string
          kind_en?: string
          kind_fr?: string
          path?: string | null
          project_id: string
          ratio?: string
          sort_order?: number
        }
        Update: {
          alt_en?: string
          alt_fr?: string
          caption_en?: string
          caption_fr?: string
          created_at?: string
          id?: string
          kind_en?: string
          kind_fr?: string
          path?: string | null
          project_id?: string
          ratio?: string
          sort_order?: number
        }
        Relationships: [
          {
            foreignKeyName: "project_images_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      project_items: {
        Row: {
          created_at: string
          id: string
          kind: string
          project_id: string
          sort_order: number
          text_en: string
          text_fr: string
        }
        Insert: {
          created_at?: string
          id?: string
          kind: string
          project_id: string
          sort_order?: number
          text_en?: string
          text_fr?: string
        }
        Update: {
          created_at?: string
          id?: string
          kind?: string
          project_id?: string
          sort_order?: number
          text_en?: string
          text_fr?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_items_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      project_technologies: {
        Row: {
          project_id: string
          sort_order: number
          technology_id: string
          usage_en: string
          usage_fr: string
        }
        Insert: {
          project_id: string
          sort_order?: number
          technology_id: string
          usage_en?: string
          usage_fr?: string
        }
        Update: {
          project_id?: string
          sort_order?: number
          technology_id?: string
          usage_en?: string
          usage_fr?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_technologies_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_technologies_technology_id_fkey"
            columns: ["technology_id"]
            isOneToOne: false
            referencedRelation: "technologies"
            referencedColumns: ["id"]
          },
        ]
      }
      projects: {
        Row: {
          charon_line_en: string
          charon_line_fr: string
          client_name: string
          context_en: string
          context_fr: string
          cover_alt_en: string
          cover_alt_fr: string
          cover_path: string | null
          created_at: string
          demo_url: string | null
          emblem: Database["public"]["Enums"]["project_emblem"] | null
          id: string
          is_associative: boolean
          is_confidential: boolean
          is_featured: boolean
          kind: string
          kind_label_en: string
          kind_label_fr: string
          layout: string
          og_image_path: string | null
          period_en: string
          period_fr: string
          problem_en: string
          problem_fr: string
          published_at: string | null
          quest_en: string
          quest_fr: string
          repo_url: string | null
          role_en: string
          role_fr: string
          role_label_en: string
          role_label_fr: string
          seo_description_en: string
          seo_description_fr: string
          seo_title_en: string
          seo_title_fr: string
          short_title_en: string
          short_title_fr: string
          show_client: boolean
          slug: string
          sort_order: number
          status: Database["public"]["Enums"]["project_status"]
          summary_en: string
          summary_fr: string
          team_en: string
          team_fr: string
          title_en: string
          title_fr: string
          updated_at: string
        }
        Insert: {
          charon_line_en?: string
          charon_line_fr?: string
          client_name?: string
          context_en?: string
          context_fr?: string
          cover_alt_en?: string
          cover_alt_fr?: string
          cover_path?: string | null
          created_at?: string
          demo_url?: string | null
          emblem?: Database["public"]["Enums"]["project_emblem"] | null
          id?: string
          is_associative?: boolean
          is_confidential?: boolean
          is_featured?: boolean
          kind?: string
          kind_label_en?: string
          kind_label_fr?: string
          layout?: string
          og_image_path?: string | null
          period_en?: string
          period_fr?: string
          problem_en?: string
          problem_fr?: string
          published_at?: string | null
          quest_en?: string
          quest_fr?: string
          repo_url?: string | null
          role_en?: string
          role_fr?: string
          role_label_en?: string
          role_label_fr?: string
          seo_description_en?: string
          seo_description_fr?: string
          seo_title_en?: string
          seo_title_fr?: string
          short_title_en?: string
          short_title_fr?: string
          show_client?: boolean
          slug: string
          sort_order?: number
          status?: Database["public"]["Enums"]["project_status"]
          summary_en?: string
          summary_fr?: string
          team_en?: string
          team_fr?: string
          title_en?: string
          title_fr?: string
          updated_at?: string
        }
        Update: {
          charon_line_en?: string
          charon_line_fr?: string
          client_name?: string
          context_en?: string
          context_fr?: string
          cover_alt_en?: string
          cover_alt_fr?: string
          cover_path?: string | null
          created_at?: string
          demo_url?: string | null
          emblem?: Database["public"]["Enums"]["project_emblem"] | null
          id?: string
          is_associative?: boolean
          is_confidential?: boolean
          is_featured?: boolean
          kind?: string
          kind_label_en?: string
          kind_label_fr?: string
          layout?: string
          og_image_path?: string | null
          period_en?: string
          period_fr?: string
          problem_en?: string
          problem_fr?: string
          published_at?: string | null
          quest_en?: string
          quest_fr?: string
          repo_url?: string | null
          role_en?: string
          role_fr?: string
          role_label_en?: string
          role_label_fr?: string
          seo_description_en?: string
          seo_description_fr?: string
          seo_title_en?: string
          seo_title_fr?: string
          short_title_en?: string
          short_title_fr?: string
          show_client?: boolean
          slug?: string
          sort_order?: number
          status?: Database["public"]["Enums"]["project_status"]
          summary_en?: string
          summary_fr?: string
          team_en?: string
          team_fr?: string
          title_en?: string
          title_fr?: string
          updated_at?: string
        }
        Relationships: []
      }
      resumes: {
        Row: {
          file_path: string
          locale: Database["public"]["Enums"]["locale"]
          updated_at: string
        }
        Insert: {
          file_path: string
          locale: Database["public"]["Enums"]["locale"]
          updated_at?: string
        }
        Update: {
          file_path?: string
          locale?: Database["public"]["Enums"]["locale"]
          updated_at?: string
        }
        Relationships: []
      }
      skills: {
        Row: {
          created_at: string
          description_en: string
          description_fr: string
          domain: string
          id: string
          label_en: string
          label_fr: string
          sort_order: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          description_en?: string
          description_fr?: string
          domain?: string
          id?: string
          label_en?: string
          label_fr?: string
          sort_order?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          description_en?: string
          description_fr?: string
          domain?: string
          id?: string
          label_en?: string
          label_fr?: string
          sort_order?: number
          updated_at?: string
        }
        Relationships: []
      }
      slug_redirects: {
        Row: {
          created_at: string
          old_slug: string
          project_id: string
        }
        Insert: {
          created_at?: string
          old_slug: string
          project_id: string
        }
        Update: {
          created_at?: string
          old_slug?: string
          project_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "slug_redirects_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      social_links: {
        Row: {
          created_at: string
          id: string
          platform: string
          sort_order: number
          updated_at: string
          url: string
        }
        Insert: {
          created_at?: string
          id?: string
          platform: string
          sort_order?: number
          updated_at?: string
          url: string
        }
        Update: {
          created_at?: string
          id?: string
          platform?: string
          sort_order?: number
          updated_at?: string
          url?: string
        }
        Relationships: []
      }
      technologies: {
        Row: {
          category: string
          context_en: string
          context_fr: string
          created_at: string
          duration_label_en: string
          duration_label_fr: string
          id: string
          is_featured: boolean
          name: string
          role_en: string
          role_fr: string
          sort_order: number
          updated_at: string
          weapon: Database["public"]["Enums"]["weapon"] | null
          years_of_use: number | null
        }
        Insert: {
          category?: string
          context_en?: string
          context_fr?: string
          created_at?: string
          duration_label_en?: string
          duration_label_fr?: string
          id?: string
          is_featured?: boolean
          name: string
          role_en?: string
          role_fr?: string
          sort_order?: number
          updated_at?: string
          weapon?: Database["public"]["Enums"]["weapon"] | null
          years_of_use?: number | null
        }
        Update: {
          category?: string
          context_en?: string
          context_fr?: string
          created_at?: string
          duration_label_en?: string
          duration_label_fr?: string
          id?: string
          is_featured?: boolean
          name?: string
          role_en?: string
          role_fr?: string
          sort_order?: number
          updated_at?: string
          weapon?: Database["public"]["Enums"]["weapon"] | null
          years_of_use?: number | null
        }
        Relationships: []
      }
      testimonials: {
        Row: {
          author: string
          company: string
          created_at: string
          id: string
          is_anonymized: boolean
          is_published: boolean
          quote_en: string
          quote_fr: string
          role_en: string
          role_fr: string
          sort_order: number
          updated_at: string
        }
        Insert: {
          author?: string
          company?: string
          created_at?: string
          id?: string
          is_anonymized?: boolean
          is_published?: boolean
          quote_en?: string
          quote_fr?: string
          role_en?: string
          role_fr?: string
          sort_order?: number
          updated_at?: string
        }
        Update: {
          author?: string
          company?: string
          created_at?: string
          id?: string
          is_anonymized?: boolean
          is_published?: boolean
          quote_en?: string
          quote_fr?: string
          role_en?: string
          role_fr?: string
          sort_order?: number
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      locale: "fr" | "en"
      message_status: "unread" | "read"
      project_emblem: "maze" | "hydra" | "herald" | "boat"
      project_status: "draft" | "published"
      weapon:
        | "foudre"
        | "egide"
        | "trident"
        | "fil"
        | "caducee"
        | "casque"
        | "harpe"
        | "arc"
        | "marteau"
        | "lyre"
        | "bouclier"
        | "ancre"
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
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
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
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
      locale: ["fr", "en"],
      message_status: ["unread", "read"],
      project_emblem: ["maze", "hydra", "herald", "boat"],
      project_status: ["draft", "published"],
      weapon: [
        "foudre",
        "egide",
        "trident",
        "fil",
        "caducee",
        "casque",
        "harpe",
        "arc",
        "marteau",
        "lyre",
        "bouclier",
        "ancre",
      ],
    },
  },
} as const
