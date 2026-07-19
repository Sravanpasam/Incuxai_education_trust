import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = '24h';

if (!JWT_SECRET) {
  console.error('[JWT] Missing JWT_SECRET environment variable');
  process.exit(1);
}

/**
 * Generate a signed JWT token for an authenticated user.
 * @param {object} payload - Data to encode in the token (e.g. { email })
 * @returns {string} Signed JWT string
 */
export function generateToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

/**
 * Verify and decode a JWT token.
 * @param {string} token - The JWT string to verify
 * @returns {object|null} Decoded payload or null if invalid/expired
 */
export function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch {
    return null;
  }
}
