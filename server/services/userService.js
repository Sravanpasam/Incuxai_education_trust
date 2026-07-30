import bcrypt from 'bcryptjs';
import supabase from '../config/supabase.js';

const BCRYPT_ROUNDS = 10;

/**
 * Create a new user account.
 * Column names match the actual Supabase table:
 *   id, full_name, personal_email, phone_number, company_name, role,
 *   work_email, password_hash, work_email_verified, created_at, updated_at
 */
export async function createUser({ name, personalEmail, phone, workEmail, password, company, role }) {
  console.log('[UserService] createUser — inserting:', JSON.stringify({
    name,
    personalEmail,
    phone,
    workEmail,
    hasPassword: !!password,
    company,
    role,
  }));

  const passwordHash = await bcrypt.hash(password, BCRYPT_ROUNDS);
  const insertData = {
    full_name: name,
    personal_email: personalEmail,
    phone_number: phone,
    work_email: workEmail ? workEmail.toLowerCase() : null,
    password_hash: passwordHash,
    work_email_verified: true,
    company_name: company || null,
    role: role || null,
  };
  console.log('[UserService] createUser — insert payload columns:', Object.keys(insertData).join(', '));

  const { data, error } = await supabase
    .from('users')
    .insert(insertData)
    .select('id, full_name, personal_email, work_email, phone_number, company_name, role, work_email_verified, created_at, updated_at')
    .single();

  if (error) {
    if (error.code === '23505') {
      console.log('[UserService] Create — DUPLICATE email:', personalEmail);
      return { user: null, error: 'An account with this email already exists. Please sign in.' };
    }
    console.error('[UserService] Create error:', {
      message: error.message,
      details: error.details || 'N/A',
      hint: error.hint,
      code: error.code,
      column: error.message?.match(/"([^"]+)"/)?.[1] || 'unknown',
    });
    return { user: null, error: `Failed to create account: ${error.message}` };
  }

  if (!data) {
    console.error('[UserService] Create — no data returned from Supabase insert');
    return { user: null, error: 'Account creation failed. No data returned from database.' };
  }

  return { user: data, error: null };
}

/**
 * Find a user by personal email.
 */
export async function findUserByPersonalEmail(email) {
  const normalizedEmail = email.toLowerCase();

  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('personal_email', normalizedEmail)
    .maybeSingle();

  if (error) {
    console.error('[UserService] findUserByPersonalEmail error:', error.message);
    return null;
  }

  return data;
}

/**
 * Find a user by personal email or work email.
 * Personal email match takes priority.
 */
export async function findUserByEmail(email) {
  const normalizedEmail = email.toLowerCase();

  // Try personal email first
  const { data: personalMatch, error: personalError } = await supabase
    .from('users')
    .select('*')
    .eq('personal_email', normalizedEmail)
    .maybeSingle();

  if (!personalError && personalMatch) return personalMatch;

  // Fall back to work email
  const { data: workMatch, error: workError } = await supabase
    .from('users')
    .select('*')
    .eq('work_email', normalizedEmail)
    .maybeSingle();

  if (!workError && workMatch) return workMatch;

  return null;
}

/**
 * Verify a plain password against a bcrypt hash.
 */
export async function verifyPassword(plain, hash) {
  return bcrypt.compare(plain, hash);
}

/**
 * Update a user's password by personal email.
 */
export async function updatePassword(email, newPassword) {
  const passwordHash = await bcrypt.hash(newPassword, BCRYPT_ROUNDS);
  const { error } = await supabase
    .from('users')
    .update({ password_hash: passwordHash, updated_at: new Date().toISOString() })
    .eq('personal_email', email.toLowerCase());
  if (error) return { success: false, error: error.message };
  return { success: true };
}
