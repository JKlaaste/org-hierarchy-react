export type RowRecord = Record<string, any>;

export type OrgRow = {
  employeeName: string;
  employeeEmail?: string;
  level?: string;
  orgUnits: string[]; // Org Unit 1..5 (non-empty)
  projectAssignments?: string;
};

export type NodeKind = 'unit' | 'person' | 'projectGroup';

export type UnitNodeData = { kind: 'unit'; label: string; depth: number };
export type PersonNodeData = {
  kind: 'person';
  name: string;
  email?: string;
  level?: string;
  project?: string;
  projectColor?: string;
  parentOrgUnitId?: string;
};
export type ProjectGroupNodeData = {
  kind: 'projectGroup';
  label: string;
  color: string;
};

export type OrgNodeData = UnitNodeData | PersonNodeData | ProjectGroupNodeData;
