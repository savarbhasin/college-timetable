'use client';
import { useRef } from 'react';
import { Download, Image, FileText } from 'lucide-react';
import timetableData from '../class.json';

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

  const downloadAsImage = async () => {
    if (!timetableRef.current) return;

    const tableElement = timetableRef.current.querySelector('table');
    if (!tableElement) return;

    try {
      const html2canvas = (await import('html2canvas')).default;
      const canvas = await html2canvas(tableElement, {
        backgroundColor: '#0f172a',
        scale: 2,
        useCORS: true,
        onclone: (clonedDoc) => {
          clonedDoc.documentElement.classList.add('dark');
        },
      });

      const link = document.createElement('a');
      link.download = `timetable-${new Date().toISOString().split('T')[0]}.png`;
      link.href = canvas.toDataURL('image/png', 1.0);
      link.click();
    } catch (error) {
      console.error('Error generating image:', error);
    }
  };

  const downloadAsPDF = async () => {
    if (!timetableRef.current) return;

    const tableElement = timetableRef.current.querySelector('table');
    if (!tableElement) return;

    try {
      const html2canvas = (await import('html2canvas')).default;
      const jsPDF = (await import('jspdf')).jsPDF;

      const canvas = await html2canvas(tableElement, {
        backgroundColor: '#0f172a',
        scale: 2,
        useCORS: true,
        onclone: (clonedDoc) => {
          clonedDoc.documentElement.classList.add('dark');
        },
      });

      const imgData = canvas.toDataURL('image/png', 1.0);
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4',
      });

      const imgWidth = 297; // A4 landscape width
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      pdf.save(`timetable-${new Date().toISOString().split('T')[0]}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
    }
  };
  
  const getFilteredEntries = (day: string, slot: string): TimetableEntry[] => {
    const entries = data[day]?.[slot] || [];
    if (selected.length === 0) return entries;
    return entries.filter((e) => selected.includes(e.courseId));
  };
  
  const renderCellContent = (entries: TimetableEntry[], day: string, slot: string) => {
    if (entries.length === 0) {
      return <div className="h-10 flex items-center justify-center text-muted-foreground text-xs"></div>;
    }

    return (
      <div className="space-y-1 p-1 h-full min-h-10">
        {entries.map(({ courseId, classroom, classType }) => (
          <div
            key={`${day}-${slot}-${courseId}`}
            className={`
              ${generateCourseColor(courseId)}
              border rounded px-1 py-0.5 text-xs font-medium
              transition-all hover:scale-105 h-full flex flex-col justify-center items-center text-center
              max-w-full overflow-hidden
            `}
          >
            <div className="font-semibold text-xs leading-tight truncate w-full">{courseId}</div>
            <div className="text-[10px] opacity-80 leading-tight truncate w-full">{classroom}</div>
            {classType !== 'class' && (
              <div className="text-[10px] opacity-60 uppercase leading-tight truncate w-full">{classType}</div>
            )}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="bg-card border rounded-xl p-6 shadow-lg">
      <div className="flex items-center justify-between mb-6">
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
          <div className="flex space-x-2">
            <button
              onClick={downloadAsImage}
              className="flex items-center space-x-2 px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80 transition-colors text-sm font-medium"
            >
              <Image className="w-4 h-4" />
              <span>PNG</span>
            </button>
            <button
              onClick={downloadAsPDF}
              className="flex items-center space-x-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors text-sm font-medium"
            >
              <FileText className="w-4 h-4" />
              <span>PDF</span>
            </button>
          </div>
        )}
      </div>
      
      <div ref={timetableRef} className="overflow-x-auto rounded-xl">
        <table className="w-full border-collapse border-spacing-0">
          <thead>
            <tr>
              <th className="bg-muted text-muted-foreground font-medium p-2 text-left w-16">
                Day
              </th>
              {timeSlots.map((slot) => (
                <th
                  key={slot}
                  className="bg-muted text-muted-foreground font-medium p-1 text-center w-20"
                >
                  <div className="text-[6px] leading-tight">{slot}</div>
                </th>
              ))}
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
                    className="align-top"
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
      </div>
      
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