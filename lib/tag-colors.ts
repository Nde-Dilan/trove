export const TAG_COLORS = [
  "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-200/50 dark:border-blue-800/50",
  "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-200/50 dark:border-purple-800/50",
  "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-200/50 dark:border-emerald-800/50",
  "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-200/50 dark:border-amber-800/50",
  "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-200/50 dark:border-rose-800/50",
  "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-200/50 dark:border-indigo-800/50",
  "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-200/50 dark:border-cyan-800/50",
  "bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-200/50 dark:border-orange-800/50",
];

export function getRandomTagColor() {
  return TAG_COLORS[Math.floor(Math.random() * TAG_COLORS.length)];
}
