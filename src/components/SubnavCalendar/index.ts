import {
  ShellHTML,
  createComponent,
  RenderType,
  useGlobalState,
} from 'shell-html';
import styleSheet from './style.scss';
import { CheckPostStatusType } from '@Types/enum';
import { CheckPostSummaryCalendarType } from '@Types/types';

class SubnavCalendar extends ShellHTML {
  connectedCallback(): void {
    this.enrollObserving('dateInfo');
  }

  disconnectedCallback(): void {
    this.releaseObserving('dateInfo');
  }

  getPostsInSelectedDate(): CheckPostSummaryCalendarType[] {
    const {
      selectedYear,
      selectedMonth,
      selectedDay,
      postsInDate: { posts },
    } = useGlobalState('dateInfo');
    const postsInSelectedDate = posts.filter(
      (post: CheckPostSummaryCalendarType) => {
        const selectedDate = new Date(
          `${selectedYear}-0${selectedMonth}-${selectedDay}`
        );
        const startDate = new Date(post.startDate);
        const endDate = new Date(post.endDate);
        startDate.setMonth(startDate.getMonth() - 1);
        endDate.setMonth(endDate.getMonth() - 1);
        return (
          startDate.getTime() <= selectedDate.getTime() &&
          endDate.getTime() >= selectedDate.getTime()
        );
      }
    );
    return postsInSelectedDate;
  }

  /**
   * HTML
   */
  getPostStatus(status: CheckPostStatusType): string {
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
    return `<div id="status" class="post__status ${className}" data-testid="status"></div>`;
  }

  getPostsHTML(posts: CheckPostSummaryCalendarType[]): string {
    return posts.reduce((acc, post) => {
      return (
        acc +
        `
      <div class="post-item">
        <span>${post.title}</span>
        ${this.getPostStatus(post.status)}
      </div>
      `
      );
    }, '');
  }

  render(): RenderType {
    const { selectedYear, selectedMonth, selectedDay } = useGlobalState(
      'dateInfo'
    );
    const posts = this.getPostsInSelectedDate();
    const postsHTML = this.getPostsHTML(posts);

    return {
      html: `
      <nav class="nav">
        ${
          selectedYear
            ? `
            <div class="date-container">
              <h4>${selectedYear} / ${selectedMonth + 1}</h4>
              <h2>${selectedDay}</h2>
            </div>
            <li class="post-list">
              ${postsHTML}
            </li>
            `
            : ''
        }
      </nav>
      `,
      css: styleSheet,
      eventFuncs: [],
    };
  }
}

createComponent('subnav-calendar', SubnavCalendar);

export default SubnavCalendar;
