import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface CourseStore {
  selectedCourses: string[];
  addCourse: (courseId: string) => void;
  removeCourse: (courseId: string) => void;
  toggleCourse: (courseId: string) => void;
  clearCourses: () => void;
  setCourses: (courseIds: string[]) => void;
}

export const useCourseStore = create<CourseStore>()(
  persist(
    (set) => ({
      selectedCourses: [],
      
      addCourse: (courseId) =>
        set((state) => ({
          selectedCourses: state.selectedCourses.includes(courseId)
            ? state.selectedCourses
            : [...state.selectedCourses, courseId],
        })),
      
      removeCourse: (courseId) =>
        set((state) => ({
          selectedCourses: state.selectedCourses.filter((id) => id !== courseId),
        })),
      
      toggleCourse: (courseId) =>
        set((state) => ({
          selectedCourses: state.selectedCourses.includes(courseId)
            ? state.selectedCourses.filter((id) => id !== courseId)
            : [...state.selectedCourses, courseId],
        })),
      
      clearCourses: () =>
        set(() => ({
          selectedCourses: [],
        })),
      
      setCourses: (courseIds) =>
        set(() => ({
          selectedCourses: courseIds,
        })),
    }),
    {
      name: 'course-selection-storage',
    }
  )
);