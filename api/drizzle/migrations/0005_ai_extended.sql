-- 0005: AI extended — citations, rate limits, pgvector RAG corpus

CREATE TABLE IF NOT EXISTS ai_citations (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    message_id      UUID NOT NULL REFERENCES ai_messages(id) ON DELETE CASCADE,
    source_type     VARCHAR(20) NOT NULL CHECK (source_type IN ('quran', 'hadith', 'dua', 'ziyarat', 'book')),
    source_id       VARCHAR(100) NOT NULL,
    source_title    TEXT,
    excerpt         TEXT,
    relevance_score REAL,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_ai_citations_message ON ai_citations(message_id);
CREATE INDEX IF NOT EXISTS idx_ai_citations_source ON ai_citations(source_type, source_id);

CREATE TABLE IF NOT EXISTS ai_rate_limits (
    user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    date            DATE NOT NULL DEFAULT CURRENT_DATE,
    query_count     INTEGER NOT NULL DEFAULT 0,
    token_count     INTEGER NOT NULL DEFAULT 0,
    PRIMARY KEY (user_id, date)
);

-- pgvector extension for semantic search (requires superuser or rds_superuser on Aurora)
CREATE EXTENSION IF NOT EXISTS vector;

CREATE TABLE IF NOT EXISTS ai_knowledge_chunks (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    source_type     VARCHAR(20) NOT NULL,
    source_id       VARCHAR(100) NOT NULL,
    source_title    TEXT NOT NULL,
    chunk_index     INTEGER NOT NULL DEFAULT 0,
    content         TEXT NOT NULL,
    embedding       vector(1536),
    metadata        JSONB NOT NULL DEFAULT '{}',
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(source_type, source_id, chunk_index)
);

CREATE INDEX IF NOT EXISTS idx_ai_chunks_source
  ON ai_knowledge_chunks(source_type, source_id);

-- IVFFlat index: create AFTER seeding embeddings (lists = sqrt(row_count) recommended)
-- Run manually once corpus exceeds 1,000 rows:
-- CREATE INDEX idx_ai_chunks_embedding ON ai_knowledge_chunks
--   USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);

-- Optional: full-text fallback on chunk content
CREATE INDEX IF NOT EXISTS idx_ai_chunks_fts
  ON ai_knowledge_chunks USING gin(to_tsvector('english', content));

-- Add mode column to conversations (expand-contract safe)
ALTER TABLE ai_conversations
  ADD COLUMN IF NOT EXISTS mode VARCHAR(20) NOT NULL DEFAULT 'general';

ALTER TABLE ai_conversations
  ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ;

CREATE INDEX IF NOT EXISTS idx_ai_conversations_active
  ON ai_conversations(user_id, updated_at DESC)
  WHERE deleted_at IS NULL;

-- Rate limit increment helper (called from API)
CREATE OR REPLACE FUNCTION increment_ai_rate_limit(p_user_id UUID, p_tokens INTEGER DEFAULT 1)
RETURNS INTEGER AS $$
DECLARE
  v_count INTEGER;
BEGIN
  INSERT INTO ai_rate_limits (user_id, date, query_count, token_count)
  VALUES (p_user_id, CURRENT_DATE, 1, p_tokens)
  ON CONFLICT (user_id, date)
  DO UPDATE SET
    query_count = ai_rate_limits.query_count + 1,
    token_count = ai_rate_limits.token_count + p_tokens
  RETURNING query_count INTO v_count;
  RETURN v_count;
END;
$$ LANGUAGE plpgsql;
