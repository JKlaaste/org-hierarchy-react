import type { PersonNodeData, ProjectGroupNodeData, UnitNodeData } from '../types';

/**
 * Type guard utilities
 * Provides type-safe checking for different node types
 * Follows Interface Segregation - exports only what's needed
 */
export function isUnitNode(data: unknown): data is UnitNodeData {
  return (
    typeof data === 'object' &&
    data !== null &&
    'kind' in data &&
    (data as any).kind === 'unit'
  );
}

export function isPersonNode(data: unknown): data is PersonNodeData {
  return (
    typeof data === 'object' &&
    data !== null &&
    'kind' in data &&
    (data as any).kind === 'person'
  );
}

export function isProjectGroupNode(data: unknown): data is ProjectGroupNodeData {
  return (
    typeof data === 'object' &&
    data !== null &&
    'kind' in data &&
    (data as any).kind === 'projectGroup'
  );
}
