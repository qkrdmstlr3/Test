import { ShellHTML, createComponent, RenderType } from '@Lib/shell-html';
import styleSheet from './style.scss';
import { useGlobalState, setGlobalState } from '../../lib/shell-html/state';
import { CheckPostType } from '../../types/types';
import { CheckPostStatusType } from '../../types/enum';
import { getDday } from '../../utils/calcDate';
import { ipcRenderer } from 'electron';

class CheckPost extends ShellHTML {
  constructor() {
    super(undefined);
  }

  connectedCallback(): void {
    this.enrollObserving('checkpostControl');
  }

  disconnectedCallback(): void {
    this.releaseObserving('checkpostControl');
    ipcRenderer?.removeAllListeners('checkpost:getPost');
  }

  getPost(): void {
    const postId = useGlobalState('checkpostControl').currentCheckPostId;
    if (!postId || postId === this.state?.id) return;

    const posts = useGlobalState('checkposts');
    const [post] = posts.filter((post: CheckPostType) => post.id === postId);
    if (post) {
      this.setState(post);
      return;
    }

    ipcRenderer?.send('checkpost:getPost', { id: postId });
    ipcRenderer?.once('checkpost:getPost', (event, post) => {
      setGlobalState('checkposts', [...posts, post]);
      this.setState(post);
    });
  }

  /**
   * HTML
   */
  getPostStatus(status: CheckPostStatusType): string {
    const statusList = {
      [CheckPostStatusType.todo]: {
        className: 'status__todo',
        text: 'x',
      },
      [CheckPostStatusType.doing]: {
        className: 'status__doing',
        text: '⎯',
      },
      [CheckPostStatusType.done]: {
        className: 'status__done',
        text: 'v',
      },
    };
    const { className, text } = statusList[status];
    return `<div class="post__status ${className}" data-testid="status">${text}</div>`;
  }

  render(): RenderType {
    this.getPost();
    const post = this.state;

    return {
      css: styleSheet,
      html: post
        ? `
      <div class="post">
        <header class="post__header">
          <div class="post__header__left">
            <div class="post__header__top">
              ${this.getPostStatus(post.status)}
              <h1 class="post__header__title" contenteditable="true" data-testid="title">${
                post.title
              }</h1>
              <span class="post__header__dday" data-testid="dday">${getDday(
                post.endDate
              )}</span>
            </div>
            <div class="post__header__bottom">
              <input type="date" data-testid="startdate" value="${
                post.startDate
              }" />
              <input type="date" data-testid="enddate" value="${
                post.endDate
              }" />
            </div>
          </div>
          <div class="post__header__right">
            <button>삭제</button>
          </div>
        </header>
        <div class="post__content" data-testid="content">
          ${post.content}
        </div>
      </div>`
        : '<div>none</div>',
    };
  }
}

createComponent('post-check', CheckPost);

export default CheckPost;
