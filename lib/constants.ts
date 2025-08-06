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
  'bg-blue-600/20 border-blue-600/50 text-blue-300',
  'bg-green-600/20 border-green-600/50 text-green-300',
  'bg-purple-600/20 border-purple-600/50 text-purple-300',
  'bg-yellow-600/20 border-yellow-600/50 text-yellow-300',
  'bg-red-600/20 border-red-600/50 text-red-300',
  'bg-indigo-600/20 border-indigo-600/50 text-indigo-300',
  'bg-pink-600/20 border-pink-600/50 text-pink-300',
  'bg-teal-600/20 border-teal-600/50 text-teal-300',
  'bg-orange-600/20 border-orange-600/50 text-orange-300',
  'bg-cyan-600/20 border-cyan-600/50 text-cyan-300',
] as const;