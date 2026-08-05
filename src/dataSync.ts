/**
 * Client-side data sync layer.
 *
 * The site's operational data (volunteers, registrations, tasks, teachxai, ...)
 * lives in localStorage as a fast cache, but the source of truth is the server
 * (Supabase-backed /api/sync-data). This module:
 *
 *  1. `syncFromServer()` — pulls the latest server state into localStorage on load.
 *  2. Patches `Storage.prototype.setItem` so any write to a tracked key
 *     schedules a debounced push to the server (shared across all users).
 */

export const SYNC_KEYS = [
  'events',
  'assignedTasks',
  'eventRegistrations',
  'volunteers',
  'volunteer_pass',
  'volunteer_applications',
  'teachxai_educators',
  'teachxai_approved',
  'teachxai_lessons',
  'teachxai_attendance',
  'teachxai_teachers_pass',
];

let applyingRemote = false;
let dirty = false;
let timer: number | null = null;

function track(key: string) {
  if (applyingRemote) return;
  if (!SYNC_KEYS.includes(key)) return;
  dirty = true;
  if (timer) window.clearTimeout(timer);
  timer = window.setTimeout(() => {
    push();
  }, 1500);
}

function collectSnapshot(): Record<string, any> {
  const snap: Record<string, any> = {};
  SYNC_KEYS.forEach((key) => {
    try {
      const val = localStorage.getItem(key);
      if (val !== null) {
        snap[key] = JSON.parse(val);
      }
    } catch (e) {
      // skip corrupt entries
    }
  });
  return snap;
}

async function push() {
  if (!dirty) return;
  dirty = false;
  try {
    const res = await fetch('/api/sync-data', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ collections: collectSnapshot() }),
    });
    if (!res.ok) {
      dirty = true; // retry next time
    }
  } catch (e) {
    dirty = true; // server unreachable — retry later
  }
}

/** Pull the latest server state into localStorage. Call once on app boot. */
export async function syncFromServer(): Promise<boolean> {
  try {
    const res = await fetch('/api/sync-data');
    if (!res.ok) return false;
    const data = await res.json();
    if (!data || typeof data !== 'object') return false;

    applyingRemote = true;
    try {
      SYNC_KEYS.forEach((key) => {
        if (data[key] !== undefined && data[key] !== null) {
          localStorage.setItem(key, JSON.stringify(data[key]));
        }
      });
    } finally {
      applyingRemote = false;
    }
    return true;
  } catch (e) {
    return false;
  }
}

/** Flush any pending local changes immediately (e.g. before page hide). */
export function flushSync() {
  if (dirty) push();
}

/** Enable localStorage → server tracking. */
export function patchStorageSync() {
  if ((window as any).__dataSyncPatched) return;
  (window as any).__dataSyncPatched = true;
  const orig = Storage.prototype.setItem;
  Storage.prototype.setItem = function (key: string, value: string) {
    const result = orig.call(this, key, value);
    try {
      track(key);
    } catch (e) {
      // never break storage writes
    }
    return result;
  };
}
