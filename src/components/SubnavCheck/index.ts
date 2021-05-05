import {
  ShellHTML,
  createComponent,
  EventType,
  RenderType,
  useGlobalState,
  setGlobalState,
} from '@Lib/shell-html';
import { CheckListType, CheckPostType } from '@Types/types';
import styleSheet from './style.scss';
import { ipcRenderer } from 'electron';
import short from 'short-uuid';
import { CheckPostStatusType } from '../../types/enum';
import { getDday } from '../../utils/calcDate';

class SubnavCheck extends ShellHTML {
  constructor() {
    super({
      selectedItem: useGlobalState('checkpostControl').currentCheckListId,
      toModifyItem: false,
    });
  }

  connectedCallback(): void {
    this.enrollObserving('checklist');
    this.enrollObserving('checkpostControl');

    this.getList();
  }

  disconnectedCallback(): void {
    this.releaseObserving('checklist');
    this.releaseObserving('checkpostControl');
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

  clickAccordionHeaderHandler(event: Event): void {
    if (!(event.target instanceof HTMLElement)) return;

    const accordionItemId = event.target.closest('.accordion__header')?.id;
    if (this.state.selectedItem !== accordionItemId) {
      this.setState({ selectedItem: accordionItemId, toModifyItem: false });
    } else if (this.state.selectedItem.length && !this.state.toModifyItem) {
      this.setState({ selectedItem: undefined, toModifyItem: false });
    }
  }

  clickAddButtonHandler(event: Event): void {
    if (!(event.target instanceof HTMLElement)) return;

    const list = useGlobalState('checklist');
    const newItem = { id: short.generate(), name: '새 목록' };

    setGlobalState('checklist', [...list, { ...newItem, posts: [] }]);
    ipcRenderer?.send('checklist:add', newItem);
  }

  modifyButtonHandler(event: Event): void {
    if (!(event.target instanceof HTMLElement)) return;

    const accordionItemId = event.target.closest('.accordion__header')?.id;
    if (!this.state.toModifyItem) {
      this.setState({
        selectedItem: accordionItemId,
        toModifyItem: true,
      });
    }
  }

  submitToChangeNameHandler(event: Event): void {
    event.preventDefault();
    if (!(event.target instanceof HTMLFormElement)) return;

    // queryselector사용을 바꾸면 좋을 것 같은데...
    const newName = event.target.querySelector('input')?.value;
    if (!newName || !newName.length) return; //TODO: alert

    const list = useGlobalState('checklist');
    list.forEach((item: CheckListType) => {
      if (item.id === this.state.selectedItem) {
        item.name = newName;
      }
    });

    ipcRenderer?.send('checklist:modify:name', {
      id: this.state.selectedItem,
      newName: newName,
    });
    setGlobalState('checklist', list);
    this.setState({ ...this.state, toModifyItem: false });
  }

  deleteItemHandler(event: Event): void {
    event.preventDefault();
    if (!(event.target instanceof HTMLElement)) return;

    const deleteMessage =
      '하위 글들이 모두 사라집니다.\n 정말 삭제하시겠습니까? ';
    const isDelete = confirm(deleteMessage);
    if (!isDelete) return;

    const list = useGlobalState('checklist');
    setGlobalState(
      'checklist',
      list.filter((item: CheckListType) => item.id !== this.state.selectedItem)
    );
    ipcRenderer?.send('checklist:delete', {
      id: this.state.selectedItem,
    });
  }

  createNewCheckPost(): CheckPostType {
    return {
      id: short.generate(),
      title: '새 게시글',
      status: CheckPostStatusType.todo,
      endDate: '',
      startDate: '',
      content: `
        <h1 contenteditable="true">제목</h1>
        <div contenteditable="true">내용</div>
      `,
    };
  }

  createCheckPostHandler(event: Event): void {
    event.preventDefault();
    // 게시글 id를 전역으로 관리할까말까..? > 하자!
    if (!this.state.selectedItem) {
      alert('게시글이 들어갈 리스트를 선택해주십시오');
      return;
    }

    const newCheckPost = this.createNewCheckPost();
    const checkposts = useGlobalState('checkposts');
    const checkpostControl = useGlobalState('checkpostControl');
    const list = useGlobalState('checklist');
    list.forEach((item: CheckListType) => {
      if (item.id === this.state.selectedItem) {
        item.posts.push({
          id: newCheckPost.id,
          title: newCheckPost.title,
          dday: getDday(newCheckPost.endDate),
        });
      }
    });
    ipcRenderer.send('checkpost:add', {
      ...newCheckPost,
      listId: this.state.selectedItem,
    });
    setGlobalState('checkposts', [...checkposts, newCheckPost]);
    setGlobalState('checkpostControl', {
      ...checkpostControl,
      currentCheckPostId: newCheckPost.id,
    });
    setGlobalState('checklist', list);
  }

  clickCheckPostHandler(event: Event): void {
    event.preventDefault();
    if (!(event.target instanceof HTMLElement)) return;

    const checkPostId = event.target.closest('.accordion__item')?.id;
    const checkpostControl = useGlobalState('checkpostControl');
    if (checkPostId === checkpostControl.currentCheckPostId) return;
    setGlobalState('checkpostControl', {
      ...checkpostControl,
      currentCheckPostId: checkPostId,
    });
  }

  render(): RenderType {
    const list = useGlobalState('checklist');
    const { currentCheckPostId } = useGlobalState('checkpostControl');
    const listHTML = list.reduce(
      (acc: string, { id, name, posts }: CheckListType) =>
        (acc += `
      <li class="accordion">
        <header class="accordion__header ${
          this.state.selectedItem === id ? 'choosed__list' : ''
        }" id="${id}" data-testid="${id}">
          ${
            this.state.toModifyItem && this.state.selectedItem === id
              ? `
              <form class="accordion__form" data-testid="test_form">
                <input 
                  placeholder="목록 이름" 
                  value="${name}" 
                  class="accordion__input" 
                  name="listname" 
                  maxlength="13"
                  data-testid="test_input"
                />
              </form>`
              : `<h3 class="accordion__name">${name}</h3>`
          }
          <div class="accordion__header__buttons">
          ${
            this.state.toModifyItem && this.state.selectedItem === id
              ? ''
              : `<button class="accordion__button__modify" data-testid="modify_button">ℳ</button>
            <button class="accordion__button__delete" data-testid="delete_button">✖️</button>`
          }
          </div>
        </header>
        ${
          this.state.selectedItem === id && posts.length
            ? `<ul class="accordion__list">
            ${posts.reduce(
              (acc, item) =>
                (acc += `
              <div class="accordion__item ${
                currentCheckPostId === item.id ? 'choosed__item' : ''
              }" id="${item.id}">
                <span>${item.title}</span>
                <span>${item.dday}</span>
              </div>
              `),
              ''
            )}
          </ul>`
            : ''
        }
      </li>
      `),
      ''
    );

    return {
      css: styleSheet,
      eventFuncs: [
        {
          className: 'accordion__button__delete',
          func: this.deleteItemHandler,
          type: EventType.click,
        },
        {
          className: 'accordion__header',
          func: this.clickAccordionHeaderHandler,
          type: EventType.click,
        },
        {
          className: 'accordion__button__modify',
          func: this.modifyButtonHandler,
          type: EventType.click,
        },
        {
          className: 'accordion__form',
          func: this.submitToChangeNameHandler,
          type: EventType.submit,
        },
        {
          className: 'accordion__plus',
          func: this.clickAddButtonHandler,
          type: EventType.click,
        },
        {
          className: 'nav__top__button',
          func: this.createCheckPostHandler,
          type: EventType.click,
        },
        {
          className: 'accordion__item',
          func: this.clickCheckPostHandler,
          type: EventType.click,
        },
      ],
      html: `
      <nav class="nav">
        <div class="nav__top">
          <h1 class="nav__top__title">할 일들</h1>
          <button class="nav__top__button">+</button>
        </div>
        <ul class="nav__bottom">
          ${listHTML}
          <li class="accordion__plus" data-testid="add_button"> + </li>
        </ul>
      </nav>
      `,
    };
  }
}

createComponent('subnav-check', SubnavCheck);

export default SubnavCheck;
