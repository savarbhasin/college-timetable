'use client';
import { useState } from 'react';
import CourseSelector from '../components/CourseSelector';
import Timetable from '../components/Timetable';

export default function Home() {
  const [selectedCourses, setSelectedCourses] = useState<string[]>([]);

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">College Timetable</h1>
        <p className="text-muted-foreground">Select your courses to view your personalized schedule</p>
      </div>
      
      <CourseSelector selected={selectedCourses} onChange={setSelectedCourses} />
      <Timetable selected={selectedCourses} />
    </div>
  );
}
