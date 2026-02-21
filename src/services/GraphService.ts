import type { Edge, Node } from '@xyflow/react';
import { buildOrgGraph } from '../org/buildGraph';
import { layoutWithDagre } from '../org/layout';
import type { OrgRow, OrgNodeData } from '../org/types';

/**
 * Service for graph operations (building and layout)
 * Follows Single Responsibility Principle - only handles graph logic
 */
export class GraphService {
  buildAndLayoutGraph(rows: OrgRow[]) {
    const { nodes, edges } = buildOrgGraph(rows);
    const { nodes: layoutNodes, edges: layoutEdges } = layoutWithDagre(
      nodes as any,
      edges as any,
      'TB'
    );
    return { nodes: layoutNodes as Node<OrgNodeData>[], edges: layoutEdges as Edge[] };
  }
}

// Export singleton instance
export const graphService = new GraphService();
