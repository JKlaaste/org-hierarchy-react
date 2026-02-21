import React from 'react';

interface HelpPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * Help panel component
 * Follows Single Responsibility - only displays help content
 */
export function HelpPanel({ isOpen, onClose }: HelpPanelProps) {
  if (!isOpen) return null;

  return (
    <div className="helpPanel">
      <div className="helpContent">
        <div className="helpHeader">
          <h2>How to Use Digital Factory Chart</h2>
          <button className="closeHelp" onClick={onClose}>✕</button>
        </div>
        <div className="helpBody">
          <div className="helpSection">
            <h3>📁 Excel File Format</h3>
            <p>Your Excel file should have the following columns:</p>
            <ul>
              <li><strong>Employee Name</strong> - Name of the person</li>
              <li><strong>Email</strong> - Email address (optional)</li>
              <li><strong>Level</strong> - Job title or level (optional)</li>
              <li><strong>Project</strong> - Project assignment</li>
              <li><strong>Org Unit 1</strong> - Top-level organization</li>
              <li><strong>Org Unit 2-5</strong> - Nested organizational levels (optional)</li>
            </ul>
          </div>
          <div className="helpSection">
            <h3>🎯 Features</h3>
            <ul>
              <li><strong>Collapse/Expand</strong> - Click the ▼ button on any org unit to hide its subordinates</li>
              <li><strong>Color Coding</strong> - Each project group has a unique color for easy identification</li>
              <li><strong>Hierarchical View</strong> - Organization structure flows from top to bottom</li>
              <li><strong>Zoom & Pan</strong> - Use your mouse to zoom and navigate the chart</li>
            </ul>
          </div>
          <div className="helpSection">
            <h3>✨ Animation</h3>
            <p>The chart animates on load, revealing the hierarchy level by level for better understanding of the structure.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
