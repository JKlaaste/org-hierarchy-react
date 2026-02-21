import type { Node, Edge } from '@xyflow/react';
import type { OrgNodeData } from '../org/types';

/**
 * Service for managing collapse/expand state
 * Follows Single Responsibility Principle - only handles visibility logic
 */
export class NodeFilteringService {
  filterNodes(nodes: Node<OrgNodeData>[], collapsedNodes: Set<string>): Node<OrgNodeData>[] {
    return nodes.filter((n) => {
      // Always show unit nodes
      if (n.data?.kind === 'unit') return true;
      
      // For person nodes, hide if their parent unit is collapsed
      if (n.data?.kind === 'person') {
        const parentOrgUnitId = n.data.parentOrgUnitId;
        return !parentOrgUnitId || !collapsedNodes.has(parentOrgUnitId);
      }

      // For project group nodes, hide if parent unit is collapsed
      if (n.data?.kind === 'projectGroup') {
        const lastColonIndex = n.id.lastIndexOf(':');
        if (lastColonIndex > 0) {
          const parentUnitId = n.id.substring(0, lastColonIndex).substring('projectGroup:'.length);
          return !collapsedNodes.has(parentUnitId);
        }
        return true;
      }
      
      return true;
    });
  }

  filterEdges(edges: Edge[], collapsedNodes: Set<string>): Edge[] {
    return edges.filter((e) => !collapsedNodes.has(e.source));
  }

  getEdgeAnimationDelay(sourceNode: Node<OrgNodeData> | undefined): string {
    if (!sourceNode?.data) return '3600ms';

    const sourceKind = sourceNode.data.kind;
    const sourceDepth = sourceNode.data.kind === 'unit' ? sourceNode.data.depth : 0;

    if (sourceKind === 'unit') {
      return `${sourceDepth * 600}ms`;
    }
    return '3600ms';
  }

  toggleCollapsed(nodeId: string, collapsedNodes: Set<string>): Set<string> {
    const next = new Set(collapsedNodes);
    if (next.has(nodeId)) {
      next.delete(nodeId);
    } else {
      next.add(nodeId);
    }
    return next;
  }
}

// Export singleton instance
export const nodeFilteringService = new NodeFilteringService();
