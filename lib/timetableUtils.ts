import { TimetableData, TimetableEntry } from './types';

/**
 * Filters timetable entries based on selected courses
 * @param data - The complete timetable data
 * @param selected - Array of selected course IDs
 * @param day - Day of the week
 * @param slot - Time slot
 * @returns Filtered timetable entries
 */
export const getFilteredEntries = (
  data: TimetableData,
  selected: string[],
  day: string,
  slot: string
): TimetableEntry[] => {
  const entries = data[day]?.[slot] || [];
  if (selected.length === 0) return entries;
  return entries.filter((entry) => selected.includes(entry.courseId));
};

/**
 * Formats time slot display text
 * @param slot - Time slot string (e.g., "9:00-9:30")
 * @returns Formatted display string (just the start time)
 */
export const formatTimeSlot = (slot: string): string => {
  const [start] = slot.split('-');
  const formattedStart = start.endsWith(':00') ? start.split(':')[0] : start;
  return formattedStart;
};

/**
 * Calculates column span for consecutive identical entries
 * @param data - The complete timetable data
 * @param selected - Array of selected course IDs
 * @param day - Day of the week
 * @param timeSlots - Array of all time slots
 * @param startIndex - Starting index in timeSlots array
 * @returns Object with colSpan and the next index to process
 */
export const calculateColSpan = (
  data: TimetableData,
  selected: string[],
  day: string,
  timeSlots: string[],
  startIndex: number
): { colSpan: number; nextIndex: number } => {
  const currentSlot = timeSlots[startIndex];
  const currentEntries = getFilteredEntries(data, selected, day, currentSlot);
  
  let colSpan = 1;
  
  if (currentEntries.length === 1) {
    const currentCourse = currentEntries[0];
    for (let j = startIndex + 1; j < timeSlots.length; j++) {
      const nextSlotEntries = getFilteredEntries(data, selected, day, timeSlots[j]);
      if (
        nextSlotEntries.length === 1 &&
        nextSlotEntries[0].courseId === currentCourse.courseId &&
        nextSlotEntries[0].classroom === currentCourse.classroom &&
        nextSlotEntries[0].classType === currentCourse.classType
      ) {
        colSpan++;
      } else {
        break;
      }
    }
  } else if (currentEntries.length === 0) {
    for (let j = startIndex + 1; j < timeSlots.length; j++) {
      const nextSlotEntries = getFilteredEntries(data, selected, day, timeSlots[j]);
      if (nextSlotEntries.length === 0) {
        colSpan++;
      } else {
        break;
      }
    }
  }
  
  return { colSpan, nextIndex: startIndex + colSpan };
};

/**
 * Gets the next Monday date (start of upcoming week)
 * @returns Date object for next Monday
 */
export const getNextMonday = (): Date => {
  const now = new Date();
  const offsetToMonday = (1 - now.getDay() + 7) % 7;
  const monday = new Date(now);
  monday.setHours(0, 0, 0, 0);
  monday.setDate(now.getDate() + offsetToMonday);
  return monday;
};

/**
 * Formats date to YYYYMMDDTHHMMSS format for iCalendar
 * @param date - Date to format
 * @returns Formatted date string
 */
export const formatICalDateTime = (date: Date): string => {
  const pad = (n: number) => n.toString().padStart(2, '0');
  const hours = date.getHours();
  const adjustedHours = hours < 8 ? hours + 12 : hours;
  
  return `${date.getFullYear()}${pad(date.getMonth() + 1)}${pad(date.getDate())}T${pad(adjustedHours)}${pad(date.getMinutes())}00`;
};