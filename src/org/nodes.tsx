import React from 'react';
import type { NodeProps } from '@xyflow/react';
import { Handle, Position } from '@xyflow/react';
import { isUnitNode, isPersonNode, isProjectGroupNode } from './utils/typeGuards';
import { nodeStyles } from './styles/nodeStyles';
import { ANIMATION_CONFIG } from './config/animationConfig';

export function UnitNode(props: NodeProps & { collapsed?: Set<string>; onToggleCollapse?: (id: string) => void }) {
  const { data, id, collapsed, onToggleCollapse } = props;
  
  if (!isUnitNode(data)) return null;
  
  const isCollapsed = collapsed?.has(id) ?? false;
  const animationDelay = `${data.depth * ANIMATION_CONFIG.ORG_UNIT_DELAY_MULTIPLIER}ms`;
  
  return (
    <div style={{ ...nodeStyles.unitWrap, animationDelay }} className="cascade-animate">
      {data.depth !== 0 && <Handle id="target" type="target" position={Position.Top} />}
      <div style={nodeStyles.unitHeader}>
        <div style={nodeStyles.unitTitle}>{data.label}</div>
        {onToggleCollapse && (
          <button
            onClick={() => onToggleCollapse(id)}
            style={nodeStyles.collapseBtn}
            title={isCollapsed ? 'Expand' : 'Collapse'}
          >
            {isCollapsed ? '▶' : '▼'}
          </button>
        )}
      </div>
      <div style={nodeStyles.unitMeta}>Org level {data.depth}</div>
      <Handle id="source" type="source" position={Position.Bottom} />
    </div>
  );
}

export function PersonNode(props: NodeProps) {
  const { data } = props;

  if (!isPersonNode(data)) return null;

  const bgColor = data.projectColor || '#fff';
  const animationDelay = `${ANIMATION_CONFIG.PERSON_DELAY}ms`;
  
  return (
    <div style={{ ...nodeStyles.personWrap, background: bgColor, animationDelay }} className="cascade-animate">
      <div style={nodeStyles.personName}>{data.name}</div>
      <div style={nodeStyles.personMeta}>
        {data.level ? <span>{data.level}</span> : null}
        {data.email ? <span style={{ opacity: 0.8 }}> • {data.email}</span> : null}
      </div>
    </div>
  );
}

export function ProjectGroupNode(props: NodeProps) {
  const { data } = props;

  if (!isProjectGroupNode(data)) return null;

  const animationDelay = `${ANIMATION_CONFIG.PROJECT_GROUP_DELAY}ms`;
  
  return (
    <div
      style={{
        ...nodeStyles.projectGroupWrap,
        borderColor: data.color,
        backgroundColor: `${data.color}20`,
        animationDelay,
      }}
      className="cascade-animate"
    >
      <Handle id="target" type="target" position={Position.Top} />
      <div style={nodeStyles.projectGroupLabel}>{data.label}</div>
    </div>
  );
}
