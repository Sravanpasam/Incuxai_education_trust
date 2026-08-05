import supabase from '../config/supabase.js';

/**
 * Read/write site collections (volunteers, registrations, tasks, teachxai, ...)
 * from/to the Supabase `app_data` table (JSONB rows keyed by collection name).
 */

export async function readAllAppData() {
  const { data, error } = await supabase.from('app_data').select('key, value');
  if (error) {
    console.error('[DataStore] readAll error:', error.message);
    return {};
  }
  const out = {};
  (data || []).forEach((row) => {
    out[row.key] = row.value;
  });
  return out;
}

export async function readAppData(key) {
  const { data, error } = await supabase.from('app_data').select('value').eq('key', key).maybeSingle();
  if (error) {
    console.error(`[DataStore] read(${key}) error:`, error.message);
    return null;
  }
  return data?.value ?? null;
}

export async function writeAppData(entries) {
  const rows = Object.entries(entries)
    .filter(([, value]) => value !== undefined && value !== null)
    .map(([key, value]) => ({
      key,
      value: typeof value === 'string' ? value : JSON.stringify(value),
      updated_at: new Date().toISOString(),
    }));
  if (rows.length === 0) return { error: null };

  const { error } = await supabase
    .from('app_data')
    .upsert(rows, { onConflict: 'key' });
  if (error) {
    console.error('[DataStore] write error:', error.message);
  }
  return { error };
}
