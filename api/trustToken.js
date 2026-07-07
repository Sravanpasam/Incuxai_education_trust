import crypto from 'crypto';

/**
 * Signs a payload into a JWT-like HMAC token using a shared secret.
 * @param {object} payload - The token payload.
 * @param {string} secret - The shared secret.
 * @returns {string} The signed token.
 */
export function signToken(payload, secret) {
  const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url');
  const body = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const signature = crypto.createHmac('sha256', secret).update(`${header}.${body}`).digest('base64url');
  return `${header}.${body}.${signature}`;
}

/**
 * Verifies and decodes a JWT-like HMAC token.
 * @param {string} token - The signed token.
 * @param {string} secret - The shared secret.
 * @returns {object|null} The decoded payload if valid, otherwise null.
 */
export function verifyToken(token, secret) {
  try {
    if (!token) return null;
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    
    const [headerB64, bodyB64, signature] = parts;
    const expectedSignature = crypto.createHmac('sha256', secret).update(`${headerB64}.${bodyB64}`).digest('base64url');
    
    if (signature !== expectedSignature) {
      console.warn('[TrustToken] Signature mismatch on verification');
      return null;
    }
    
    const decodedBody = JSON.parse(Buffer.from(bodyB64, 'base64url').toString('utf8'));
    return decodedBody;
  } catch (err) {
    console.error('[TrustToken] Verification failed with error:', err);
    return null;
  }
}
