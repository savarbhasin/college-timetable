'use client';
import { useRef } from 'react';
import { Download, Image, FileText } from 'lucide-react';
import timetableData from '@/public/timetable.json';
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
      return <div className="h-full min-h-[5rem] flex items-center justify-center text-muted-foreground/20 text-sm"></div>;
    }

    return (
      <div className="flex flex-col gap-2 p-1 h-full min-h-[5rem]">
        {entries.map(({ courseId, classroom, classType }) => (
          <div
            key={`${day}-${slot}-${courseId}`}
            className={`
              ${generateCourseColor(courseId)}
              border rounded-lg px-3 py-2 shadow-sm
              transition-all duration-200 hover:scale-[1.02] hover:shadow-md
              flex flex-col justify-center items-center text-center
              h-full w-full backdrop-blur-sm
            `}
          >
            <div className="font-bold text-sm md:text-base leading-tight w-full break-words tracking-tight">{courseId}</div>
            <div className="text-xs md:text-sm font-medium opacity-90 leading-tight w-full break-words mt-0.5">{classroom}</div>
            {classType !== 'class' && (
              <div className="text-[10px] md:text-xs font-bold opacity-75 uppercase tracking-wider mt-1 bg-black/10 rounded px-1.5 py-0.5 inline-block">{classType}</div>
            )}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="bg-card/40 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl ring-1 ring-white/5">
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

      {selectedCourses.length > 0 && <div ref={timetableRef} className="overflow-x-auto rounded-xl border bg-card/50 backdrop-blur-sm shadow-inner">
        <table className="w-full border-collapse border-spacing-0 min-w-[1000px]">
          <thead>
            <tr>
              <th className="sticky left-0 z-20 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-r font-bold p-4 text-left w-24 text-sm shadow-[4px_0_24px_-2px_rgba(0,0,0,0.1)]">
                Day
              </th>
              {timeSlots.map((slot) => (
                <th
                  key={slot}
                  className="bg-muted/30 text-muted-foreground font-semibold p-3 text-center w-32 border-b border-r last:border-r-0 min-w-[100px]"
                >
                  <div className="text-xs uppercase tracking-wider">
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
                    className="align-top p-1 border-b border-r last:border-r-0 border-border/50 bg-card/30"
                  >
                    {renderCellContent(currentEntries, day, currentSlot)}
                  </td>
                );
                i = nextIndex;
              }

              return (
                <tr key={day} className="group hover:bg-muted/20 transition-colors">
                  <td className="sticky left-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 text-foreground font-bold p-4 text-sm border-b border-r border-border shadow-[4px_0_24px_-2px_rgba(0,0,0,0.1)] group-hover:bg-background/80 transition-colors">
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