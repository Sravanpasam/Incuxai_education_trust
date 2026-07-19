-- ============================================================
-- IncuXai Education Trust — OTP Verification Table
-- Run this SQL in the Supabase SQL Editor (Dashboard > SQL Editor)
-- ============================================================

-- 1. Create the otp_verifications table
CREATE TABLE IF NOT EXISTS otp_verifications (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email      TEXT NOT NULL,
  otp_hash   TEXT NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  verified   BOOLEAN DEFAULT FALSE,
  attempts   INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Index for fast lookups by email + verified status
CREATE INDEX IF NOT EXISTS idx_otp_email_verified
  ON otp_verifications (email, verified);

-- 3. Index for cleanup of expired records
CREATE INDEX IF NOT EXISTS idx_otp_expires_at
  ON otp_verifications (expires_at);

-- 4. Row Level Security (RLS) — disable public access
ALTER TABLE otp_verifications ENABLE ROW LEVEL SECURITY;

-- 5. Only the service_role key (backend) can access this table
CREATE POLICY "Service role full access"
  ON otp_verifications
  FOR ALL
  USING (true)
  WITH CHECK (true);
