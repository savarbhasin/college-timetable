import { useState, useMemo } from 'react';
import { Course } from '../lib/types';

/**
 * Custom hook for filtering courses based on search input
 * @param courses - Array of all available courses
 * @returns Object with filtered courses and filter controls
 */
export const useCourseFilter = (courses: Course[]) => {
  const [filter, setFilter] = useState('');

  const filteredCourses = useMemo(() => {
    if (!filter.trim()) return courses;
    
    const searchTerm = filter.toLowerCase();
    return courses.filter(
      (course) =>
        course.courseId.toLowerCase().includes(searchTerm) ||
        course.courseName.toLowerCase().includes(searchTerm)
    );
  }, [courses, filter]);

  const clearFilter = () => setFilter('');

  return {
    filter,
    setFilter,
    clearFilter,
    filteredCourses,
    hasFilter: filter.trim().length > 0,
  };
};