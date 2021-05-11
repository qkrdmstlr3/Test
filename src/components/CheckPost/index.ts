import {
  ShellHTML,
  createComponent,
  RenderType,
  useGlobalState,
  setGlobalState,
  EventType,
} from '@Lib/shell-html';
import styleSheet from './style.scss';
import { CheckListItemType, CheckPostType } from '@Types/types';
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
    // SubnavCheck랑 로직 겹침 공통으로 뺼 것
    const checkpostControl = useGlobalState('checkpostControl');
    const posts = useGlobalState('checkposts');
    const [post] = posts.filter(
      (post: CheckPostType) => post.id === checkpostControl.currentCheckPostId
    );
    if (post) {
      ipcRenderer?.send('checkpost:update', post);
    }

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

    if (posts[index].title !== title?.innerText) {
      this.changeTitle(title?.innerText || '');
    }
    posts[index].title = title?.innerText || '';
    posts[index].content = content?.innerHTML || '';
    posts[index].startDate = startDate.value;
    posts[index].endDate = endDate.value;
    posts[index].status =
      (status?.innerText as CheckPostStatusType) || CheckPostStatusType.todo;
    setGlobalState('checkposts', posts);
  }

  changeTitle(newTitle: string): void {
    const checkpostControl = useGlobalState('checkpostControl');
    const checklist: CheckListItemType[] = _.cloneDeep(
      useGlobalState('checklist')
    );

    checklist.forEach((item) => {
      if (item.id === checkpostControl.currentCheckListId) {
        item.posts.forEach((post) => {
          if (post.id === this.state) {
            post.title = newTitle;
          }
        });
      }
    });
    setGlobalState('checklist', checklist);
  }

  addTextBoxHandler(): void {
    const content = this.getElement('content');
    const textBox = `
    <div class="box">
      <div contenteditable="true">새 상자</div>
      <button class="box__deleteButton">x</button>
    </div>`
      .trim()
      .replace(/>[ |\n]*</g, '><');
    if (content) {
      content.innerHTML += textBox;
    }
  }

  addCheckBoxHandler(): void {
    const content = this.getElement('content');
    const checkBox = `
    <div class="box">
      <div class="checkbox">
        <input type="checkbox">
        <div contenteditable="true">체크 상자</div>
      </div>
      <button class="box__deleteButton">x</button>
    </div>`
      .trim()
      .replace(/>[ |\n]*</g, '><');
    if (content) {
      content.innerHTML += checkBox;
    }
  }

  removeTagHandler(event: Event): void {
    if (!(event.target instanceof HTMLElement)) return;

    const parentTag = event.target.closest('.box');
    if (parentTag) {
      const content = this.getElement('content');
      content?.removeChild(parentTag);
    }
  }

  endDateChangeHandler(event: Event): void {
    if (!(event.target instanceof HTMLInputElement)) return;

    const dday = this.getElement('dday');
    if (!dday) return;
    dday.innerText = getDday(event.target?.value);
  }

  saveButtonHandler(): void {
    this.savePost();
    const checkpostControl = useGlobalState('checkpostControl');
    const posts = useGlobalState('checkposts');
    const [post] = posts.filter(
      (post: CheckPostType) => post.id === checkpostControl.currentCheckPostId
    );
    if (post) {
      ipcRenderer?.send('checkpost:update', post);
    }
  }

  deleteButtonHandler(): void {
    const deleteMessage = '정말 삭제하시겠습니까?';
    const isDelete = confirm(deleteMessage);
    if (!isDelete) return;

    const checkpostControl = useGlobalState('checkpostControl');
    const posts: CheckPostType[] = _.cloneDeep(useGlobalState('checkposts'));
    const checklist: CheckListItemType[] = _.cloneDeep(
      useGlobalState('checklist')
    );
    posts.filter((post) => post.id !== this.state);

    checklist.forEach((item) => {
      if (item.id === checkpostControl.currentCheckListId) {
        item.posts = item.posts.filter((post) => post.id !== this.state);
      }
    });
    setGlobalState('checklist', checklist);
    setGlobalState('checkposts', posts);
    setGlobalState('checkpostControl', {
      ...checkpostControl,
      currentCheckPostId: undefined,
    });
    ipcRenderer?.send('checkpost:delete', { id: this.state });
    this.setState(undefined);
  }

  changeStateHandler(event: Event): void {
    if (!(event.target instanceof HTMLElement)) return;

    const nextStatus = {
      [CheckPostStatusType.todo]: {
        status: CheckPostStatusType.doing,
        oldClass: 'status__todo',
        newClass: 'status__doing',
      },
      [CheckPostStatusType.doing]: {
        status: CheckPostStatusType.done,
        oldClass: 'status__doing',
        newClass: 'status__done',
      },
      [CheckPostStatusType.done]: {
        status: CheckPostStatusType.todo,
        oldClass: 'status__done',
        newClass: 'status__todo',
      },
    };
    const statusComponent = this.getElement('status');
    if (!statusComponent) return;

    const { status, oldClass, newClass } = nextStatus[
      event.target.innerText as CheckPostStatusType
    ];
    statusComponent.innerText = status;
    statusComponent.classList.replace(oldClass, newClass);
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
        {
          className: 'postnav__addCheckBox',
          func: this.addCheckBoxHandler,
          type: EventType.click,
        },
        {
          className: 'box__deleteButton',
          func: this.removeTagHandler,
          type: EventType.click,
        },
        {
          className: 'post__header__endDate',
          func: this.endDateChangeHandler,
          type: EventType.change,
        },
        {
          className: 'post__status',
          func: this.changeStateHandler,
          type: EventType.click,
        },
        {
          className: 'post__header__saveButton',
          func: this.saveButtonHandler,
          type: EventType.click,
        },
        {
          className: 'post__header__deleteButton',
          func: this.deleteButtonHandler,
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
                <span id="dday" class="post__header__dday" data-testid="dday">${getDday(
                  post.endDate
                )}</span>
              </div>
              <div class="post__header__bottom">
                <input id="startdate" name="startDate" type="date" data-testid="startdate" value="${
                  post.startDate
                }" />
                <input id="enddate" name="endDate" class="post__header__endDate" type="date" data-testid="enddate" value="${
                  post.endDate
                }" />
              </div>
            </div>
            <div class="post__header__right">
              <button class="post__header__saveButton">저장</button>
              <button class="post__header__deleteButton">삭제</button>
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
