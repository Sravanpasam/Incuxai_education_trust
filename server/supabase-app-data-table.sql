-- ============================================================
-- IncuXai Education Trust — Site Data Table (app_data)
-- Run this SQL in the Supabase SQL Editor (Dashboard > SQL Editor)
-- ============================================================

-- 1. Create the app_data table (JSONB rows keyed by collection name)
CREATE TABLE IF NOT EXISTS app_data (
  key        TEXT PRIMARY KEY,
  value      JSONB NOT NULL DEFAULT '[]',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2. Row Level Security (RLS) — only the service_role key can access
ALTER TABLE app_data ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'app_data' AND policyname = 'Service role full access'
  ) THEN
    CREATE POLICY "Service role full access" ON app_data
      FOR ALL
      USING (true)
      WITH CHECK (true);
  END IF;
END $$;
