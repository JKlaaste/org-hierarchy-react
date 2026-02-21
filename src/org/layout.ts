import dagre from '@dagrejs/dagre';
import type { Edge, Node } from '@xyflow/react';
import type { OrgNodeData } from './types';
import { getProjectColor, NODE_DIMENSIONS, LAYOUT_SPACING, DAGRE_CONFIG } from './settings';

const dagreGraph = new dagre.graphlib.Graph().setDefaultEdgeLabel(() => ({}));

export type Direction = 'TB' | 'LR';

export function layoutWithDagre(
  nodes: Node<OrgNodeData>[],
  edges: Edge[],
  direction: Direction = 'TB',
) {
  const isHorizontal = direction === 'LR';
  dagreGraph.setGraph({
    rankdir: direction,
    ...DAGRE_CONFIG,
  });

  // Only add unit and person nodes to Dagre (not project groups)
  nodes.forEach((n) => {
    if (n.data.kind !== 'projectGroup') {
      const isUnit = n.data.kind === 'unit';
      const width = isUnit ? NODE_DIMENSIONS.UNIT_W : NODE_DIMENSIONS.PERSON_W;
      const height = isUnit ? NODE_DIMENSIONS.UNIT_H : NODE_DIMENSIONS.PERSON_H;
      dagreGraph.setNode(n.id, { width, height });
    }
  });

  // Only add edges between units and people (skip project group edges)
  edges.forEach((e) => {
    const sourceNode = nodes.find((n) => n.id === e.source);
    const targetNode = nodes.find((n) => n.id === e.target);
    if (sourceNode?.data.kind !== 'projectGroup' && targetNode?.data.kind !== 'projectGroup') {
      dagreGraph.setEdge(e.source, e.target);
    }
  });

  dagre.layout(dagreGraph);

  const layouted = nodes.map((n) => {
    // Skip layout for project group nodes (they'll be positioned later)
    if (n.data.kind === 'projectGroup') {
      return n;
    }

    const nodeWithPos = dagreGraph.node(n.id);
    const isUnit = n.data.kind === 'unit';
    const width = isUnit ? NODE_DIMENSIONS.UNIT_W : NODE_DIMENSIONS.PERSON_W;
    const height = isUnit ? NODE_DIMENSIONS.UNIT_H : NODE_DIMENSIONS.PERSON_H;

    return {
      ...n,
      targetPosition: isHorizontal ? 'left' : 'top',
      sourcePosition: isHorizontal ? 'right' : 'bottom',
      // Shift from dagre center anchor to top-left for React Flow
      position: {
        x: nodeWithPos.x - width / 2,
        y: nodeWithPos.y - height / 2,
      },
    };
  });

  // Post-process to stack people vertically under their parent org unit, grouped by project
  const nodeMap = new Map(layouted.map((n) => [n.id, n]));
  
  const { INTER_PROJECT_SPACING, PROJECT_TOP_PADDING, PROJECT_SIDE_PADDING, INITIAL_Y_OFFSET } = LAYOUT_SPACING;
  
  // Map each org unit to its projects and people (from person node data)
  const orgUnitProjects = new Map<string, Map<string, string[]>>();

  nodes.forEach((n) => {
    if (n.data?.kind === 'person' && n.data.parentOrgUnitId) {
      const project = n.data.project || 'Unassigned';
      const parentOrgUnitId = n.data.parentOrgUnitId;

      if (!orgUnitProjects.has(parentOrgUnitId)) {
        orgUnitProjects.set(parentOrgUnitId, new Map());
      }

      const projectMap = orgUnitProjects.get(parentOrgUnitId)!;
      if (!projectMap.has(project)) {
        projectMap.set(project, []);
      }
      projectMap.get(project)!.push(n.id);
    }
  });

  // Position people by project groups (arranged horizontally)
  orgUnitProjects.forEach((projectMap, orgUnitId) => {
    const orgUnitNode = nodeMap.get(orgUnitId);
    if (!orgUnitNode) return;

    let cumulativeX = orgUnitNode.position.x + NODE_DIMENSIONS.UNIT_W + 150;
    const baseY = orgUnitNode.position.y + NODE_DIMENSIONS.UNIT_H + INITIAL_Y_OFFSET + PROJECT_TOP_PADDING;

    projectMap.forEach((peopleIds, project) => {
      const projectColor = getProjectColor(project, Array.from(projectMap.keys()).indexOf(project));

      let projectMinX = Infinity;
      let projectMaxX = -Infinity;
      let projectMinY = Infinity;
      let projectMaxY = -Infinity;

      // Position people within this project group (vertically stacked, but in horizontal groups)
      peopleIds.forEach((personId, indexInProject) => {
        const personNode = nodeMap.get(personId);
        if (!personNode || personNode.data.kind !== 'person') return;

        // Assign project color to person
        personNode.data = {
          ...personNode.data,
          projectColor,
        };

        // Stack people vertically within the project group
        personNode.position = {
          x: cumulativeX,
          y: baseY + indexInProject * (NODE_DIMENSIONS.PERSON_H + 40),
        };

        projectMinX = Math.min(projectMinX, personNode.position.x);
        projectMaxX = Math.max(projectMaxX, personNode.position.x + NODE_DIMENSIONS.PERSON_W);
        projectMinY = Math.min(projectMinY, personNode.position.y);
        projectMaxY = Math.max(projectMaxY, personNode.position.y + NODE_DIMENSIONS.PERSON_H);
      });

      // Position project group node to encompass people
      if (projectMinX !== Infinity) {
        const projectGroupNodeId = `projectGroup:${orgUnitId}:${project}`;
        const projectGroupNode = nodeMap.get(projectGroupNodeId);
        if (projectGroupNode) {
          const width = projectMaxX - projectMinX + PROJECT_SIDE_PADDING * 2;
          const height = projectMaxY - projectMinY + PROJECT_SIDE_PADDING + PROJECT_TOP_PADDING;

          projectGroupNode.position = {
            x: projectMinX - PROJECT_SIDE_PADDING,
            y: projectMinY - PROJECT_TOP_PADDING,
          };
          projectGroupNode.style = {
            width,
            height,
          };
        }

        // Move to next project position horizontally
        cumulativeX += (projectMaxX - projectMinX) + PROJECT_SIDE_PADDING * 2 + INTER_PROJECT_SPACING;
      }
    });
  });

  return { nodes: layouted, edges };
}
