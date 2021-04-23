import { ShellHTML, createComponent } from '@Lib/shell-html';
import styleSheet from './style.scss';
import { dummyCheckPost } from '../../common/data/dummyData';

class CheckPost extends ShellHTML {
  getPostStatus(status: string): string {
    switch (status) {
      case 'todo':
        return `<div class="post__status status__todo">x</div>`;
      case 'doing':
        return `<div class="post__status status__doing">⎯</div>`;
      case 'done':
        return `<div class="post__status done">v</div>`;
      default:
        return '';
    }
  }

  getDday(endDay: string): string {
    const today = new Date();
    const endDate = new Date(endDay);
    const dday = Math.ceil(
      (endDate.getTime() - today.getTime()) / (1000 * 3600 * 24)
    );
    if (dday == 0) return 'dday';
    else if (dday < 0) return `+${dday}`;
    else return `-${dday}`;
  }

  render() {
    return {
      css: styleSheet,
      html: `
      <div class="post">
        <header class="post__header">
          <div class="post__header__left">
            <div class="post__header__top">
              ${this.getPostStatus(dummyCheckPost.status)}
              <h1 class="post__header__title">제목</h1>
              <span class="post__header__dday">${this.getDday(
                dummyCheckPost.endDate
              )}</span>
            </div>
            <div class="post__header__bottom">
              <input type="date" value=${dummyCheckPost.startDate} />
              <input type="date" value=${dummyCheckPost.endDate} />
            </div>
          </div>
          <div class="post__header__right">
            <button>삭제</button>
            <button>저장</button>
          </div>
        </header>
        <div class="post__content">
          ${dummyCheckPost.content}
        </div>
      </div>`,
    };
  }
}

createComponent('post-check', CheckPost);
