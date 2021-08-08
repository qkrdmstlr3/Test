import {
  ShellHTML,
  createComponent,
  useGlobalState,
  setGlobalState,
  EventType,
} from 'shell-html';
import styleSheet from './style.scss';
import { ipcRenderer } from 'electron';

const SIX_WEEK = new Array(6).fill(0);
const SEVEN_DAYS = new Array(7).fill(0);

class Calendar extends ShellHTML {
  connectedCallback() {
    this.enrollObserving('dateInfo');
    this.getPostsWithDate();
  }

  disconnectedCallback() {
    this.releaseObserving('dateInfo');
  }

  getPostsWithDate() {
    const dateInfo = useGlobalState('dateInfo');
    if (dateInfo.date.getMonth() + 1 === dateInfo.postsInDate.month) return;

    console.log('called');
    ipcRenderer?.send('checkpost:getPosts:date', {
      year: dateInfo.date.getFullYear(),
      month: dateInfo.date.getMonth() + 1,
    });
    ipcRenderer?.once('checkpost:getPosts:date', (event, postsInDate) => {
      setGlobalState('dateInfo', {
        ...dateInfo,
        postsInDate,
      });
      console.log(postsInDate);
    });
  }

  selectDayHandler(event: Event): void {
    if (!(event.target instanceof HTMLElement)) return;

    const id = event.target.id;
    if (!id) return;

    const dateInfo = useGlobalState('dateInfo');
    const [year, month, day] = id.split('-');
    setGlobalState('dateInfo', {
      ...dateInfo,
      selectedYear: Number(year),
      selectedMonth: Number(month),
      selectedDay: Number(day),
    });
  }

  makeCalendar() {
    const { date, selectedYear, selectedMonth, selectedDay } = useGlobalState(
      'dateInfo'
    );
    const today = new Date();
    const year = date.getFullYear();
    const month = date.getMonth();

    const lastDate = new Date(year, month, 0);
    const startDate = new Date(year, month, 1);
    const lastDay = lastDate.getDate();
    const startDOW = startDate.getDay();

    let dayCount = 1;
    let dayCountStart = false;
    const calendar = SIX_WEEK.reduce((html) => {
      const daysOfWeek = SEVEN_DAYS.reduce((week, _, dow) => {
        if (dow === startDOW) dayCountStart = true;

        const isSaturday = dow === 6 && 'saturday';
        const isSunday = dow === 0 && 'sunday';
        const dayBox = dayCountStart && dayCount <= lastDay;
        const dayId = `${year}-${month}-${dayCount}`;
        const isToday =
          dayCount === today.getDate() &&
          month === today.getMonth() &&
          year === today.getFullYear() &&
          'today';
        const isSelectedDay =
          year === selectedYear &&
          month === selectedMonth &&
          dayCount === selectedDay &&
          'selected';

        return (week += `
        <div class="box ${isSelectedDay}" id="${dayId}">
          ${
            dayBox
              ? `<span class="day ${isToday} ${isSaturday} ${isSunday}">${dayCount++}</span>`
              : ''
          }
        </div>`);
      }, '');
      const weekHTML = `<div class="week">${daysOfWeek}</div>`;
      return (html += weekHTML);
    }, '');
    return calendar;
  }

  render() {
    const calendarHTML = this.makeCalendar();

    return {
      html: `<div id="calendar">${calendarHTML}</div>`,
      css: styleSheet,
      eventFuncs: [
        {
          className: 'box',
          func: this.selectDayHandler,
          type: EventType.click,
        },
      ],
    };
  }
}

createComponent('calendar-calendar', Calendar);
