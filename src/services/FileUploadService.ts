import * as XLSX from 'xlsx';
import { normalizeRows } from '../org/buildGraph';
import type { OrgRow } from '../org/types';

/**
 * Service responsible for handling file upload and parsing
 * Follows Single Responsibility Principle - only handles file operations
 */
export class FileUploadService {
  async uploadExcelFile(file: File): Promise<OrgRow[]> {
    const buf = await file.arrayBuffer();
    const wb = XLSX.read(buf, { type: 'array' });
    const sheetName = wb.SheetNames[0];
    const ws = wb.Sheets[sheetName];

    const json = XLSX.utils.sheet_to_json(ws, { defval: '' }) as Record<string, any>[];
    return normalizeRows(json);
  }
}

// Export singleton instance
export const fileUploadService = new FileUploadService();
