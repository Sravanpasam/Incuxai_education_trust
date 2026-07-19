const BLOCKED_DOMAINS: Set<string> = new Set([
  'gmail.com',
  'googlemail.com',
  'yahoo.com',
  'hotmail.com',
  'outlook.com',
  'live.com',
  'msn.com',
  'icloud.com',
  'me.com',
  'aol.com',
  'proton.me',
  'protonmail.com',
  'zoho.com',
  'yandex.com',
  'mail.com',
  'gmx.com',
  'rediffmail.com',
]);

export interface EmailValidationResult {
  valid: boolean;
  error?: string;
}

export function validateWorkEmail(email: string): EmailValidationResult {
  const trimmed = email.trim().toLowerCase();

  if (!trimmed) {
    return { valid: false, error: 'Email is required.' };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(trimmed)) {
    return { valid: false, error: 'Please enter a valid email address.' };
  }

  const domain = trimmed.split('@')[1];

  if (BLOCKED_DOMAINS.has(domain)) {
    return {
      valid: false,
      error: `Personal email addresses (${domain}) are not accepted. Please use your work/business email.`,
    };
  }

  return { valid: true };
}
