import CourseSelector from '@/components/CourseSelector';
import Timetable from '@/components/Timetable';

export default function Home() {
  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">College Timetable</h1>
        <p className="text-muted-foreground">Select your courses to view your personalized schedule</p>
        <p className="text-muted-foreground text-sm font-semibold">not updated for new changes</p>
        <p className="text-muted-foreground text-sm italic">
          made by
          <a href="https://github.com/savarbhasin" className="text-blue-600 hover:underline ml-1">
            savar
          </a>
        </p>
      </div>
      
      <CourseSelector />
      <Timetable />
    </div>
  );
}
