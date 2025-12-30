import CourseSelector from '@/components/CourseSelector';
import Timetable from '@/components/Timetable';

export default function Home() {
  return (
    <div className="space-y-6">
      <div className="text-center mb-12 pt-8">
        <h1 className="text-5xl md:text-6xl font-extrabold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 tracking-tight pb-2">
          College Timetable
        </h1>
        <p className="text-muted-foreground text-lg mb-4 max-w-2xl mx-auto font-light">
          Select your courses to view your personalized schedule
        </p>
        <div className="flex flex-col items-center gap-2 text-sm text-muted-foreground/80">
          <p className="font-medium">
            Found an error? Raise a PR @ <a href='https://github.com/savarbhasin/college-timetable' className='text-blue-400 hover:text-blue-300 hover:underline transition-colors'>github</a>
          </p>
          <p className="italic">
            made by
            <a href="https://github.com/savarbhasin" className="text-blue-400 hover:text-blue-300 hover:underline ml-1 font-medium transition-colors">
              savar
            </a>
          </p>
        </div>
      </div>

      <CourseSelector />
      <Timetable />
    </div>
  );
}
