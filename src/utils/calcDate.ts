const dayList = ['일', '월', '화', '수', '목', '금', '토'];

export function getDday(endDay: string): string {
  const today = new Date();
  const endDate = new Date(`${endDay}T00:00:00`);
  const dday = Math.ceil(
    (endDate.getTime() - today.getTime()) / (1000 * 3600 * 24)
  );

  if (isNaN(dday)) return '';
  if (dday == 0) return 'dday';
  else if (dday < 0) return `+${-dday}`;
  else return `-${dday}`;
}

export function getToday(): string[] {
  const today = new Date();

  const hour = `${today.getHours() < 10 ? '0' : ''}${today.getHours()}`;
  const minute = `${today.getMinutes() < 10 ? '0' : ''}${today.getMinutes()}`;
  const year = `${today.getFullYear()}`;
  const month = `${today.getMonth() + 1}`;
  const day = `${today.getDate()}`;
  const dow = dayList[today.getDay()];

  return [hour, minute, year, month, day, dow];
}

export function isTwoDateInSameMonth(
  startdate: string,
  enddate: string
): boolean {
  const [year1, month1, day1] = startdate.split('-');
  const [year2, month2, day2] = enddate.split('-');

  if (year1 !== year2 || month1 !== month2) return false;
  if (day1 > day2) return false;
  return true;
}

export function getCalendarIndexWithPost(
  startdate: string,
  enddate: string,
  year: number,
  month: number
): number[] {
  const [startyear, startmonth, startday] = startdate
    .split('-')
    .map((date) => Number(date));
  const [endyear, endmonth, endday] = enddate
    .split('-')
    .map((date) => Number(date));
  // 이번달에 시작과 끝
  if (startyear === endyear && startmonth === endmonth)
    return [startday, endday];

  // 이번달에 시작
  if (startyear === year && startmonth === month) return [startday, 31];

  // 이번달에 끝남
  if (endyear === year && endmonth === month) return [1, endday];

  // 사이 달
  return [1, 31];
}
