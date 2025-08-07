import '../styles/globals.css';
import { ReactNode } from 'react';
import { Analytics } from "@vercel/analytics/next";
import { Poppins } from 'next/font/google';

const poppins = Poppins({ 
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  display: 'swap',
  variable: '--font-poppins',
});

export const metadata = {
  title: 'College Timetable',
  description: 'Filterable timetable for students',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`dark ${poppins.variable}`}>
      <body className={`min-h-screen bg-background text-foreground font-sans ${poppins.className}`}>
        <main className="container mx-auto p-6 max-w-7xl">{children}
         <Analytics />
       </main>
      </body>
    </html>
  );
}
