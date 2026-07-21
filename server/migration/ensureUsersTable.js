import supabase from '../config/supabase.js';

/**
 * Ensures the `users` table exists in Supabase.
 * Runs on every server startup — idempotent (safe to run multiple times).
 *
 * Strategy:
 *   1. Try to SELECT from users — if it works, table exists → done.
 *   2. If it fails with "relation does not exist", execute the CREATE TABLE SQL
 *      via Supabase's rpc() calling a self-contained PL/pgSQL function.
 *   3. If rpc also fails (function doesn't exist), fall back to logging the SQL
 *      for manual execution.
 */

const CREATE_TABLE_SQL = `
CREATE TABLE IF NOT EXISTS users (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name           TEXT NOT NULL,
  personal_email      TEXT NOT NULL,
  work_email          TEXT NOT NULL UNIQUE,
  phone_number        TEXT NOT NULL,
  password_hash       TEXT NOT NULL,
  work_email_verified BOOLEAN NOT NULL DEFAULT false,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_users_work_email ON users (work_email);
CREATE INDEX IF NOT EXISTS idx_users_personal_email ON users (personal_email);

ALTER TABLE users ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'users' AND policyname = 'Service role full access'
  ) THEN
    CREATE POLICY "Service role full access" ON users
      FOR ALL
      USING (true)
      WITH CHECK (true);
  END IF;
END $$;
`.trim();

const SUPABASE_DASHBOARD_SQL_URL = `https://supabase.com/dashboard/project/tuolfpbvpdubxdfthbfq/sql/new`;

export async function ensureUsersTable() {
  console.log('[Migration] Checking users table...');

  // Step 1: Quick check — can we read from users?
  try {
    const { error } = await supabase.from('users').select('id').limit(1);
    if (!error) {
      console.log('[Migration] users table exists. OK');
      return true;
    }
    // "relation does not exist" is PGRST204 or 42P01
    if (error.code !== '42P01' && !error.message?.includes('does not exist')) {
      console.log('[Migration] users table exists (other non-critical error). OK');
      return true;
    }
    console.log('[Migration] users table does not exist. Creating...');
  } catch (e) {
    console.log('[Migration] Could not check users table:', e.message);
  }

  // Step 2: Try to create via a PL/pgSQL function call (rpc)
  try {
    // First, create the helper function
    const fnSql = `
      CREATE OR REPLACE FUNCTION exec_sql(sql TEXT)
      RETURNS VOID AS $$
      BEGIN
        EXECUTE sql;
      END;
      $$ LANGUAGE plpgsql SECURITY DEFINER;
    `;
    const fnRes = await supabase.rpc('exec_sql', { sql: 'SELECT 1' }).single();
    // If exec_sql already exists, we can use it
    if (fnRes.error && fnRes.error.message?.includes('function exec_sql')) {
      // Function doesn't exist — we can't create it via rpc, skip to manual instructions
      throw new Error('exec_sql function not available');
    }
    // Use exec_sql to create the table
    const { error: execErr } = await supabase.rpc('exec_sql', { sql: CREATE_TABLE_SQL });
    if (execErr) throw execErr;

    console.log('[Migration] users table created successfully via exec_sql.');
    return true;
  } catch (e) {
    console.log('[Migration] Auto-create via rpc failed:', e.message);
  }

  // Step 3: Fall back to manual instructions
  console.log('');
  console.log('╔══════════════════════════════════════════════════════════════╗');
  console.log('║  ACTION REQUIRED: Create the users table in Supabase       ║');
  console.log('╠══════════════════════════════════════════════════════════════╣');
  console.log('║                                                            ║');
  console.log('║  1. Open the Supabase SQL Editor:                          ║');
  console.log(`║     ${SUPABASE_DASHBOARD_SQL_URL}`);
  console.log('║                                                            ║');
  console.log('║  2. Paste the SQL below and click "Run":                   ║');
  console.log('║                                                            ║');
  CREATE_TABLE_SQL.split('\n').forEach(line => {
    console.log(`║  ${line.padEnd(60)}║`);
  });
  console.log('║                                                            ║');
  console.log('║  3. Restart the server after running the SQL.              ║');
  console.log('╚══════════════════════════════════════════════════════════════╝');
  console.log('');

  return false;
}
