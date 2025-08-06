import { useState, useCallback } from 'react';

/**
 * Custom hook for managing course selection state
 * @param initialSelected - Initial array of selected course IDs
 * @returns Object with selection state and control functions
 */
export const useCourseSelection = (initialSelected: string[] = []) => {
  const [selected, setSelected] = useState<string[]>(initialSelected);

  const toggleCourse = useCallback((courseId: string) => {
    setSelected((prev) => {
      if (prev.includes(courseId)) {
        return prev.filter((id) => id !== courseId);
      } else {
        return [...prev, courseId];
      }
    });
  }, []);

  const clearAll = useCallback(() => {
    setSelected([]);
  }, []);

  const selectMultiple = useCallback((courseIds: string[]) => {
    setSelected((prev) => {
      const newIds = courseIds.filter((id) => !prev.includes(id));
      return [...prev, ...newIds];
    });
  }, []);

  const isSelected = useCallback((courseId: string) => {
    return selected.includes(courseId);
  }, [selected]);

  return {
    selected,
    toggleCourse,
    clearAll,
    selectMultiple,
    isSelected,
    hasSelection: selected.length > 0,
    selectionCount: selected.length,
  };
};