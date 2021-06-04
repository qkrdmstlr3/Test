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
