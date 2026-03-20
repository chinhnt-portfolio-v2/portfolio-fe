// Re-export from new config location for backward compatibility
export {
  aboutConfig as aboutContent,
  getAvailability,
  type AboutConfig,
  type Availability,
  type AvailabilityStatus,
  type SkillWithProof,
  STATUS_COLOR,
  STATUS_KEY,
} from '@/config/about'

/** Human-readable status labels (used by existing tests) */
export const STATUS_LABEL: Record<'open' | 'selective' | 'unavailable', string> = {
  open: 'Open to Work',
  selective: 'Selectively Looking',
  unavailable: 'Not Available',
}
