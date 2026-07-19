/**
 * List of common personal/free email domains to reject.
 * Only work/business emails are allowed.
 */
const PERSONAL_EMAIL_DOMAINS = new Set([
  'gmail.com',
  'yahoo.com',
  'hotmail.com',
  'outlook.com',
  'icloud.com',
  'aol.com',
  'proton.me',
  'protonmail.com',
  'mail.com',
  'gmx.com',
  'zoho.com',
  'rediffmail.com',
  'ymail.com',
  'live.com',
  'msn.com',
  'me.com',
  'att.net',
  'comcast.net',
  'verizon.net',
  'cox.net',
  'charter.net',
]);

/**
 * Middleware to validate that the email is a work/business email.
 * Rejects common personal email providers.
 */
export function validateWorkEmail(req, res, next) {
  const { email } = req.body;

  if (!email || typeof email !== 'string') {
    return res.status(400).json({
      success: false,
      message: 'Email is required.',
    });
  }

  const trimmed = email.trim().toLowerCase();

  // Basic format check
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(trimmed)) {
    return res.status(400).json({
      success: false,
      message: 'Please enter a valid email address.',
    });
  }

  // Extract domain
  const domain = trimmed.split('@')[1];

  if (PERSONAL_EMAIL_DOMAINS.has(domain)) {
    return res.status(400).json({
      success: false,
      message: `Personal email addresses (${domain}) are not accepted. Please use your work/business email.`,
    });
  }

  // Attach normalized email to request
  req.body.email = trimmed;
  next();
}
