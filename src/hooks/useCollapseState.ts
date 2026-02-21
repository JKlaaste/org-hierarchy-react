import { useCallback, useState } from 'react';
import { nodeFilteringService } from '../services/NodeFilteringService';

/**
 * Custom hook for managing collapse state
 * Encapsulates the collapse/expand toggle logic
 */
export function useCollapseState() {
  const [collapsedNodes, setCollapsedNodes] = useState<Set<string>>(new Set());

  const toggleCollapsed = useCallback((nodeId: string) => {
    setCollapsedNodes((prev) =>
      nodeFilteringService.toggleCollapsed(nodeId, prev)
    );
  }, []);

  return {
    collapsedNodes,
    toggleCollapsed,
  };
}
