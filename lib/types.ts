export interface TimetableEntry {
  courseId: string;
  classroom: string;
  classType: string;
}

export interface Course {
  courseId: string;
  courseName: string;
}

export type TimetableBySlot = TimetableEntry[];
export type TimetableDay = Record<string, TimetableBySlot>;
export type TimetableData = Record<string, TimetableDay>;

// Props interfaces removed - components now use Zustand store directly

export interface DownloadOptions {
  format: 'jpeg' | 'png' | 'ics';
  quality?: number;
  pixelRatio?: number;
}