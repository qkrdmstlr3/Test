import {
  ShellHTML,
  createComponent,
  RenderType,
  useGlobalState,
  EventType,
} from 'shell-html';
import styleSheet from './style.scss';
import { CheckPostStatusType } from '@Types/enum';
import { CheckPostSummaryCalendarType } from '@Types/types';
import { setGlobalState } from 'shell-html';

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

  clickPostItemHandler(event: Event): void {
    if (!(event.target instanceof HTMLElement)) return;

    const id = event.target.closest('.post-item')?.id;
    if (!id) return;

    const dateInfo = useGlobalState('dateInfo');
    setGlobalState('dateInfo', {
      ...dateInfo,
      selectedPostId: id,
    });
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
    const { selectedPostId } = useGlobalState('dateInfo');
    return posts.reduce((acc, post) => {
      const selectedPost = selectedPostId === post.id && 'selected';
      return (
        acc +
        `
      <div id=${post.id} class="post-item ${selectedPost}">
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
      eventFuncs: [
        {
          className: 'post-item',
          func: this.clickPostItemHandler,
          type: EventType.click,
        },
      ],
    };
  }
}

createComponent('subnav-calendar', SubnavCalendar);

export default SubnavCalendar;
