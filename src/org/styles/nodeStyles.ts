import type React from 'react';

/**
 * Centralized node styling
 * Follows Single Responsibility - only concerns are styling definitions
 */
export const nodeStyles: Record<string, React.CSSProperties> = {
  unitWrap: {
    width: 280,
    borderRadius: 12,
    border: '1px solid #d0d7de',
    background: 'linear-gradient(180deg, #0b5cab 0%, #0a4a86 100%)',
    color: '#fff',
    padding: '12px 14px',
    boxShadow: '0 6px 18px rgba(0,0,0,0.12)',
    fontFamily: 'system-ui, Segoe UI, Roboto, Arial',
  },
  unitHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 8,
  },
  unitTitle: {
    fontSize: 14,
    fontWeight: 700,
    lineHeight: 1.2,
    flex: 1,
  },
  collapseBtn: {
    background: 'rgba(255, 255, 255, 0.2)',
    border: 'none',
    color: '#fff',
    cursor: 'pointer',
    padding: '4px 6px',
    borderRadius: 4,
    fontSize: 12,
    fontWeight: 700,
    minWidth: 24,
  },
  unitMeta: {
    fontSize: 12,
    opacity: 0.9,
    marginTop: 6,
  },

  personWrap: {
    width: 280,
    borderRadius: 12,
    border: '1px solid #d0d7de',
    color: '#111',
    padding: '12px 14px',
    boxShadow: '0 6px 18px rgba(0,0,0,0.08)',
    fontFamily: 'system-ui, Segoe UI, Roboto, Arial',
  },
  personName: {
    fontSize: 14,
    fontWeight: 700,
    lineHeight: 1.2,
    color: '#1a1a1a',
  },
  personMeta: {
    fontSize: 12,
    color: '#333',
    marginTop: 6,
  },

  projectGroupWrap: {
    position: 'absolute' as const,
    width: '100%',
    height: '100%',
    borderRadius: 12,
    border: '2px dotted',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    padding: '10px',
  },
  projectGroupLabel: {
    fontSize: 13,
    fontWeight: 600,
    padding: '6px 10px',
    borderRadius: 6,
    background: 'white',
    border: '1px solid #d0d7de',
    whiteSpace: 'nowrap',
    fontFamily: 'system-ui, -apple-system, Segoe UI, Roboto, sans-serif',
    color: '#1a1a1a',
    boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
  },
};
