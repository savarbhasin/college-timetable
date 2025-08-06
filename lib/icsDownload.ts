import { RefObject } from 'react';
import { TimetableEntry, TimetableData } from './types';
import { DAYS, DOWNLOAD_CONFIG } from './constants';
import { getFilteredEntries, getNextMonday, formatICalDateTime } from './timetableUtils';

/**
 * Downloads the timetable as an iCalendar (.ics) file
 * @param timetableRef - React ref to the timetable container
 * @param timeSlots - Array of time slots
 * @param data - Complete timetable data
 * @param selected - Array of selected course IDs
 */
export const downloadAsICS = (
  timetableRef: RefObject<HTMLDivElement>,
  timeSlots: string[],
  data: TimetableData,
  selected: string[]
) => {
    if (!timetableRef.current) return;

    const monday = getNextMonday();

    let icsLines: string[] = [
      'BEGIN:VCALENDAR',
      `VERSION:${DOWNLOAD_CONFIG.ics.version}`,
      `PRODID:${DOWNLOAD_CONFIG.ics.prodId}`,
    ];

    DAYS.forEach((day, dayIndex) => {
      const dayDate = new Date(monday);
      dayDate.setDate(monday.getDate() + dayIndex);

      let i = 0;
      while (i < timeSlots.length) {
        const slot = timeSlots[i];
        const entries = getFilteredEntries(data, selected, day, slot);

        if (entries.length === 1) {
          // Try to merge consecutive identical entries
          const entry = entries[0];
          let j = i + 1;
          while (j < timeSlots.length) {
            const nextEntries = getFilteredEntries(data, selected, day, timeSlots[j]);
            if (
              nextEntries.length === 1 &&
              nextEntries[0].courseId === entry.courseId &&
              nextEntries[0].classroom === entry.classroom &&
              nextEntries[0].classType === entry.classType
            ) {
              j++;
            } else {
              break;
            }
          }

          // slot i is start, slot j-1 is end
          const [startStr] = timeSlots[i].split('-');
          const [, endStr] = timeSlots[j - 1].split('-');

          const [startH, startM] = startStr.split(':').map(Number);
          const [endH, endM] = endStr.split(':').map(Number);

          const startDate = new Date(dayDate);
          startDate.setHours(startH, startM, 0, 0);

          const endDate = new Date(dayDate);
          endDate.setHours(endH, endM, 0, 0);

          const uid = `${entry.courseId}-${day}-${startStr}-${endStr}`;

          icsLines.push(
            'BEGIN:VEVENT',
            `UID:${uid}@college-timetable`,
            `SUMMARY:${entry.courseId}`,
            `DTSTART:${formatICalDateTime(startDate)}`,
            `DTEND:${formatICalDateTime(endDate)}`,
            `LOCATION:${entry.classroom}`,
            `DESCRIPTION:${entry.classType}`,
            'RRULE:FREQ=WEEKLY',
            'END:VEVENT'
          );

          i = j; // Skip processed slots
        } else {
          // Zero or multiple entries – create separate events per entry for this slot
          entries.forEach((entry) => {
            const [startStr, endStr] = slot.split('-');
            const [startH, startM] = startStr.split(':').map(Number);
            const [endH, endM] = endStr.split(':').map(Number);

            const startDate = new Date(dayDate);
            startDate.setHours(startH, startM, 0, 0);
            const endDate = new Date(dayDate);
            endDate.setHours(endH, endM, 0, 0);

            const uid = `${entry.courseId}-${day}-${slot}`;

            icsLines.push(
              'BEGIN:VEVENT',
              `UID:${uid}@college-timetable`,
              `SUMMARY:${entry.courseId}`,
              `DTSTART:${formatICalDateTime(startDate)}`,
              `DTEND:${formatICalDateTime(endDate)}`,
              `LOCATION:${entry.classroom}`,
              `DESCRIPTION:${entry.classType}`,
              'RRULE:FREQ=WEEKLY',
              'END:VEVENT'
            );
          });
          i++;
        }
      }
    });

    icsLines.push('END:VCALENDAR');

    const blob = new Blob([icsLines.join('\r\n')], { type: 'text/calendar' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = `timetable-${new Date().toISOString().split('T')[0]}.ics`;
    link.click();

    URL.revokeObjectURL(url);
  };