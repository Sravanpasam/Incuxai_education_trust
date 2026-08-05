import supabase from '../config/supabase.js';

/**
 * Ensures the `app_data` table exists in Supabase.
 * Stores site collections (volunteers, registrations, tasks, teachxai, ...)
 * as JSONB rows keyed by collection name. Idempotent — safe on every startup.
 */

const CREATE_TABLE_SQL = `
CREATE TABLE IF NOT EXISTS app_data (
  key        TEXT PRIMARY KEY,
  value      JSONB NOT NULL DEFAULT '[]',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

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
`.trim();

export async function ensureAppDataTable() {
  try {
    const { error } = await supabase.from('app_data').select('key').limit(1);
    if (!error) {
      console.log('[Migration] app_data table exists.');
      return true;
    }
    const missing =
      error.code === '42P01' ||
      error.message?.includes('does not exist') ||
      error.message?.includes('Could not find the table') ||
      error.message?.includes('relation') && error.message?.includes('not exist');
    if (!missing) {
      console.log('[Migration] app_data exists (other non-critical error):', error.message);
      return true;
    }
    console.log('[Migration] app_data table does not exist. Creating...');
  } catch (e) {
    console.log('[Migration] Could not check app_data table:', e.message);
  }

  try {
    const { error: execErr } = await supabase.rpc('exec_sql', { sql: CREATE_TABLE_SQL });
    if (execErr) {
      const createFnSql = `
        CREATE OR REPLACE FUNCTION exec_sql(sql TEXT)
        RETURNS VOID AS $$
        BEGIN
          EXECUTE sql;
        END;
        $$ LANGUAGE plpgsql SECURITY DEFINER;
      `;
      const fnErr = await supabase.rpc('exec_sql', { sql: createFnSql });
      if (fnErr.error) throw fnErr.error;
      const retryErr = await supabase.rpc('exec_sql', { sql: CREATE_TABLE_SQL });
      if (retryErr.error) throw retryErr.error;
    }
    console.log('[Migration] app_data table created successfully via exec_sql.');
    return true;
  } catch (e) {
    console.log('[Migration] Auto-create app_data failed:', e.message);
  }

  console.log('');
  console.log('[Migration] ACTION REQUIRED: Create the app_data table manually.');
  console.log('[Migration] https://supabase.com/dashboard/project/tuolfpbvpdubxdfthbfq/sql/new');
  console.log(CREATE_TABLE_SQL);
  console.log('');
  return false;
}
