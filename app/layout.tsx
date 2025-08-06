import '../styles/globals.css';
import { ReactNode } from 'react';

export const metadata = {
  title: 'College Timetable',
  description: 'Filterable timetable for students',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-background text-foreground">
        <main className="container mx-auto p-6 max-w-7xl">{children}</main>
      </body>
    </html>
  );
}
