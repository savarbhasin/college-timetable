'use client';
import { useRef } from 'react';
import { Download, Image, FileText } from 'lucide-react';
import timetableData from '@/public/merged.json';
import { downloadAsICS } from '@/lib/icsDownload';
import { downloadAsImage } from '@/lib/imgDownload';
import { TimetableData, TimetableEntry } from '@/lib/types';
import { generateCourseColor } from '@/lib/genColors';
import { getFilteredEntries, formatTimeSlot, calculateColSpan } from '@/lib/timetableUtils';
import { DAYS } from '@/lib/constants';
import { useCourseStore } from '@/lib/courseStore';

const data = timetableData as TimetableData;
const timeSlots = Object.keys(data['Monday']);



export default function Timetable() {
  const timetableRef = useRef<HTMLDivElement>(null);
  const { selectedCourses } = useCourseStore();
  

  const handleDownloadICS = () => {
    downloadAsICS(timetableRef, timeSlots, data, selectedCourses);
  };

  const handleDownloadImage = () => {
    downloadAsImage(timetableRef);
  };
  
  const renderCellContent = (entries: TimetableEntry[], day: string, slot: string) => {
    if (entries.length === 0) {
      return <div className="h-16 flex items-center justify-center text-muted-foreground text-xs"></div>;
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
            {selectedCourses.length > 0 && (
              <span className="text-sm font-normal text-muted-foreground ml-2">
                ({selectedCourses.length} courses)
              </span>
            )}
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Your personalized weekly schedule
          </p>
        </div>
        
        {selectedCourses.length > 0 && (
          <div className="flex space-x-2 mt-2 md:mt-0">
            <button
              onClick={handleDownloadImage}
              className="flex items-center space-x-2 px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80 transition-colors text-sm font-medium"
            >
              <Image className="w-4 h-4" />
              <span>JPEG</span>
            </button>
            <button
              onClick={handleDownloadICS}
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
      
      {selectedCourses.length > 0 && <div ref={timetableRef} className="overflow-x-auto rounded-md">
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
                  <div className={`text-[8px] leading-tight font-bold`}>
                    {formatTimeSlot(slot)}
                  </div>
                </th>
              ))}


            </tr>
          </thead>
          <tbody>
            {DAYS.map((day) => {
              const rowCells: React.ReactNode[] = [];
              let i = 0;
              while (i < timeSlots.length) {
                const currentSlot = timeSlots[i];
                const currentEntries = getFilteredEntries(data, selectedCourses, day, currentSlot);
                const { colSpan, nextIndex } = calculateColSpan(data, selectedCourses, day, timeSlots, i);
                
                rowCells.push(
                  <td
                    key={`${day}-${currentSlot}`}
                    colSpan={colSpan}
                    className="align-top min-h-16 p-0"
                  >
                    {renderCellContent(currentEntries, day, currentSlot)}
                  </td>
                );
                i = nextIndex;
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
      
      {selectedCourses.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          <div className="mb-4">
            <Download className="w-12 h-12 mx-auto opacity-50" />
          </div>
          <p className="text-lg font-medium mb-2">No courses selectedCourses</p>
          <p className="text-sm">Select some courses above to see your personalized timetable and download options</p>
        </div>
      )}
    </div>
  );
}