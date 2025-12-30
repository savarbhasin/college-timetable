export const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'] as const;

export const DOWNLOAD_CONFIG = {
  image: {
    pixelRatio: 2,
    quality: 0.95,
    backgroundColor: '#0f172a',
  },
  ics: {
    prodId: '-//College Timetable//EN',
    version: '2.0',
  },
} as const;



export const COLOR_PALETTE = [
  'bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border-blue-500/30 text-blue-100 hover:from-blue-500/30 hover:to-cyan-500/30',
  'bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border-emerald-500/30 text-emerald-100 hover:from-emerald-500/30 hover:to-teal-500/30',
  'bg-gradient-to-br from-violet-500/20 to-purple-500/20 border-violet-500/30 text-violet-100 hover:from-violet-500/30 hover:to-purple-500/30',
  'bg-gradient-to-br from-amber-500/20 to-orange-500/20 border-amber-500/30 text-amber-100 hover:from-amber-500/30 hover:to-orange-500/30',
  'bg-gradient-to-br from-rose-500/20 to-pink-500/20 border-rose-500/30 text-rose-100 hover:from-rose-500/30 hover:to-pink-500/30',
  'bg-gradient-to-br from-indigo-500/20 to-blue-600/20 border-indigo-500/30 text-indigo-100 hover:from-indigo-500/30 hover:to-blue-600/30',
  'bg-gradient-to-br from-fuchsia-500/20 to-pink-600/20 border-fuchsia-500/30 text-fuchsia-100 hover:from-fuchsia-500/30 hover:to-pink-600/30',
  'bg-gradient-to-br from-teal-500/20 to-emerald-600/20 border-teal-500/30 text-teal-100 hover:from-teal-500/30 hover:to-emerald-600/30',
  'bg-gradient-to-br from-orange-500/20 to-red-500/20 border-orange-500/30 text-orange-100 hover:from-orange-500/30 hover:to-red-500/30',
  'bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border-cyan-500/30 text-cyan-100 hover:from-cyan-500/30 hover:to-blue-500/30',
] as const;