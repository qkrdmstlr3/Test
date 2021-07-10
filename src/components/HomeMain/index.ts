import { ipcRenderer } from 'electron';
import {
  ShellHTML,
  RenderType,
  createComponent,
  useGlobalState,
  setGlobalState,
  EventType,
} from 'shell-html';
import styleSheet from './style.scss';
import { CheckListItemType, CheckPostSummaryType } from '@Types/types';
import getStatusClass from '@Utils/getStatusClass';

class HomeMain extends ShellHTML {
  connectedCallback(): void {
    this.enrollObserving('checklist');
    this.getList();
  }

  disconnectedCallback(): void {
    this.releaseObserving('checklist');
    ipcRenderer?.removeAllListeners('checklist:read:all');
  }

  getList(): void {
    const list = useGlobalState('checklist');
    if (!list.length) {
      ipcRenderer?.send('checklist:read:all');
      ipcRenderer?.once('checklist:read:all', (event, list) => {
        setGlobalState('checklist', list);
      });
    }
  }

  clickItemHandler(event: Event): void {
    if (!(event.target instanceof HTMLElement)) {
      return;
    }

    const id = event.target.closest('.todolist__item')?.id.split('-');
    if (!id) return;

    const [postId, listId] = id;

    setGlobalState('checkpostControl', {
      currentCheckPostId: postId,
      currentCheckListId: listId,
    });
    setGlobalState('page', 'check');
  }

  getTodoItemHTML(posts: CheckPostSummaryType[], listId: string): string {
    const html = posts.reduce(
      (acc, item) =>
        (acc += `
        <li class="todolist__item" id="${item.id}-${listId}" data-testid="${
          item.id
        }">
          <div>
            <div class="todolist__item__status ${getStatusClass(
              item.status
            )}"></div>
            <h3 class="todolist__item__title">${item.title}</h3>
          </div>
          <span class="todolist__item__dday">${item.dday}</span>
        </li>
      `),
      ''
    );
    return html;
  }

  getTodoListHTML(): string {
    const list: CheckListItemType[] = useGlobalState('checklist') || [];
    const html = list.reduce((acc, item) => {
      const itemsHTML = this.getTodoItemHTML(item.posts, item.id);
      return (acc += `
        <div class="todolist">
          <h2 class="todolist__name" data-testid="itemname">${item.name}</h2>
          <ul class="todolist__list">${itemsHTML}</ul>
        </div>
        `);
    }, '');
    return html;
  }

  render(): RenderType {
    const listHTML = this.getTodoListHTML();

    return {
      html: `
        <div>
          <div class="container__top">
            ${listHTML}
          </div>
        </div>`,
      css: styleSheet,
      eventFuncs: [
        {
          className: 'todolist__item',
          func: this.clickItemHandler,
          type: EventType.click,
        },
      ],
    };
  }
}

createComponent('home-main', HomeMain);

export default HomeMain;
