// Project visualization settings
export const PROJECT_COLORS = [
  '#ffc289', // Light orange
  '#95c8ff', // Light blue
  '#c48ffc', // Light purple
  '#65fcae', // Light green
  '#fa9a9a', // Light red
  '#35f883', // Light yellow
  '#a9b5ff', // Light pink
  '#7bfdfd', // Light cyan
  '#df94fe', // Light lavender
  '#f8c265', // Light peach
];

export function getProjectColor(project: string | undefined, index: number): string {
  if (!project) return '#f0f0f0'; // Gray for unassigned
  return PROJECT_COLORS[Math.abs(project.charCodeAt(0) + index) % PROJECT_COLORS.length];
}

// Node dimensions
export const NODE_DIMENSIONS = {
  UNIT_W: 280,
  UNIT_H: 64,
  PERSON_W: 280,
  PERSON_H: 80,
};

// Layout spacing settings
export const LAYOUT_SPACING = {
  INTER_PROJECT_SPACING: 60, // Spacing between project groups
  PROJECT_TOP_PADDING: 60, // Space for project label at top
  PROJECT_SIDE_PADDING: 25, // Side padding
  INITIAL_Y_OFFSET: 60, // Initial offset from parent org
};

// Dagre graph configuration
export const DAGRE_CONFIG = {
  nodesep: 60,
  ranksep: 100,
  marginx: 20,
  marginy: 20,
};

