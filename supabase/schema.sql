-- ==============================================================================
-- CHATMOLDED.APP - SUPABASE DATABASE SCHEMA (v1.0)
-- ==============================================================================

-- 1. Enable Required Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "vector";

-- ==============================================================================
-- 2. User Profiles Table (Mirrors Supabase auth.users)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Trigger to automatically create a profile when a new user signs up via Supabase Auth
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url)
  VALUES (
    new.id,
    new.email,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ==============================================================================
-- 3. Bots Table (The Core Chatbot Configuration)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.bots (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL DEFAULT 'My AI Assistant',
  slug TEXT UNIQUE,
  description TEXT DEFAULT '',
  
  -- Conversational Configuration
  system_prompt TEXT DEFAULT 'You are a helpful, concise AI assistant trained specifically on the provided knowledge context. If the answer cannot be determined from the context, state that you do not know politely.',
  welcome_message TEXT DEFAULT 'Hello! How can I help you today?',
  sample_questions JSONB DEFAULT '["What can you help me with?", "How do I get in touch?"]'::jsonb,
  
  -- Appearance & Widget Customization
  theme TEXT NOT NULL DEFAULT 'emerald', -- 'emerald' | 'cyan' | 'indigo' | 'purple'
  avatar_url TEXT, -- Custom uploaded logo or headshot image URL
  position TEXT NOT NULL DEFAULT 'bottom-right', -- 'bottom-right' | 'bottom-left'
  
  -- Security & Embedding
  allowed_origins TEXT[] DEFAULT ARRAY['*']::text[], -- Domains permitted to embed this bot (e.g. ['https://alex.dev', 'http://localhost:3000'])
  
  -- BYOK AI Engine Settings
  provider TEXT NOT NULL DEFAULT 'groq', -- 'groq' | 'openai' | 'anthropic' | 'gemini'
  model TEXT NOT NULL DEFAULT 'llama-3.3-70b-versatile', -- e.g. 'llama-3.3-70b-versatile', 'gpt-4o-mini', 'claude-3-5-haiku'
  api_key_encrypted TEXT, -- Encrypted BYOK key stored securely on behalf of user
  
  -- Protection & Rate Limits
  rate_limit_per_minute INT DEFAULT 20,
  is_active BOOLEAN DEFAULT TRUE,
  
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Index for fast lookup by user
CREATE INDEX IF NOT EXISTS idx_bots_user_id ON public.bots(user_id);
CREATE INDEX IF NOT EXISTS idx_bots_id ON public.bots(id);

-- ==============================================================================
-- 4. Documents Table (Ingested Knowledge Files)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.documents (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  bot_id UUID REFERENCES public.bots(id) ON DELETE CASCADE NOT NULL,
  file_name TEXT NOT NULL,
  file_type TEXT NOT NULL, -- 'pdf' | 'docx' | 'txt' | 'md'
  file_size_bytes INT NOT NULL DEFAULT 0,
  file_url TEXT, -- Storage bucket path if file is persisted
  status TEXT NOT NULL DEFAULT 'indexed', -- 'processing' | 'indexed' | 'failed'
  chunk_count INT NOT NULL DEFAULT 0,
  
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_documents_bot_id ON public.documents(bot_id);

-- ==============================================================================
-- 5. Document Chunks Table (Vector Storage for RAG)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.document_chunks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  bot_id UUID REFERENCES public.bots(id) ON DELETE CASCADE NOT NULL,
  document_id UUID REFERENCES public.documents(id) ON DELETE CASCADE NOT NULL,
  
  content TEXT NOT NULL, -- The extracted text chunk
  token_count INT DEFAULT 0,
  chunk_index INT NOT NULL DEFAULT 0,
  
  -- Vector Embedding (1536 dimensions for OpenAI text-embedding-3-small, standard across modern RAG)
  embedding vector(1536),
  
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_document_chunks_bot_id ON public.document_chunks(bot_id);
CREATE INDEX IF NOT EXISTS idx_document_chunks_doc_id ON public.document_chunks(document_id);

-- HNSW Vector Index for ultra-fast cosine similarity vector search
CREATE INDEX IF NOT EXISTS idx_document_chunks_embedding 
  ON public.document_chunks 
  USING hnsw (embedding vector_cosine_ops);

-- ==============================================================================
-- 6. Vector Similarity Search RPC Function
-- ==============================================================================
CREATE OR REPLACE FUNCTION match_document_chunks (
  query_embedding vector(1536),
  target_bot_id UUID,
  match_threshold FLOAT DEFAULT 0.5,
  match_count INT DEFAULT 4
)
RETURNS TABLE (
  id UUID,
  document_id UUID,
  content TEXT,
  similarity FLOAT
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT
    dc.id,
    dc.document_id,
    dc.content,
    1 - (dc.embedding <=> query_embedding) AS similarity
  FROM public.document_chunks dc
  WHERE dc.bot_id = target_bot_id
    AND 1 - (dc.embedding <=> query_embedding) > match_threshold
  ORDER BY dc.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;

-- ==============================================================================
-- 7. Chat Logs & History (Optional Analytics)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.chat_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  bot_id UUID REFERENCES public.bots(id) ON DELETE CASCADE NOT NULL,
  visitor_token TEXT,
  origin_url TEXT,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.chat_messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id UUID REFERENCES public.chat_sessions(id) ON DELETE CASCADE NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_chat_sessions_bot ON public.chat_sessions(bot_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_session ON public.chat_messages(session_id);

-- ==============================================================================
-- 8. Row Level Security (RLS) Policies
-- ==============================================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bots ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.document_chunks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;

-- Profiles: Users can view and update only their own profile
CREATE POLICY "Users can view own profile" 
  ON public.profiles FOR SELECT 
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" 
  ON public.profiles FOR UPDATE 
  USING (auth.uid() = id);

-- Bots: Users can view, create, update, delete their own bots
CREATE POLICY "Users can manage own bots" 
  ON public.bots FOR ALL 
  USING (auth.uid() = user_id);

-- Public Embed Read Policy: Anyone can query public configuration of an active bot
CREATE POLICY "Public can view active bot embed config" 
  ON public.bots FOR SELECT 
  USING (is_active = TRUE);

-- Documents: Users can manage documents for their own bots
CREATE POLICY "Users can manage documents for their bots" 
  ON public.documents FOR ALL 
  USING (
    EXISTS (
      SELECT 1 FROM public.bots 
      WHERE bots.id = documents.bot_id 
        AND bots.user_id = auth.uid()
    )
  );

-- Document Chunks: Users can manage chunks for their own bots
CREATE POLICY "Users can manage chunks for their bots" 
  ON public.document_chunks FOR ALL 
  USING (
    EXISTS (
      SELECT 1 FROM public.bots 
      WHERE bots.id = document_chunks.bot_id 
        AND bots.user_id = auth.uid()
    )
  );

-- Chat Sessions & Messages: Anonymous visitors can insert sessions and messages for active bots
CREATE POLICY "Visitors can create chat sessions"
  ON public.chat_sessions FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.bots 
      WHERE bots.id = chat_sessions.bot_id 
        AND bots.is_active = TRUE
    )
  );

CREATE POLICY "Visitors can insert messages"
  ON public.chat_messages FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.chat_sessions 
      JOIN public.bots ON bots.id = chat_sessions.bot_id
      WHERE chat_sessions.id = chat_messages.session_id 
        AND bots.is_active = TRUE
    )
  );

-- Bot owners can view their chat logs
CREATE POLICY "Bot owners can view chat sessions"
  ON public.chat_sessions FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.bots 
      WHERE bots.id = chat_sessions.bot_id 
        AND bots.user_id = auth.uid()
    )
  );

CREATE POLICY "Bot owners can view chat messages"
  ON public.chat_messages FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.chat_sessions 
      JOIN public.bots ON bots.id = chat_sessions.bot_id
      WHERE chat_sessions.id = chat_messages.session_id 
        AND bots.user_id = auth.uid()
    )
  );
