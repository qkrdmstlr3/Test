export function getDday(endDay: string): string {
  const today = new Date();
  const endDate = new Date(endDay);
  const dday = Math.ceil(
    (endDate.getTime() - today.getTime()) / (1000 * 3600 * 24)
  );

  if (isNaN(dday)) return '';
  if (dday == 0) return 'dday';
  else if (dday < 0) return `+${dday}`;
  else return `-${dday}`;
}
