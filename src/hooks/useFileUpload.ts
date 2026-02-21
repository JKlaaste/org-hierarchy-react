import { useCallback } from 'react';
import { fileUploadService } from '../services/FileUploadService';
import { graphService } from '../services/GraphService';
import type { Node, Edge } from '@xyflow/react';
import type { OrgNodeData } from '../org/types';

/**
 * Custom hook for file upload operations
 * Extracts file upload logic from components
 */
export function useFileUpload(
  onGraphReady: (nodes: Node<OrgNodeData>[], edges: Edge[]) => void
) {
  const handleFileUpload = useCallback(
    async (file: File) => {
      try {
        const rows = await fileUploadService.uploadExcelFile(file);
        const { nodes, edges } = graphService.buildAndLayoutGraph(rows);
        onGraphReady(nodes, edges);
      } catch (error) {
        console.error('Failed to upload file:', error);
        throw error;
      }
    },
    [onGraphReady]
  );

  return { handleFileUpload };
}
