'use client';
import { useRef } from 'react';
import { Download, Image, FileText } from 'lucide-react';
import timetableData from '../merged.json';

interface TimetableEntry {
  courseId: string;
  classroom: string;
  classType: string;
}

type TimetableBySlot = TimetableEntry[];
type TimetableDay = Record<string, TimetableBySlot>;
type TimetableData = Record<string, TimetableDay>;

const data = timetableData as TimetableData;

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
const timeSlots = Object.keys(data['Monday']);

// Generate consistent colors for courses
const generateCourseColor = (courseId: string): string => {
  const colors = [
    'bg-blue-600/20 border-blue-600/50 text-blue-300',
    'bg-green-600/20 border-green-600/50 text-green-300',
    'bg-purple-600/20 border-purple-600/50 text-purple-300',
    'bg-yellow-600/20 border-yellow-600/50 text-yellow-300',
    'bg-red-600/20 border-red-600/50 text-red-300',
    'bg-indigo-600/20 border-indigo-600/50 text-indigo-300',
    'bg-pink-600/20 border-pink-600/50 text-pink-300',
    'bg-teal-600/20 border-teal-600/50 text-teal-300',
    'bg-orange-600/20 border-orange-600/50 text-orange-300',
    'bg-cyan-600/20 border-cyan-600/50 text-cyan-300',
  ];
  
  let hash = 0;
  for (let i = 0; i < courseId.length; i++) {
    hash = courseId.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
};

interface Props {
  selected: string[];
}

export default function Timetable({ selected }: Props) {
  const timetableRef = useRef<HTMLDivElement>(null);

  // Download timetable as JPEG at full, natural width regardless of viewport size
  const downloadAsImage = async () => {
    if (!timetableRef.current) return;

    const tableElement = timetableRef.current.querySelector('table');
    if (!tableElement) return;

    try {
      // @ts-ignore – html-to-image has no official types
      const { toJpeg } = await import('html-to-image');

      // Clone the table into an off-screen container so it renders at full width
      const tempWrapper = document.createElement('div');
      tempWrapper.style.position = 'absolute';
      tempWrapper.style.left = '-9999px';
      tempWrapper.style.top = '0';
      tempWrapper.style.backgroundColor = '#0f172a';

      const clonedTable = tableElement.cloneNode(true) as HTMLElement;
      tempWrapper.appendChild(clonedTable);
      document.body.appendChild(tempWrapper);

      // Wait a tick so the browser can lay out the clone
      await new Promise((r) => requestAnimationFrame(r));

      const width = clonedTable.scrollWidth;
      const height = clonedTable.scrollHeight;

      const dataUrl = await toJpeg(clonedTable, {
        pixelRatio: 2,
        quality: 0.95,
        width,
        height,
        style: {
          width: `${width}px`,
          height: `${height}px`,
        },
      });

      const link = document.createElement('a');
      link.download = `timetable-${new Date().toISOString().split('T')[0]}.jpg`;
      link.href = dataUrl;
      link.click();

      // Clean up
      document.body.removeChild(tempWrapper);
    } catch (error) {
      console.error('Error generating image:', error);
    }
  };

  const downloadAsPDF = async () => {
    if (!timetableRef.current) return;

    try {
      // @ts-ignore
      const { toPng } = await import('html-to-image');
      const jsPDF = (await import('jspdf')).jsPDF;

      const dataUrl = await toPng(timetableRef.current, {
        backgroundColor: '#0f172a',
        pixelRatio: 2,
        cacheBust: true,
      });

      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4',
      });

      // Fit width of A4 landscape (297mm)
      const rect = timetableRef.current.getBoundingClientRect();
      const imgWidth = 297;
      const imgHeight = (rect.height * imgWidth) / rect.width;

      pdf.addImage(dataUrl, 'PNG', 0, 0, imgWidth, imgHeight);
      pdf.save(`timetable-${new Date().toISOString().split('T')[0]}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
    }
  };

  // Download timetable as an iCalendar (.ics) file so users can import into Google Calendar
  const downloadAsICS = () => {
    if (!timetableRef.current) return;

    // Helper to format date-time in YYYYMMDDTHHMMSS format
    const pad = (n: number) => n.toString().padStart(2, '0');
    const formatDateTime = (d: Date) => {
      const hours = d.getHours();
      const adjustedHours = hours < 8 ? hours + 12 : hours;
      return `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}T${pad(adjustedHours)}${pad(d.getMinutes())}00`;
    };

    // Find upcoming Monday (start of next week) as base date
    const now = new Date();
    const offsetToMonday = (1 - now.getDay() + 7) % 7; // getDay(): 0=Sun
    const monday = new Date(now);
    monday.setHours(0, 0, 0, 0);
    monday.setDate(now.getDate() + offsetToMonday);

    let icsLines: string[] = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//College Timetable//EN',
    ];

    days.forEach((day, dayIndex) => {
      const dayDate = new Date(monday);
      dayDate.setDate(monday.getDate() + dayIndex);

      let i = 0;
      while (i < timeSlots.length) {
        const slot = timeSlots[i];
        const entries = getFilteredEntries(day, slot);

        if (entries.length === 1) {
          // Try to merge consecutive identical entries
          const entry = entries[0];
          let j = i + 1;
          while (j < timeSlots.length) {
            const nextEntries = getFilteredEntries(day, timeSlots[j]);
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
            `DTSTART:${formatDateTime(startDate)}`,
            `DTEND:${formatDateTime(endDate)}`,
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
              `DTSTART:${formatDateTime(startDate)}`,
              `DTEND:${formatDateTime(endDate)}`,
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
  

  const getFilteredEntries = (day: string, slot: string): TimetableEntry[] => {
    const entries = data[day]?.[slot] || [];
    if (selected.length === 0) return entries;
    return entries.filter((e) => selected.includes(e.courseId));
  };
  
  const renderCellContent = (entries: TimetableEntry[], day: string, slot: string) => {
    if (entries.length === 0) {
      return <div className="h-12 flex items-center justify-center text-muted-foreground text-xs"></div>;
    }

    return (
      <div className="flex flex-col gap-1 p-2 h-full min-h-16">
        {entries.map(({ courseId, classroom, classType }) => (
          <div
            key={`${day}-${slot}-${courseId}`}
            className={`
              ${generateCourseColor(courseId)}
              border rounded px-2 py-1 text-xs font-medium
              transition-all hover:scale-105 flex flex-col items-center text-center
              max-w-full
            `}
          >
            <div className="font-semibold text-xs leading-tight w-full break-words">{courseId}</div>
            <div className="text-xs opacity-80 leading-tight w-full break-words">{classroom}</div>
            {classType !== 'class' && (
              <div className="text-xs opacity-60 uppercase leading-tight w-full break-words">{classType}</div>
            )}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="bg-card border rounded-xl p-6 shadow-lg">
      <div className="flex flex-col md:flex-row items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-card-foreground">
            Your Timetable
            {selected.length > 0 && (
              <span className="text-sm font-normal text-muted-foreground ml-2">
                ({selected.length} courses selected)
              </span>
            )}
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Your personalized weekly schedule
          </p>
        </div>
        
        {selected.length > 0 && (
          <div className="flex space-x-2 mt-2 md:mt-0">
            <button
              onClick={downloadAsImage}
              className="flex items-center space-x-2 px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80 transition-colors text-sm font-medium"
            >
              <Image className="w-4 h-4" />
              <span>JPEG</span>
            </button>
            <button
              onClick={downloadAsICS}
              className="flex items-center space-x-2 px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80 transition-colors text-sm font-medium"
            >
              <FileText className="w-4 h-4" />
              <span>ICS</span>
            </button>
            {/* <button
              onClick={downloadAsPDF}
              className="flex items-center space-x-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors text-sm font-medium"
            >
              <FileText className="w-4 h-4" />
              <span>PDF</span>
            </button> */}
          </div>
        )}
      </div>
      
      {selected.length > 0 && <div ref={timetableRef} className="overflow-x-auto rounded-md">
        <table className="w-full border-collapse border-spacing-0">
          <thead>
            <tr>
              <th className="bg-muted text-muted-foreground font-medium p-2 text-left w-16">
                Day
              </th>
              {timeSlots.map((slot) => {
              const [start, end] = slot.split("-");
              const startDisplay = start.endsWith(":00") ? start.split(":")[0] : start;
              const endDisplay = end.endsWith(":00") ? end.split(":")[0] : end;
              const displaySlot = `${startDisplay}`;
              
              return (
                <th
                  key={slot}
                  className="bg-muted text-muted-foreground font-medium p-1 text-center w-20"
                >
                  <div className="text-[12px] leading-tight font-bold">{displaySlot}</div>
                </th>
              );
            })}


            </tr>
          </thead>
          <tbody>
            {days.map((day) => {
              const rowCells: React.ReactNode[] = [];
              let i = 0;
              while (i < timeSlots.length) {
                const currentSlot = timeSlots[i];
                const currentEntries = getFilteredEntries(day, currentSlot);

                let colSpan = 1;
                if (currentEntries.length === 1) {
                  const currentCourse = currentEntries[0];
                  for (let j = i + 1; j < timeSlots.length; j++) {
                    const nextSlotEntries = getFilteredEntries(day, timeSlots[j]);
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
                  for (let j = i + 1; j < timeSlots.length; j++) {
                    const nextSlotEntries = getFilteredEntries(day, timeSlots[j]);
                    if (nextSlotEntries.length === 0) {
                      colSpan++;
                    } else {
                      break;
                    }
                  }
                }
                
                rowCells.push(
                  <td
                    key={`${day}-${currentSlot}`}
                    colSpan={colSpan}
                    className="align-top min-h-16 p-0"
                  >
                    {renderCellContent(currentEntries, day, currentSlot)}
                  </td>
                );
                i += colSpan;
              }

              return (
                <tr key={day} className="hover:bg-accent/50 transition-colors">
                  <td className="bg-muted/50 text-card-foreground font-medium p-2 text-sm">
                    {day}
                  </td>
                  {rowCells}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>}
      
      {selected.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          <div className="mb-4">
            <Download className="w-12 h-12 mx-auto opacity-50" />
          </div>
          <p className="text-lg font-medium mb-2">No courses selected</p>
          <p className="text-sm">Select some courses above to see your personalized timetable and download options</p>
        </div>
      )}
    </div>
  );
}