import { ShellHTML, createComponent, useGlobalState } from 'shell-html';
import styleSheet from './style.scss';

const SIX_WEEK = new Array(6).fill(0);
const SEVEN_DAYS = new Array(7).fill(0);

class Calendar extends ShellHTML {
  connectedCallback() {
    this.enrollObserving('dateInfo');
  }

  disconnectedCallback() {
    this.releaseObserving('dateInfo');
  }

  makeCalendar() {
    const { date }: { date: Date } = useGlobalState('dateInfo');
    const today = new Date();
    const year = date.getFullYear();
    const month = date.getMonth();
    const day = date.getDay();

    const lastDate = new Date(year, month, 0);
    const startDate = new Date(year, month, 1);
    const lastDay = lastDate.getDate();
    const startDOW = startDate.getDay();

    let dayCount = 1;
    let dayCountStart = false;
    const calendar = SIX_WEEK.reduce((html) => {
      const daysOfWeek = SEVEN_DAYS.reduce((week, _, dow) => {
        if (dow === startDOW) dayCountStart = true;

        const dayBox = dayCountStart && dayCount <= lastDay;
        const isToday =
          day === dayCount && month === today.getMonth() && 'today';
        return (week += `
        <div class="box">
          ${dayBox ? `<span class="day ${isToday}">${dayCount++}</span>` : ''}
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
    };
  }
}

createComponent('calendar-calendar', Calendar);
