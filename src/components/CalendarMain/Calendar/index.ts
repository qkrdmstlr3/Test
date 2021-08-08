import {
  ShellHTML,
  createComponent,
  useGlobalState,
  setGlobalState,
  EventType,
} from 'shell-html';
import styleSheet from './style.scss';
import { ipcRenderer } from 'electron';
import { CheckPostSummaryCalendarType } from '@Types/types';
import { getCalendarIndexWithPost } from '@Utils/calcDate';
import { CheckPostStatusType } from '@Types/enum';

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

    ipcRenderer?.send('checkpost:getPosts:date', {
      year: dateInfo.date.getFullYear(),
      month: dateInfo.date.getMonth() + 1,
    });
    ipcRenderer?.once('checkpost:getPosts:date', (event, postsInDate) => {
      setGlobalState('dateInfo', {
        ...dateInfo,
        postsInDate,
      });
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
      selectedPostId: '',
      selectedYear: Number(year),
      selectedMonth: Number(month),
      selectedDay: Number(day),
    });
  }

  getPostsSortedByDay(
    posts: CheckPostSummaryCalendarType[],
    year: number,
    month: number
  ) {
    const postsSortedByDay: {
      [day: string]: { id: string; status: CheckPostStatusType }[];
    } = {};
    for (let i = 1; i <= 31; i += 1) {
      postsSortedByDay[`${i}`] = [];
    }

    posts.forEach((post) => {
      const [start, end] = getCalendarIndexWithPost(
        post.startDate,
        post.endDate,
        year,
        month
      );
      for (let i = start; i <= end; i += 1) {
        postsSortedByDay[`${i}`].push({ id: post.id, status: post.status });
      }
    });
    return postsSortedByDay;
  }

  /**
   * HTML
   */
  getPostStatus(status: CheckPostStatusType, id: string): string {
    const statusList = {
      [CheckPostStatusType.todo]: {
        className: 'status__todo',
      },
      [CheckPostStatusType.doing]: {
        className: 'status__doing',
      },
      [CheckPostStatusType.done]: {
        className: 'status__done',
      },
    };

    const { className } = statusList[status];
    return `<li id="${id}" class="post__status ${className}" data-testid="status"></li>`;
  }

  getPostsInBoxHTML(posts: { id: string; status: CheckPostStatusType }[]) {
    let isContainSelectedPost = false;
    if (!posts) return { html: '', isContainSelectedPost };

    const { selectedPostId } = useGlobalState('dateInfo');
    const postsHTML = posts.reduce((acc, post) => {
      if (post.id === selectedPostId) isContainSelectedPost = true;
      return (acc += this.getPostStatus(post.status, post.id));
    }, '');
    return { html: postsHTML, isContainSelectedPost };
  }

  makeCalendar() {
    const {
      date,
      selectedYear,
      selectedMonth,
      selectedDay,
      postsInDate: { posts },
    } = useGlobalState('dateInfo');

    const today = new Date();
    const year = date.getFullYear();
    const month = date.getMonth();
    const postsSortedByDay = this.getPostsSortedByDay(posts, year, month + 1);

    const lastDate = new Date(year, month, 0);
    const startDate = new Date(year, month, 1);
    const lastDay = lastDate.getDate();
    const startDOW = startDate.getDay();

    let dayCount = 1;
    let dayCountStart = false;
    const calendar = SIX_WEEK.reduce((html) => {
      const daysOfWeek = SEVEN_DAYS.reduce((week, _, dow) => {
        if (dow === startDOW) dayCountStart = true;
        const { html, isContainSelectedPost } = this.getPostsInBoxHTML(
          postsSortedByDay[dayCount]
        );

        const isSaturday = dow === 6 && 'saturday';
        const isSunday = dow === 0 && 'sunday';
        const dayBox = dayCountStart && dayCount <= lastDay;
        const dayId = `${year}-${month}-${dayCount}`;
        const isToday =
          dayBox &&
          dayCount === today.getDate() &&
          month === today.getMonth() &&
          year === today.getFullYear() &&
          'today';
        const isSelectedDay =
          dayBox &&
          year === selectedYear &&
          month === selectedMonth &&
          dayCount === selectedDay &&
          'selected';
        const isSelectedPost =
          dayBox && isContainSelectedPost && 'selected-post';
        return (week += `
        <div class="box ${isSelectedPost} ${isSelectedDay}" id="${dayId}">
          ${
            dayBox
              ? `
                <span class="day ${isToday} ${isSaturday} ${isSunday}">${dayCount++}</span>
                <ul>
                  ${html}
                </ul>  
              `
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
