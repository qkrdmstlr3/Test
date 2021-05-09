import {
  ShellHTML,
  createComponent,
  RenderType,
  useGlobalState,
  setGlobalState,
  EventType,
} from '@Lib/shell-html';
import styleSheet from './style.scss';
import { CheckPostType } from '@Types/types';
import { CheckPostStatusType } from '@Types/enum';
import { getDday } from '@Utils/calcDate';
import { ipcRenderer } from 'electron';
import _ from 'lodash';

class CheckPost extends ShellHTML {
  checkSave: NodeJS.Timeout | undefined;

  constructor() {
    super(undefined);
  }

  connectedCallback(): void {
    this.enrollObserving('checkpostControl');
    this.checkSave = setInterval(() => {
      this.savePost();
    }, 2000);
  }

  disconnectedCallback(): void {
    if (this.checkSave) {
      clearInterval(this.checkSave);
    }
    this.releaseObserving('checkpostControl');
    ipcRenderer?.removeAllListeners('checkpost:getPost');
  }

  getPost(): void {
    const postId = useGlobalState('checkpostControl').currentCheckPostId;
    if (!postId || postId === this.state?.id) return;

    const posts = useGlobalState('checkposts');
    const [post] = posts.filter((post: CheckPostType) => post.id === postId);
    if (post) {
      this.setState(post.id);
      return;
    }

    ipcRenderer?.send('checkpost:getPost', { id: postId });
    ipcRenderer?.once('checkpost:getPost', (event, post) => {
      setGlobalState('checkposts', [...posts, post]);
      this.setState(post.id);
    });
  }

  /**
   * EventHandler
   */
  savePost(): void {
    const title = this.getElement('title');
    const status = this.getElement('status');
    const startDate = this.getElement('startdate') as HTMLInputElement;
    const endDate = this.getElement('enddate') as HTMLInputElement;
    const content = this.getElement('content');
    const postId = useGlobalState('checkpostControl').currentCheckPostId;

    const posts: CheckPostType[] = _.cloneDeep(useGlobalState('checkposts'));
    const index = posts.findIndex((p) => p.id === postId);
    if (index < 0) return;
    const storedPost = posts[index];

    const isChangeExist =
      storedPost.title !== title?.innerText ||
      storedPost.status !== status?.innerText ||
      storedPost.content.trim().replace(/>[ |\n]*</g, '><') !==
        content?.innerHTML.trim().replace(/>[ |\n]*</g, '><') ||
      storedPost.startDate !== startDate.value ||
      storedPost.endDate !== endDate.value;

    if (isChangeExist) {
      posts[index].title = title?.innerText || '';
      posts[index].content = content?.innerHTML || '';
      posts[index].startDate = startDate.value;
      posts[index].endDate = endDate.value;
      posts[index].status =
        (status?.innerText as CheckPostStatusType) || CheckPostStatusType.todo;
      setGlobalState('checkposts', posts);
    }
  }

  addTextBoxHandler(): void {
    const content = this.getElement('content');
    const textBox = `
    <div class="box">
      <div contenteditable="true">새 상자</div>
      <button class="box__deleteButton">x</button>
    </div>`;
    if (content) {
      content.innerHTML += textBox;
    }
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
    return `<div id="status" class="post__status ${className}" data-testid="status">${status}</div>`;
  }

  render(): RenderType {
    this.getPost();
    const posts: CheckPostType[] = useGlobalState('checkposts');
    const [post] = posts.filter((p) => p.id === this.state);

    return {
      css: styleSheet,
      eventFuncs: [
        {
          className: 'postnav__addTextBox',
          func: this.addTextBoxHandler,
          type: EventType.click,
        },
      ],
      html: post
        ? `
      <div class="container">
        <div class="post">
          <header class="post__header">
            <div class="post__header__left">
              <div class="post__header__top">
                ${this.getPostStatus(post.status)}
                <h1 id="title" class="post__header__title" contenteditable="true" data-testid="title">${
                  post.title
                }</h1>
                <span class="post__header__dday" data-testid="dday">${getDday(
                  post.endDate
                )}</span>
              </div>
              <div class="post__header__bottom">
                <input id="startdate" type="date" data-testid="startdate" value="${
                  post.startDate
                }" />
                <input id="enddate" type="date" data-testid="enddate" value="${
                  post.endDate
                }" />
              </div>
            </div>
            <div class="post__header__right">
              <button>삭제</button>
            </div>
          </header>
          <div id="content" class="post__content" data-testid="content">
            ${post.content}
          </div>
        </div>
        <nav class="postnav">
          <button class="postnav__addTextBox">txt</button>
          <button class="postnav__addCheckBox">ck</button>
        </nav>
      </div>`
        : '<div>none</div>',
    };
  }
}

createComponent('post-check', CheckPost);

export default CheckPost;
