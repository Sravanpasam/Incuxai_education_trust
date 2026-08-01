import bcrypt from 'bcryptjs';
import supabase from '../config/supabase.js';
import { generateOTP } from '../utils/generateOTP.js';

const OTP_EXPIRY_MINUTES = 3;
const MAX_ATTEMPTS = 5;
const MAX_RESEND_PER_EMAIL = 5;
const BCRYPT_ROUNDS = 10;

async function hashOTP(otp) {
  return bcrypt.hash(otp, BCRYPT_ROUNDS);
}

async function compareOTP(plain, hash) {
  return bcrypt.compare(plain, hash);
}

/**
 * Generate, hash, and store an OTP for the given email.
 * Previous OTPs for this email are deleted (no dependency on `verified` column).
 */
export async function createAndStoreOTP(email) {
  try {
    console.log(`[OTPService] createAndStoreOTP — email: ${email}`);

    const { count } = await supabase
      .from('otp_verifications')
      .select('id', { count: 'exact', head: true })
      .eq('email', email)
      .gt('created_at', new Date(Date.now() - OTP_EXPIRY_MINUTES * 60 * 1000).toISOString());

    console.log(`[OTPService] recent OTP count for ${email}: ${count}`);

    if (count && count >= MAX_RESEND_PER_EMAIL) {
      console.log(`[OTPService] RATE LIMITED — ${email} has ${count} recent OTPs`);
      return { otp: null, error: 'Too many OTP requests. Please try again later.' };
    }

    const { error: delError, count: delCount } = await supabase
      .from('otp_verifications')
      .delete()
      .eq('email', email);

    if (delError) {
      console.error('[OTPService] Delete previous OTPs error:', delError.message);
    } else {
      console.log(`[OTPService] Deleted previous OTPs for ${email}`);
    }

    const otp = generateOTP();
    const otp_hash = await hashOTP(otp);
    const expires_at = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000).toISOString();

    console.log(`[OTPService] OTP generated for ${email}: ${otp}, expires: ${expires_at}`);

    const { error: insError } = await supabase.from('otp_verifications').insert({
      email,
      otp_hash,
      expires_at,
      attempts: 0,
    });

    if (insError) {
      console.error('[OTPService] Insert error:', insError.message);
      return { otp: null, error: 'Failed to generate OTP. Please try again.' };
    }

    return { otp, error: null };
  } catch (err) {
    console.error('[OTPService] createAndStoreOTP error:', err);
    return { otp: null, error: 'Internal error generating OTP.' };
  }
}

/**
 * Find the latest OTP record for an email (order by created_at DESC).
 * Returns null if none found.
 */
export async function getLatestOTP(email) {
  const { data, error } = await supabase
    .from('otp_verifications')
    .select('*')
    .eq('email', email)
    .order('created_at', { ascending: false })
    .limit(1)
    .single();

  if (error || !data) return null;
  return data;
}

/**
 * Verify a plain OTP against the stored hash.
 * On success, delete the OTP record. On max attempts, delete it too.
 */
export async function verifyOTP(email, otp) {
  const record = await getLatestOTP(email);

  if (!record) {
    return { valid: false, reason: 'No active OTP found. Please request a new code.' };
  }

  if (new Date(record.expires_at) < new Date()) {
    await supabase.from('otp_verifications').delete().eq('id', record.id);
    return { valid: false, reason: 'OTP has expired. Please request a new code.' };
  }

  if (record.attempts >= MAX_ATTEMPTS) {
    await supabase.from('otp_verifications').delete().eq('id', record.id);
    return { valid: false, reason: 'Maximum verification attempts reached. Please request a new code.' };
  }

  await supabase
    .from('otp_verifications')
    .update({ attempts: record.attempts + 1 })
    .eq('id', record.id);

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

  await supabase.from('otp_verifications').delete().eq('id', record.id);

  return { valid: true, reason: 'OTP verified successfully.' };
}

/**
 * Delete all expired OTP records.
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
