import React, { useEffect } from 'react';
import { Background, Controls, MiniMap, useReactFlow } from '@xyflow/react';
import { ANIMATION_CONFIG } from '../org/config/animationConfig';
import type { Node } from '@xyflow/react';
import type { OrgNodeData } from '../org/types';

interface FlowContentProps {
  nodes: Node<OrgNodeData>[];
  hasGraph: boolean;
  minimapNodeColor: (node: Node<OrgNodeData>) => string;
}

/**
 * Canvas content component
 * Handles viewport centering and UI overlays
 * Follows Single Responsibility - only manages canvas UI
 */
export function FlowContent({ nodes, hasGraph, minimapNodeColor }: FlowContentProps) {
  const { fitView } = useReactFlow();

  useEffect(() => {
    if (hasGraph && nodes.length > 0) {
      const topLevelNode = nodes.find(
        (n) => n.data?.kind === 'unit' && n.data?.depth === 0
      );

      if (topLevelNode) {
        setTimeout(() => {
          fitView({
            nodes: [topLevelNode],
            padding: ANIMATION_CONFIG.VIEWPORT_PADDING,
            duration: ANIMATION_CONFIG.VIEWPORT_ANIMATION_DURATION,
          });
        }, ANIMATION_CONFIG.VIEWPORT_CENTERING_DELAY);
      }
    }
  }, [hasGraph, nodes, fitView]);

  return (
    <>
      <Background />
      <Controls />
      <MiniMap nodeColor={minimapNodeColor} />
    </>
  );
}
