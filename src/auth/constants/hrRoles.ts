/**
 * HR-specific professional roles for registration.
 * Centralized here so both main and LMS sign-up pages share the same list.
 * Easy to add, remove, or reorder roles in the future.
 */
export const HR_ROLES = [
  'HR Manager',
  'Talent Acquisition / Recruitment',
  'HR Consultant / HR Analyst',
  'HR Business Partner (HRBP) / People Partner / HR Generalist',
  'HR Transformation Specialist',
  'HR Executive Leadership',
] as const;

export type HrRole = (typeof HR_ROLES)[number];
