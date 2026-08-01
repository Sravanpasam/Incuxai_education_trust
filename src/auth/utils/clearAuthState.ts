/**
 * Centralized auth state cleanup.
 *
 * Logout must clear every authentication artifact across BOTH auth contexts
 * (main site + LMS) so that signing out from any button fully logs the user out
 * of the entire application. Clearing sessionStorage is defensive — no auth
 * keys are stored there today, but doing so keeps the cleanup future-proof.
 */
const AUTH_STORAGE_KEYS = [
  'incuxai_auth_token',
  'incuxai_auth_user',
  'incuxai_user_premium',
  'lms_auth_token',
  'lms_auth_user',
  'lms_user_premium',
  'corp_otp_verified',
  'pending_corp_registration',
  'pending_auth_email',
];

/**
 * Remove every auth token / user / premium / pending-registration key from
 * both localStorage and sessionStorage.
 *
 * @returns {boolean} true if all removals succeeded, false if storage was
 *                    unavailable or threw (e.g. blocked in private mode).
 */
export function clearAuthStorage(): boolean {
  try {
    for (const key of AUTH_STORAGE_KEYS) {
      localStorage.removeItem(key);
      sessionStorage.removeItem(key);
    }
    return true;
  } catch (err) {
    console.error('[Auth] Failed to clear auth storage:', err);
    return false;
  }
}
