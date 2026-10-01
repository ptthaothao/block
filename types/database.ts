// Generated from the Supabase schema (public). Regenerate after migrations:
//   npx supabase gen types typescript --local --schema public > types/database.ts   (or --project-id <ref>)

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  public: {
    Tables: {
      categories: {
        Row: {
          color: string | null;
          created_at: string;
          description: string | null;
          icon: string | null;
          id: number;
          name: string;
          parent_id: number | null;
          position: number;
          slug: string;
        };
        Insert: {
          color?: string | null;
          created_at?: string;
          description?: string | null;
          icon?: string | null;
          id?: never;
          name: string;
          parent_id?: number | null;
          position?: number;
          slug: string;
        };
        Update: {
          color?: string | null;
          created_at?: string;
          description?: string | null;
          icon?: string | null;
          id?: never;
          name?: string;
          parent_id?: number | null;
          position?: number;
          slug?: string;
        };
        Relationships: [
          {
            foreignKeyName: "categories_parent_id_fkey";
            columns: ["parent_id"];
            isOneToOne: false;
            referencedRelation: "categories";
            referencedColumns: ["id"];
          },
        ];
      };
      comments: {
        Row: {
          author_id: string;
          body_md: string;
          created_at: string;
          deleted_at: string | null;
          edited_at: string | null;
          id: string;
          is_pinned: boolean;
          parent_id: string | null;
          post_id: string;
          reaction_counts: NonNullable<Json>;
          reply_count: number;
          root_id: string | null;
          status: Database["public"]["Enums"]["comment_status"];
        };
        Insert: {
          author_id?: string;
          body_md: string;
          created_at?: string;
          deleted_at?: string | null;
          edited_at?: string | null;
          id?: string;
          is_pinned?: boolean;
          parent_id?: string | null;
          post_id: string;
          reaction_counts?: NonNullable<Json>;
          reply_count?: number;
          root_id?: string | null;
          status?: Database["public"]["Enums"]["comment_status"];
        };
        Update: {
          author_id?: string;
          body_md?: string;
          created_at?: string;
          deleted_at?: string | null;
          edited_at?: string | null;
          id?: string;
          is_pinned?: boolean;
          parent_id?: string | null;
          post_id?: string;
          reaction_counts?: NonNullable<Json>;
          reply_count?: number;
          root_id?: string | null;
          status?: Database["public"]["Enums"]["comment_status"];
        };
        Relationships: [
          {
            foreignKeyName: "comments_author_id_fkey";
            columns: ["author_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "comments_parent_id_fkey";
            columns: ["parent_id"];
            isOneToOne: false;
            referencedRelation: "comments";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "comments_parent_id_fkey";
            columns: ["parent_id"];
            isOneToOne: false;
            referencedRelation: "moderation_queue";
            referencedColumns: ["comment_id"];
          },
          {
            foreignKeyName: "comments_post_id_fkey";
            columns: ["post_id"];
            isOneToOne: false;
            referencedRelation: "posts";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "comments_root_id_fkey";
            columns: ["root_id"];
            isOneToOne: false;
            referencedRelation: "comments";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "comments_root_id_fkey";
            columns: ["root_id"];
            isOneToOne: false;
            referencedRelation: "moderation_queue";
            referencedColumns: ["comment_id"];
          },
        ];
      };
      post_authors: {
        Row: {
          position: number;
          post_id: string;
          profile_id: string;
        };
        Insert: {
          position?: number;
          post_id: string;
          profile_id: string;
        };
        Update: {
          position?: number;
          post_id?: string;
          profile_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "post_authors_post_id_fkey";
            columns: ["post_id"];
            isOneToOne: false;
            referencedRelation: "posts";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "post_authors_profile_id_fkey";
            columns: ["profile_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      post_stats: {
        Row: {
          comment_count: number;
          post_id: string;
          reaction_counts: NonNullable<Json>;
        };
        Insert: {
          comment_count?: number;
          post_id: string;
          reaction_counts?: NonNullable<Json>;
        };
        Update: {
          comment_count?: number;
          post_id?: string;
          reaction_counts?: NonNullable<Json>;
        };
        Relationships: [
          {
            foreignKeyName: "post_stats_post_id_fkey";
            columns: ["post_id"];
            isOneToOne: true;
            referencedRelation: "posts";
            referencedColumns: ["id"];
          },
        ];
      };
      post_tags: {
        Row: {
          post_id: string;
          tag_id: number;
        };
        Insert: {
          post_id: string;
          tag_id: number;
        };
        Update: {
          post_id?: string;
          tag_id?: number;
        };
        Relationships: [
          {
            foreignKeyName: "post_tags_post_id_fkey";
            columns: ["post_id"];
            isOneToOne: false;
            referencedRelation: "posts";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "post_tags_tag_id_fkey";
            columns: ["tag_id"];
            isOneToOne: false;
            referencedRelation: "tags";
            referencedColumns: ["id"];
          },
        ];
      };
      posts: {
        Row: {
          category_id: number;
          content_html: string | null;
          content_md: string;
          cover_url: string | null;
          created_at: string;
          created_by: string;
          excerpt: string | null;
          id: string;
          level: Database["public"]["Enums"]["post_level"];
          published_at: string | null;
          reading_minutes: number;
          review_note: string | null;
          search: unknown;
          seo_description: string | null;
          seo_title: string | null;
          series_id: number | null;
          series_position: number | null;
          slug: string;
          status: Database["public"]["Enums"]["post_status"];
          title: string;
          toc: NonNullable<Json>;
          updated_at: string;
        };
        Insert: {
          category_id: number;
          content_html?: string | null;
          content_md?: string;
          cover_url?: string | null;
          created_at?: string;
          created_by?: string;
          excerpt?: string | null;
          id?: string;
          level?: Database["public"]["Enums"]["post_level"];
          published_at?: string | null;
          reading_minutes?: number;
          review_note?: string | null;
          search?: unknown;
          seo_description?: string | null;
          seo_title?: string | null;
          series_id?: number | null;
          series_position?: number | null;
          slug: string;
          status?: Database["public"]["Enums"]["post_status"];
          title: string;
          toc?: NonNullable<Json>;
          updated_at?: string;
        };
        Update: {
          category_id?: number;
          content_html?: string | null;
          content_md?: string;
          cover_url?: string | null;
          created_at?: string;
          created_by?: string;
          excerpt?: string | null;
          id?: string;
          level?: Database["public"]["Enums"]["post_level"];
          published_at?: string | null;
          reading_minutes?: number;
          review_note?: string | null;
          search?: unknown;
          seo_description?: string | null;
          seo_title?: string | null;
          series_id?: number | null;
          series_position?: number | null;
          slug?: string;
          status?: Database["public"]["Enums"]["post_status"];
          title?: string;
          toc?: NonNullable<Json>;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "posts_category_id_fkey";
            columns: ["category_id"];
            isOneToOne: false;
            referencedRelation: "categories";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "posts_created_by_fkey";
            columns: ["created_by"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "posts_series_id_fkey";
            columns: ["series_id"];
            isOneToOne: false;
            referencedRelation: "series";
            referencedColumns: ["id"];
          },
        ];
      };
      profiles: {
        Row: {
          avatar_url: string | null;
          bio: string | null;
          created_at: string;
          display_name: string;
          github_username: string | null;
          id: string;
          role: Database["public"]["Enums"]["user_role"];
          specialty: string | null;
          updated_at: string;
          username: string;
          website_url: string | null;
          x_username: string | null;
        };
        Insert: {
          avatar_url?: string | null;
          bio?: string | null;
          created_at?: string;
          display_name: string;
          github_username?: string | null;
          id: string;
          role?: Database["public"]["Enums"]["user_role"];
          specialty?: string | null;
          updated_at?: string;
          username: string;
          website_url?: string | null;
          x_username?: string | null;
        };
        Update: {
          avatar_url?: string | null;
          bio?: string | null;
          created_at?: string;
          display_name?: string;
          github_username?: string | null;
          id?: string;
          role?: Database["public"]["Enums"]["user_role"];
          specialty?: string | null;
          updated_at?: string;
          username?: string;
          website_url?: string | null;
          x_username?: string | null;
        };
        Relationships: [];
      };
      reactions: {
        Row: {
          created_at: string;
          emoji: Database["public"]["Enums"]["reaction_kind"];
          target_id: string;
          target_type: Database["public"]["Enums"]["reaction_target"];
          user_id: string;
        };
        Insert: {
          created_at?: string;
          emoji: Database["public"]["Enums"]["reaction_kind"];
          target_id: string;
          target_type: Database["public"]["Enums"]["reaction_target"];
          user_id?: string;
        };
        Update: {
          created_at?: string;
          emoji?: Database["public"]["Enums"]["reaction_kind"];
          target_id?: string;
          target_type?: Database["public"]["Enums"]["reaction_target"];
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "reactions_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      reports: {
        Row: {
          comment_id: string;
          created_at: string;
          id: number;
          note: string | null;
          reason: Database["public"]["Enums"]["report_reason"];
          reporter_id: string;
          resolved_at: string | null;
          resolved_by: string | null;
        };
        Insert: {
          comment_id: string;
          created_at?: string;
          id?: never;
          note?: string | null;
          reason: Database["public"]["Enums"]["report_reason"];
          reporter_id?: string;
          resolved_at?: string | null;
          resolved_by?: string | null;
        };
        Update: {
          comment_id?: string;
          created_at?: string;
          id?: never;
          note?: string | null;
          reason?: Database["public"]["Enums"]["report_reason"];
          reporter_id?: string;
          resolved_at?: string | null;
          resolved_by?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "reports_comment_id_fkey";
            columns: ["comment_id"];
            isOneToOne: false;
            referencedRelation: "comments";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "reports_comment_id_fkey";
            columns: ["comment_id"];
            isOneToOne: false;
            referencedRelation: "moderation_queue";
            referencedColumns: ["comment_id"];
          },
          {
            foreignKeyName: "reports_reporter_id_fkey";
            columns: ["reporter_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "reports_resolved_by_fkey";
            columns: ["resolved_by"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      series: {
        Row: {
          cover_url: string | null;
          created_at: string;
          description: string | null;
          id: number;
          slug: string;
          title: string;
          updated_at: string;
        };
        Insert: {
          cover_url?: string | null;
          created_at?: string;
          description?: string | null;
          id?: never;
          slug: string;
          title: string;
          updated_at?: string;
        };
        Update: {
          cover_url?: string | null;
          created_at?: string;
          description?: string | null;
          id?: never;
          slug?: string;
          title?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      tags: {
        Row: {
          created_at: string;
          created_by: string | null;
          id: number;
          name: string;
          slug: string;
          status: Database["public"]["Enums"]["tag_status"];
        };
        Insert: {
          created_at?: string;
          created_by?: string | null;
          id?: never;
          name: string;
          slug: string;
          status?: Database["public"]["Enums"]["tag_status"];
        };
        Update: {
          created_at?: string;
          created_by?: string | null;
          id?: never;
          name?: string;
          slug?: string;
          status?: Database["public"]["Enums"]["tag_status"];
        };
        Relationships: [
          {
            foreignKeyName: "tags_created_by_fkey";
            columns: ["created_by"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      user_interests: {
        Row: {
          author_id: string | null;
          category_id: number | null;
          created_at: string;
          id: number;
          tag_id: number | null;
          user_id: string;
          weight: number;
        };
        Insert: {
          author_id?: string | null;
          category_id?: number | null;
          created_at?: string;
          id?: never;
          tag_id?: number | null;
          user_id?: string;
          weight: number;
        };
        Update: {
          author_id?: string | null;
          category_id?: number | null;
          created_at?: string;
          id?: never;
          tag_id?: number | null;
          user_id?: string;
          weight?: number;
        };
        Relationships: [
          {
            foreignKeyName: "user_interests_author_id_fkey";
            columns: ["author_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "user_interests_category_id_fkey";
            columns: ["category_id"];
            isOneToOne: false;
            referencedRelation: "categories";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "user_interests_tag_id_fkey";
            columns: ["tag_id"];
            isOneToOne: false;
            referencedRelation: "tags";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "user_interests_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: {
      moderation_queue: {
        Row: {
          author_id: string | null;
          body_md: string | null;
          comment_id: string | null;
          created_at: string | null;
          open_reports: number | null;
          post_id: string | null;
          reasons: Database["public"]["Enums"]["report_reason"][] | null;
          status: Database["public"]["Enums"]["comment_status"] | null;
        };
        Relationships: [
          {
            foreignKeyName: "comments_author_id_fkey";
            columns: ["author_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "comments_post_id_fkey";
            columns: ["post_id"];
            isOneToOne: false;
            referencedRelation: "posts";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Functions: {
      author_post_counts: {
        Args: Record<PropertyKey, never>;
        Returns: {
          avatar_url: string;
          display_name: string;
          post_count: number;
          username: string;
        }[];
      };
      category_post_counts: {
        Args: Record<PropertyKey, never>;
        Returns: {
          category_id: number;
          post_count: number;
        }[];
      };
      create_comment: {
        Args: { p_body_md: string; p_parent_id?: string; p_post_id: string };
        Returns: {
          id: string;
          status: Database["public"]["Enums"]["comment_status"];
        }[];
      };
      filter_posts: {
        Args: {
          p_author?: string;
          p_category?: string;
          p_levels?: Database["public"]["Enums"]["post_level"][];
          p_limit?: number;
          p_offset?: number;
          p_tags?: string[];
        };
        Returns: {
          id: string;
          total_count: number;
        }[];
      };
      follower_count: {
        Args: { p_slug: string; p_type: Database["public"]["Enums"]["interest_target"] };
        Returns: number;
      };
      get_feed: {
        Args: {
          p_half_life_days?: number;
          p_interests?: Json;
          p_limit?: number;
          p_match_share?: number;
          p_max_tag_matches?: number;
          p_offset?: number;
        };
        Returns: {
          id: string;
          matched: boolean;
          reason_label: string;
          reason_type: Database["public"]["Enums"]["interest_target"];
          total_count: number;
        }[];
      };
      immutable_unaccent: { Args: { "": string }; Returns: string };
      list_comment_threads: {
        Args: { p_limit?: number; p_offset?: number; p_post_id: string; p_sort?: string };
        Returns: {
          id: string;
          total_count: number;
        }[];
      };
      merge_tags: { Args: { p_source: number; p_target: number }; Returns: undefined };
      my_reactions: {
        Args: { p_target_ids: string[]; p_target_type: Database["public"]["Enums"]["reaction_target"] };
        Returns: {
          emoji: Database["public"]["Enums"]["reaction_kind"];
          target_id: string;
        }[];
      };
      post_popularity: { Args: { p_post_id: string }; Returns: number };
      set_interest: {
        Args: { p_slug: string; p_type: Database["public"]["Enums"]["interest_target"]; p_weight: number };
        Returns: undefined;
      };
      set_user_role: {
        Args: { p_role: Database["public"]["Enums"]["user_role"]; p_user_id: string };
        Returns: undefined;
      };
      tag_post_counts: {
        Args: Record<PropertyKey, never>;
        Returns: {
          post_count: number;
          tag_id: number;
        }[];
      };
      toggle_reaction: {
        Args: {
          p_emoji: Database["public"]["Enums"]["reaction_kind"];
          p_target_id: string;
          p_target_type: Database["public"]["Enums"]["reaction_target"];
        };
        Returns: {
          counts: Json;
          mine: Database["public"]["Enums"]["reaction_kind"][];
        }[];
      };
    };
    Enums: {
      comment_status: "visible" | "pending" | "hidden";
      interest_target: "category" | "tag" | "author";
      post_level: "beginner" | "intermediate" | "advanced";
      post_status: "draft" | "review" | "published" | "archived";
      reaction_kind: "helpful" | "love" | "mindblown" | "confused";
      reaction_target: "post" | "comment";
      report_reason: "spam" | "offensive" | "off_topic" | "other";
      tag_status: "pending" | "approved";
      user_role: "reader" | "author" | "editor" | "admin";
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">;

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] & DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"] | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"] | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"] | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  public: {
    Enums: {
      comment_status: ["visible", "pending", "hidden"],
      interest_target: ["category", "tag", "author"],
      post_level: ["beginner", "intermediate", "advanced"],
      post_status: ["draft", "review", "published", "archived"],
      reaction_kind: ["helpful", "love", "mindblown", "confused"],
      reaction_target: ["post", "comment"],
      report_reason: ["spam", "offensive", "off_topic", "other"],
      tag_status: ["pending", "approved"],
      user_role: ["reader", "author", "editor", "admin"],
    },
  },
} as const;
