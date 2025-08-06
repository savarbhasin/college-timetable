'use client';
import { useState, useRef } from 'react';
import { Search, X, Check, BookOpen } from 'lucide-react';
import coursesData from '../courses.json';

interface Course {
  courseId: string;
  courseName: string;
}

interface Props {
  selected: string[];
  onChange: (ids: string[]) => void;
}

export default function CourseSelector({ selected, onChange }: Props) {
  const [filter, setFilter] = useState('');
  const [isExpanded, setIsExpanded] = useState(true);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const filteredCourses = (coursesData as Course[]).filter(
    (course) =>
      course.courseId.toLowerCase().includes(filter.toLowerCase()) ||
      course.courseName.toLowerCase().includes(filter.toLowerCase()),
  );

  const handleToggle = (courseId: string) => {
    if (selected.includes(courseId)) {
      onChange(selected.filter((id) => id !== courseId));
    } else {
      onChange([...selected, courseId]);
    }
    
    // Refocus the search input after course selection
    setTimeout(() => {
      searchInputRef.current?.focus();
    }, 0);
  };

  const clearAll = () => {
    onChange([]);
  };

  return (
    <div className="bg-card border rounded-xl p-6 mb-6 shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <BookOpen className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-card-foreground">Course Selection</h2>
            <p className="text-sm text-muted-foreground">Choose courses for your personalized timetable</p>
          </div>
        </div>
        {selected.length > 0 && (
          <button
            onClick={clearAll}
            className="text-sm text-muted-foreground hover:text-destructive transition-colors flex items-center space-x-1"
          >
            <X className="w-4 h-4" />
            <span>Clear All</span>
          </button>
        )}
      </div>

      {/* Search Bar */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
        <input
          ref={searchInputRef}
          type="text"
          placeholder="Search courses by ID or name..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          onFocus={() => setIsExpanded(true)}
          className="w-full pl-10 pr-4 py-3 bg-input border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
        />
      </div>

      {/* Selected Courses Pills */}
      {selected.length > 0 && (
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-card-foreground">
              Selected Courses ({selected.length})
            </h3>
            
          </div>
          <div className="flex flex-wrap gap-2">
            {selected.map((courseId) => (
              <div
                key={courseId}
                className="group inline-flex items-center px-3 py-2 bg-primary text-primary-foreground text-sm rounded-full font-medium transition-all hover:bg-primary/90"
              >
                <Check className="w-3 h-3 mr-2" />
                {courseId}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleToggle(courseId);
                  }}
                  className="ml-2 hover:bg-primary-foreground/20 rounded-full p-0.5 transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Course Grid */}
      <div className={`transition-all duration-300 ${isExpanded || filter || selected.length === 0 ? 'max-h-80' : 'max-h-0'} overflow-hidden`}>
        <div className="grid px-1 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 max-h-80 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent">
          {filteredCourses.map(({ courseId, courseName }) => {
            const isSelected = selected.includes(courseId);
            return (
              <div
                key={courseId}
                onClick={() => handleToggle(courseId)}
                className={`
                  relative p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 hover:scale-[1.02]
                  ${isSelected 
                    ? 'bg-primary/10 border-primary shadow-md' 
                    : 'bg-card border-border hover:border-primary/50 hover:bg-accent/50'
                  }
                `}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className={`font-semibold text-sm ${isSelected ? 'text-primary' : 'text-card-foreground'}`}>
                        {courseId}
                      </span>
                      {isSelected && (
                        <div className="w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                          <Check className="w-3 h-3 text-primary-foreground" />
                        </div>
                      )}
                    </div>
                    {courseName && (
                      <p className="text-xs text-muted-foreground truncate">
                        {courseName}
                      </p>
                    )}
                  </div>
                </div>
                
                {/* Hover Effect */}
                <div className={`absolute inset-0 rounded-lg transition-opacity ${isSelected ? 'opacity-0' : 'opacity-0 hover:opacity-100'} bg-primary/5`} />
              </div>
            );
          })}
        </div>
      </div>

      {/* Toggle Button */}
      {!filter && selected.length > 0 && (
        <div className="mt-4 text-center">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-sm text-primary hover:text-primary/80 transition-colors"
          >
            {isExpanded ? 'Hide course list' : 'Show all courses'}
          </button>
        </div>
      )}

      {/* Empty State */}
      {filteredCourses.length === 0 && filter && (
        <div className="text-center py-8 text-muted-foreground">
          <Search className="w-8 h-8 mx-auto mb-2 opacity-50" />
          <p>No courses found matching "{filter}"</p>
        </div>
      )}
    </div>
  );
}