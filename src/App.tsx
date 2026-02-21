import React, { useCallback, useState, useMemo } from 'react';
import {
  ReactFlow,
  useEdgesState,
  useNodesState,
  type Edge,
  type Node,
  type NodeProps,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

// Components
import { Navbar } from './components/Navbar';
import { HelpPanel } from './components/HelpPanel';
import { FlowContent } from './components/FlowContent';

// Node components
import { PersonNode, UnitNode, ProjectGroupNode } from './org/nodes';

// Types
import type { OrgNodeData } from './org/types';

// Custom hooks
import { useFileUpload } from './hooks/useFileUpload';
import { useCollapseState } from './hooks/useCollapseState';
import { useNodeFiltering } from './hooks/useNodeFiltering';

/**
 * Main App component
 * Follows Single Responsibility - orchestrates services and components
 * Acts as a container/coordinator for the application
 */
export default function App() {
  // UI State
  const [uploadedFilename, setUploadedFilename] = useState<string | null>(null);
  const [showHelp, setShowHelp] = useState(false);

  // Graph State
  const [nodes, setNodes, onNodesChange] = useNodesState<Node<OrgNodeData>>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);

  // Collapse State
  const { collapsedNodes, toggleCollapsed } = useCollapseState();

  // Filtered nodes and edges based on collapse state
  const { filteredNodes, filteredEdges } = useNodeFiltering(nodes, edges, collapsedNodes);

  // File upload handler
  const { handleFileUpload } = useFileUpload((nodes, edges) => {
    setNodes(nodes);
    setEdges(edges);
  });

  // Handle file input
  const onFileInput = useCallback(
    async (ev: React.ChangeEvent<HTMLInputElement>) => {
      const file = ev.target.files?.[0];
      if (!file) return;

      try {
        setUploadedFilename(file.name);
        await handleFileUpload(file);
      } catch (error) {
        console.error('Failed to load file:', error);
        setUploadedFilename(null);
      }

      // Reset input so selecting the same file triggers onChange
      ev.target.value = '';
    },
    [handleFileUpload]
  );

  // Minimap node coloring
  const minimapNodeColor = useCallback((n: Node<OrgNodeData>) => {
    return n.data?.kind === 'unit' ? '#0b5cab' : '#6e7781';
  }, []);

  // Node types with collapse support
  const nodeTypes = useMemo(
    () => ({
      unitNode: (props: NodeProps) => (
        <UnitNode {...props} collapsed={collapsedNodes} onToggleCollapse={toggleCollapsed} />
      ),
      personNode: PersonNode,
      projectGroupNode: ProjectGroupNode,
    }),
    [collapsedNodes, toggleCollapsed]
  );

  const hasGraph = nodes.length > 0;

  return (
    <div className="app">
      <Navbar
        uploadedFilename={uploadedFilename}
        onHelpClick={() => setShowHelp(!showHelp)}
        onFileSelect={onFileInput}
      />

      <HelpPanel isOpen={showHelp} onClose={() => setShowHelp(false)} />

      <div className="canvas">
        <ReactFlow<Node<OrgNodeData>, Edge>
          nodes={filteredNodes}
          edges={filteredEdges}
          nodeTypes={nodeTypes}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
        >
          <FlowContent
            nodes={filteredNodes}
            hasGraph={hasGraph}
            minimapNodeColor={minimapNodeColor}
          />
        </ReactFlow>
      </div>
    </div>
  );
}
