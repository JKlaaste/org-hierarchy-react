/**
 * Animation configuration
 * Follows Single Responsibility - centralized animation constants
 */
export const ANIMATION_CONFIG = {
  // Cascade animation delays (in milliseconds)
  ORG_UNIT_DELAY_MULTIPLIER: 600, // depth * 600ms
  PROJECT_GROUP_DELAY: 3600,
  PERSON_DELAY: 3700,
  
  // Animation duration
  DURATION: 0.6, // seconds
  EASING: 'ease-out',
  
  // Viewport centering
  VIEWPORT_CENTERING_DELAY: 100, // ms before fitView
  VIEWPORT_PADDING: 0.5,
  VIEWPORT_ANIMATION_DURATION: 800, // ms
} as const;
