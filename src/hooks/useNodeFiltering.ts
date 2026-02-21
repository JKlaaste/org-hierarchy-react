import { useMemo } from 'react';
import type { Node, Edge } from '@xyflow/react';
import { nodeFilteringService } from '../services/NodeFilteringService';
import type { OrgNodeData } from '../org/types';

/**
 * Custom hook for filtering nodes and edges based on collapse state
 * Separates filtering logic from components
 */
export function useNodeFiltering(
  nodes: Node<OrgNodeData>[],
  edges: Edge[],
  collapsedNodes: Set<string>
) {
  const filteredNodes = useMemo(
    () => nodeFilteringService.filterNodes(nodes, collapsedNodes),
    [nodes, collapsedNodes]
  );

  const filteredEdges = useMemo(
    () => {
      const filtered = nodeFilteringService.filterEdges(edges, collapsedNodes);
      return filtered.map((e) => {
        const sourceNode = nodes.find((n) => n.id === e.source);
        const animationDelay = nodeFilteringService.getEdgeAnimationDelay(sourceNode);

        return {
          ...e,
          style: {
            ...e.style,
            strokeOpacity: 0,
            animation: `cascadeInStroke 0.6s ease-out ${animationDelay} forwards`,
          },
        };
      });
    },
    [edges, nodes, collapsedNodes]
  );

  return { filteredNodes, filteredEdges };
}
