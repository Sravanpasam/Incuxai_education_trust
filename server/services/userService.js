import bcrypt from 'bcrypt';
import supabase from '../config/supabase.js';

const BCRYPT_ROUNDS = 10;

/**
 * Create a new user account.
 */
export async function createUser({ fullName, personalEmail, phone, workEmail, password, workEmailVerified = false }) {
  const passwordHash = await bcrypt.hash(password, BCRYPT_ROUNDS);

  const { data, error } = await supabase
    .from('users')
    .insert({
      full_name: fullName,
      personal_email: personalEmail,
      phone_number: phone,
      work_email: workEmail.toLowerCase(),
      password_hash: passwordHash,
      work_email_verified: workEmailVerified,
    })
    .select('id, full_name, personal_email, work_email, phone_number, created_at, updated_at')
    .single();

  if (error) {
    if (error.code === '23505') {
      return { user: null, error: 'An account with this work email already exists. Please sign in.' };
    }
    console.error('[UserService] Create error:', {
      message: error.message,
      details: error.details,
      hint: error.hint,
      code: error.code,
    });
    return { user: null, error: 'Failed to create account. Please try again.' };
  }

  return { user: data, error: null };
}

/**
 * Find a user by work email.
 */
export async function findUserByEmail(workEmail) {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('work_email', workEmail.toLowerCase())
    .single();

  if (error || !data) return null;
  return data;
}

/**
 * Verify a plain password against a bcrypt hash.
 */
export async function verifyPassword(plain, hash) {
  return bcrypt.compare(plain, hash);
}

/**
 * Update a user's password by work email.
 */
export async function updatePassword(workEmail, newPassword) {
  const passwordHash = await bcrypt.hash(newPassword, BCRYPT_ROUNDS);
  const { error } = await supabase
    .from('users')
    .update({ password_hash: passwordHash, updated_at: new Date().toISOString() })
    .eq('work_email', workEmail.toLowerCase());
  if (error) return { success: false, error: error.message };
  return { success: true };
}
