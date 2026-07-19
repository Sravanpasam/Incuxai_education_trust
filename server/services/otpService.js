import bcrypt from 'bcrypt';
import supabase from '../config/supabase.js';
import { generateOTP } from '../utils/generateOTP.js';

const OTP_EXPIRY_MINUTES = 3;
const MAX_ATTEMPTS = 5;
const MAX_RESEND_PER_EMAIL = 5;
const BCRYPT_ROUNDS = 10;

/**
 * Hash an OTP string using bcrypt.
 */
async function hashOTP(otp) {
  return bcrypt.hash(otp, BCRYPT_ROUNDS);
}

/**
 * Compare a plain OTP against a bcrypt hash.
 */
async function compareOTP(plain, hash) {
  return bcrypt.compare(plain, hash);
}

/**
 * Generate, hash, and store an OTP for the given email.
 * Previous unverified OTPs for this email are replaced.
 * @returns {{ otp: string, error: string|null }}
 */
export async function createAndStoreOTP(email) {
  try {
    // Rate-limit: check how many unexpired OTPs exist recently for this email
    const { count } = await supabase
      .from('otp_verifications')
      .select('id', { count: 'exact', head: true })
      .eq('email', email)
      .eq('verified', false)
      .gt('created_at', new Date(Date.now() - OTP_EXPIRY_MINUTES * 60 * 1000).toISOString());

    if (count && count >= MAX_RESEND_PER_EMAIL) {
      return { otp: null, error: 'Too many OTP requests. Please try again later.' };
    }

    // Invalidate any previous unverified OTPs for this email
    await supabase
      .from('otp_verifications')
      .update({ verified: true })
      .eq('email', email)
      .eq('verified', false);

    // Generate and hash
    const otp = generateOTP();
    const otp_hash = await hashOTP(otp);
    const expires_at = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000).toISOString();

    // Store in Supabase
    const { error } = await supabase.from('otp_verifications').insert({
      email,
      otp_hash,
      expires_at,
      verified: false,
      attempts: 0,
    });

    if (error) {
      console.error('[OTPService] Insert error:', error.message);
      return { otp: null, error: 'Failed to generate OTP. Please try again.' };
    }

    return { otp, error: null };
  } catch (err) {
    console.error('[OTPService] createAndStoreOTP error:', err);
    return { otp: null, error: 'Internal error generating OTP.' };
  }
}

/**
 * Find the latest unverified OTP record for an email.
 * Returns null if none found.
 */
export async function getLatestOTP(email) {
  const { data, error } = await supabase
    .from('otp_verifications')
    .select('*')
    .eq('email', email)
    .eq('verified', false)
    .order('created_at', { ascending: false })
    .limit(1)
    .single();

  if (error || !data) return null;
  return data;
}

/**
 * Verify a plain OTP against the stored hash.
 * @returns {{ valid: boolean, reason: string }}
 */
export async function verifyOTP(email, otp) {
  const record = await getLatestOTP(email);

  if (!record) {
    return { valid: false, reason: 'No active OTP found. Please request a new code.' };
  }

  // Check expiry
  if (new Date(record.expires_at) < new Date()) {
    return { valid: false, reason: 'OTP has expired. Please request a new code.' };
  }

  // Check max attempts
  if (record.attempts >= MAX_ATTEMPTS) {
    // Mark as verified so it cannot be reused
    await supabase
      .from('otp_verifications')
      .update({ verified: true })
      .eq('id', record.id);
    return { valid: false, reason: 'Maximum verification attempts reached. Please request a new code.' };
  }

  // Increment attempts
  await supabase
    .from('otp_verifications')
    .update({ attempts: record.attempts + 1 })
    .eq('id', record.id);

  // Compare
  const match = await compareOTP(otp, record.otp_hash);

  if (!match) {
    const remaining = MAX_ATTEMPTS - (record.attempts + 1);
    return {
      valid: false,
      reason: remaining > 0
        ? `Invalid OTP. ${remaining} attempt(s) remaining.`
        : 'Maximum attempts reached. Please request a new code.',
    };
  }

  // Mark verified and delete
  await supabase
    .from('otp_verifications')
    .delete()
    .eq('id', record.id);

  return { valid: true, reason: 'OTP verified successfully.' };
}

/**
 * Delete all expired OTP records (cleanup utility).
 */
export async function cleanupExpiredOTPs() {
  const { error } = await supabase
    .from('otp_verifications')
    .delete()
    .lt('expires_at', new Date().toISOString());

  if (error) {
    console.error('[OTPService] Cleanup error:', error.message);
  }
}
