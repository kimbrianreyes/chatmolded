export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type BotTheme = 'emerald' | 'cyan' | 'indigo' | 'purple';
export type AIProvider = 'groq' | 'xai' | 'openai' | 'anthropic' | 'gemini' | 'deepseek' | 'openrouter' | 'custom';
export type DocumentFileType = 'pdf' | 'docx' | 'txt' | 'md';
export type DocumentStatus = 'processing' | 'indexed' | 'failed';

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          avatar_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name?: string | null;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string | null;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      bots: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          slug: string | null;
          description: string | null;
          system_prompt: string | null;
          welcome_message: string;
          sample_questions: string[] | Json;
          theme: BotTheme;
          avatar_url: string | null;
          position: string;
          allowed_origins: string[];
          provider: AIProvider;
          model: string;
          api_key_encrypted: string | null;
          rate_limit_per_minute: number;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name?: string;
          slug?: string | null;
          description?: string | null;
          system_prompt?: string | null;
          welcome_message?: string;
          sample_questions?: string[] | Json;
          theme?: BotTheme;
          avatar_url?: string | null;
          position?: string;
          allowed_origins?: string[];
          provider?: AIProvider;
          model?: string;
          api_key_encrypted?: string | null;
          rate_limit_per_minute?: number;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          slug?: string | null;
          description?: string | null;
          system_prompt?: string | null;
          welcome_message?: string;
          sample_questions?: string[] | Json;
          theme?: BotTheme;
          avatar_url?: string | null;
          position?: string;
          allowed_origins?: string[];
          provider?: AIProvider;
          model?: string;
          api_key_encrypted?: string | null;
          rate_limit_per_minute?: number;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      documents: {
        Row: {
          id: string;
          bot_id: string;
          file_name: string;
          file_type: DocumentFileType;
          file_size_bytes: number;
          file_url: string | null;
          status: DocumentStatus;
          chunk_count: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          bot_id: string;
          file_name: string;
          file_type: DocumentFileType;
          file_size_bytes?: number;
          file_url?: string | null;
          status?: DocumentStatus;
          chunk_count?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          bot_id?: string;
          file_name?: string;
          file_type?: DocumentFileType;
          file_size_bytes?: number;
          file_url?: string | null;
          status?: DocumentStatus;
          chunk_count?: number;
          created_at?: string;
        };
      };
      document_chunks: {
        Row: {
          id: string;
          bot_id: string;
          document_id: string;
          content: string;
          token_count: number;
          chunk_index: number;
          embedding: number[] | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          bot_id: string;
          document_id: string;
          content: string;
          token_count?: number;
          chunk_index?: number;
          embedding?: number[] | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          bot_id?: string;
          document_id?: string;
          content?: string;
          token_count?: number;
          chunk_index?: number;
          embedding?: number[] | null;
          created_at?: string;
        };
      };
      chat_sessions: {
        Row: {
          id: string;
          bot_id: string;
          visitor_token: string | null;
          origin_url: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          bot_id: string;
          visitor_token?: string | null;
          origin_url?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          bot_id?: string;
          visitor_token?: string | null;
          origin_url?: string | null;
          created_at?: string;
        };
      };
      chat_messages: {
        Row: {
          id: string;
          session_id: string;
          role: 'user' | 'assistant' | 'system';
          content: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          session_id: string;
          role: 'user' | 'assistant' | 'system';
          content: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          session_id?: string;
          role?: 'user' | 'assistant' | 'system';
          content?: string;
          created_at?: string;
        };
      };
    };
    Functions: {
      match_document_chunks: {
        Args: {
          query_embedding: number[];
          target_bot_id: string;
          match_threshold?: number;
          match_count?: number;
        };
        Returns: {
          id: string;
          document_id: string;
          content: string;
          similarity: number;
        }[];
      };
    };
  };
}

export type Bot = Database['public']['Tables']['bots']['Row'];
export type Document = Database['public']['Tables']['documents']['Row'];
export type DocumentChunk = Database['public']['Tables']['document_chunks']['Row'];
export type Profile = Database['public']['Tables']['profiles']['Row'];
