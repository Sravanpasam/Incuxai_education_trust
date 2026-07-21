import crypto from 'crypto';

/**
 * Generate a secure 6-digit OTP using Node's crypto module.
 * Returns a string like "482917".
 */
export function generateOTP() {
  const buffer = crypto.randomBytes(3);
  const otp = parseInt(buffer.toString('hex'), 16) % 1000000;
  return otp.toString().padStart(6, '0');
}
