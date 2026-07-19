/**
 * IncuXAI Platform Utility Helpers
 * High-performance utilities for throttling, retry mechanisms, rate limiting, and domain validation.
 */

// Resilient Network Fetch Wrapper with Exponential Backoff & Jitter
export async function fetchWithRetry(
  url: string,
  options: RequestInit = {},
  maxRetries = 3,
  baseBackoffMs = 800
): Promise<Response> {
  let attempt = 0;
  while (attempt < maxRetries) {
    try {
      const response = await fetch(url, options);
      if (response.ok || response.status < 500) {
        return response; // Success or client error (do not retry 4xx errors)
      }
      throw new Error(`Server returned status ${response.status}`);
    } catch (err) {
      attempt++;
      if (attempt >= maxRetries) {
        throw err;
      }
      // Exponential backoff with random jitter
      const jitter = Math.random() * 200;
      const delay = Math.pow(2, attempt) * baseBackoffMs + jitter;
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
  throw new Error(`Failed to fetch ${url} after ${maxRetries} attempts`);
}

// Throttle function to limit execution frequency (e.g. video time update events)
export function throttle<T extends (...args: any[]) => any>(
  fn: T,
  waitMs: number
): (...args: Parameters<T>) => void {
  let lastCallTime = 0;
  let timeoutId: ReturnType<typeof setTimeout> | null = null;

  return function (...args: Parameters<T>) {
    const now = Date.now();
    const timeRemaining = waitMs - (now - lastCallTime);

    if (timeRemaining <= 0 || timeRemaining > waitMs) {
      if (timeoutId) {
        clearTimeout(timeoutId);
        timeoutId = null;
      }
      lastCallTime = now;
      fn(...args);
    } else if (!timeoutId) {
      timeoutId = setTimeout(() => {
        lastCallTime = Date.now();
        timeoutId = null;
        fn(...args);
      }, timeRemaining);
    }
  };
}

// Debounce function to delay execution until user stops typing
export function debounce<T extends (...args: any[]) => any>(
  fn: T,
  delayMs: number
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;

  return function (...args: Parameters<T>) {
    if (timeoutId) clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      fn(...args);
    }, delayMs);
  };
}

// Enterprise Corporate Email Domain Validation
export function validateCorporateEmail(email: string): { valid: boolean; reason?: string } {
  if (!email || !email.includes('@')) {
    return { valid: false, reason: 'Please enter a valid email address.' };
  }

  const parts = email.toLowerCase().trim().split('@');
  if (parts.length !== 2) return { valid: false, reason: 'Invalid email format.' };

  const domain = parts[1];
  const invalidFreeDomains = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'aol.com', 'mail.com', 'protonmail.com'];
  
  if (invalidFreeDomains.includes(domain)) {
    return { valid: false, reason: 'Please use your official corporate or institutional work email (e.g. name@company.com).' };
  }

  return { valid: true };
}

// Rate Limiter Class for OTP and Login Protection
export class RateLimiter {
  private attempts: Map<string, { count: number; firstAttemptTime: number; lockUntil?: number }> = new Map();

  checkLimit(key: string, maxAttempts = 3, windowMs = 10 * 60 * 1000): { allowed: boolean; waitSeconds?: number } {
    const now = Date.now();
    const record = this.attempts.get(key);

    if (!record) {
      this.attempts.set(key, { count: 1, firstAttemptTime: now });
      return { allowed: true };
    }

    if (record.lockUntil && record.lockUntil > now) {
      const waitSeconds = Math.ceil((record.lockUntil - now) / 1000);
      return { allowed: false, waitSeconds };
    }

    if (now - record.firstAttemptTime > windowMs) {
      // Reset window
      this.attempts.set(key, { count: 1, firstAttemptTime: now });
      return { allowed: true };
    }

    record.count++;
    if (record.count > maxAttempts) {
      record.lockUntil = now + windowMs;
      const waitSeconds = Math.ceil(windowMs / 1000);
      return { allowed: false, waitSeconds };
    }

    return { allowed: true };
  }

  reset(key: string) {
    this.attempts.delete(key);
  }
}

export const globalRateLimiter = new RateLimiter();
