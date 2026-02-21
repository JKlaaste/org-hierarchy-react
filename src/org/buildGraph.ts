import type { Edge, Node } from '@xyflow/react';
import type { OrgNodeData, OrgRow, RowRecord } from './types';
import { decode } from 'he';
import { getProjectColor } from './settings';

const norm = (s: string) => s.trim().toLowerCase();

function getAny(row: RowRecord, keys: string[]) {
  const map = new Map<string, string>();
  Object.keys(row).forEach((k) => map.set(norm(k), k));
  for (const key of keys) {
    const found = map.get(norm(key));
    if (found != null) return row[found];
  }
  return undefined;
}

export function normalizeRows(raw: RowRecord[]): OrgRow[] {
  return raw
    .map((r) => {
      const employeeName = String(
        getAny(r, ['Employee Name', 'Name', 'Employee']) ?? '',
      ).trim();

      if (!employeeName) return null;

      const employeeEmail = String(
        getAny(r, ['Employee Email', 'Email']) ?? '',
      ).trim();

      const level = String(getAny(r, ['Level']) ?? '').trim();

      const projectAssignments = String(
        getAny(r, ['Project Assignments', 'Project', 'Projects']) ?? '',
      ).trim();

      const orgUnits: string[] = [];
      for (let i = 1; i <= 5; i++) {
        const v = getAny(r, [`Org Unit ${i}`, `OrgUnit${i}`]);
        const s = String(v ?? '').trim();
        if (s) orgUnits.push(decode(s)); // decode &amp; etc.
      }

      return {
        employeeName: decode(employeeName),
        employeeEmail: employeeEmail || undefined,
        level: level || undefined,
        orgUnits,
        projectAssignments: projectAssignments || undefined,
      } satisfies OrgRow;
    })
    .filter(Boolean) as OrgRow[];
}

export function buildOrgGraph(rows: OrgRow[]) {
  const nodes: Node<OrgNodeData>[] = [];
  const edges: Edge[] = [];

  const nodeIds = new Set<string>();
  const edgeIds = new Set<string>();

  const addNode = (id: string, data: OrgNodeData, style?: any) => {
    if (nodeIds.has(id)) return;
    nodeIds.add(id);
    nodes.push({
      id,
      type: data.kind === 'unit' ? 'unitNode' : data.kind === 'person' ? 'personNode' : 'projectGroupNode',
      data,
      position: { x: 0, y: 0 }, // layout later
      draggable: false,
      selectable: true,
      style,
    });
  };

  const addEdge = (source: string, target: string) => {
    const id = `e:${source}->${target}`;
    if (edgeIds.has(id)) return;
    edgeIds.add(id);
    edges.push({
      id,
      source,
      target,
      sourceHandle: 'source',
      targetHandle: 'target',
      type: 'smoothstep',
      animated: false,
      style: {
        stroke: '#d0d7de',
        strokeWidth: 2,
      },
    });
  };

  // Root bucket for multi-root datasets
  const ROOT_ID = 'root:ORG';
  addNode(ROOT_ID, { kind: 'unit', label: 'Organization', depth: 0 }, { width: 280 });

  // Track projects per org unit for creating visual group nodes
  const projectGroupsByOrgUnit = new Map<string, Set<string>>();
  const projectGroupIds = new Map<string, string>(); // "orgUnitId:project" -> projectGroupNodeId
  const projectPeopleCounts = new Map<string, number>(); // "orgUnitId:project" -> count

  for (const r of rows) {
    let parentId = ROOT_ID;

    // Build / dedupe org unit chain
    r.orgUnits.forEach((unit, idx) => {
      const id = `unit:${r.orgUnits.slice(0, idx + 1).join(' / ')}`;
      addNode(id, { kind: 'unit', label: unit, depth: idx + 1 }, { width: 280 });
      addEdge(parentId, id);
      parentId = id;
    });

    // Track project for this org unit
    const project = r.projectAssignments || 'Unassigned';
    if (!projectGroupsByOrgUnit.has(parentId)) {
      projectGroupsByOrgUnit.set(parentId, new Set());
    }
    projectGroupsByOrgUnit.get(parentId)!.add(project);

    // Count people per project
    const projectKey = `${parentId}:${project}`;
    projectPeopleCounts.set(projectKey, (projectPeopleCounts.get(projectKey) ?? 0) + 1);
  }

  // Create visual project group nodes and edges from org units to project groups
  projectGroupsByOrgUnit.forEach((projects, orgUnitId) => {
    let projectIndex = 0;
    projects.forEach((project) => {
      const projectGroupId = `projectGroup:${orgUnitId}:${project}`;
      const projectKey = `${orgUnitId}:${project}`;
      projectGroupIds.set(projectKey, projectGroupId);
      const color = getProjectColor(project, projectIndex);
      const peopleCount = projectPeopleCounts.get(projectKey) ?? 0;
      addNode(projectGroupId, {
        kind: 'projectGroup',
        label: `${project} - ${peopleCount} ${peopleCount === 1 ? 'person' : 'people'}`,
        color: color,
      });
      // Create edge from org unit to project group
      addEdge(orgUnitId, projectGroupId);
      projectIndex++;
    });
  });

  // Add person nodes (no edges to people - they belong to project groups)
  for (const r of rows) {
    let parentId = ROOT_ID;

    // Build / dedupe org unit chain
    r.orgUnits.forEach((unit, idx) => {
      const id = `unit:${r.orgUnits.slice(0, idx + 1).join(' / ')}`;
      parentId = id;
    });

    // Person leaf node (unique by email if present, else name + org path)
    const personKey = r.employeeEmail
      ? `person:${r.employeeEmail}`
      : `person:${r.employeeName}|${parentId}`;

    const project = r.projectAssignments || 'Unassigned';
    const projectColor = getProjectColor(project, Array.from(projectGroupsByOrgUnit.get(parentId) || []).indexOf(project));

    addNode(personKey, {
      kind: 'person',
      name: r.employeeName,
      email: r.employeeEmail,
      level: r.level,
      project: r.projectAssignments,
      projectColor: projectColor,
      parentOrgUnitId: parentId,
    });
  }

  return { nodes, edges };
}
