import { ipcRenderer } from 'electron';
import short from 'short-uuid';
import {
  ShellHTML,
  createComponent,
  EventType,
  RenderType,
  useGlobalState,
  setGlobalState,
} from '@Lib/shell-html';
import styleSheet from './style.scss';
import {
  CheckListItemType,
  CheckPostType,
  CheckPostSummaryType,
} from '@Types/types';
import { CheckPostStatusType } from '@Types/enum';
import { getDday } from '@Utils/calcDate';
import getStatusClass from '@Utils/getStatusClass';

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

  /**
   * EventHandler
   */
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
    if (!newName || !newName.length) return;

    const list = useGlobalState('checklist');
    list.forEach((item: CheckListItemType) => {
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
      list.filter(
        (item: CheckListItemType) => item.id !== this.state.selectedItem
      )
    );
    ipcRenderer?.send('checklist:delete', {
      id: this.state.selectedItem,
    });
  }

  createNewCheckPost(): CheckPostType {
    const newContent = `
    <div class="box">
      <h1 contenteditable="true">제목</h1>
      <button class="box__deleteButton">x</button>
    </div>
    <div class="box">
      <div contenteditable="true">새 상자</div>
      <button class="box__deleteButton">x</button>
    </div>
    `
      .trim()
      .replace(/>[ |\n]*</g, '><');
    return {
      id: short.generate(),
      title: '새 게시글',
      status: CheckPostStatusType.todo,
      endDate: '',
      startDate: '',
      content: newContent,
    };
  }

  createCheckPostHandler(event: Event): void {
    event.preventDefault();
    if (!this.state.selectedItem) {
      alert('게시글이 들어갈 리스트를 선택해주십시오');
      return;
    }

    const newCheckPost = this.createNewCheckPost();
    const checkposts = useGlobalState('checkposts');
    const list = useGlobalState('checklist');
    list.forEach((item: CheckListItemType) => {
      if (item.id === this.state.selectedItem) {
        item.posts.push({
          id: newCheckPost.id,
          title: newCheckPost.title,
          dday: getDday(newCheckPost.endDate),
          status: newCheckPost.status,
        });
      }
    });
    ipcRenderer.send('checkpost:add', {
      ...newCheckPost,
      listId: this.state.selectedItem,
    });
    setGlobalState('checkposts', [...checkposts, newCheckPost]);
    setGlobalState('checkpostControl', {
      currentCheckListId: this.state.selectedItem,
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
      currentCheckListId: this.state.selectedItem,
      currentCheckPostId: checkPostId,
    });
  }

  /**
   *  HTML
   */
  getListItemName(id: string, name: string): string {
    const isCurrentItemModifying =
      this.state.toModifyItem && this.state.selectedItem === id;
    if (isCurrentItemModifying) {
      return `
      <form class="accordion__form" data-testid="test_form">
        <input 
          placeholder="목록 이름" 
          value="${name}" 
          class="accordion__input" 
          name="listname" 
          maxlength="13"
          data-testid="test_input"
        />
      </form>`;
    }
    return `<h3 class="accordion__name">${name}</h3>`;
  }

  getListItemHTML({ id, name, posts }: CheckListItemType): string {
    const { selectedItem, toModifyItem } = this.state;
    const ifItemChoosed = selectedItem === id ? 'choosed__list' : '';
    const isStateModify = toModifyItem && selectedItem === id;
    const isSelectedItemAndPostsExist = selectedItem === id && posts.length;

    return `<li class="accordion">
    <header class="accordion__header ${ifItemChoosed}" id="${id}" data-testid="${id}">
      ${this.getListItemName(id, name)}
      <div class="accordion__header__buttons">
      ${
        isStateModify
          ? ''
          : `<button class="accordion__button__modify" data-testid="modify_button">ℳ</button>
        <button class="accordion__button__delete" data-testid="delete_button">✖️</button>`
      }
      </div>
    </header>
    ${isSelectedItemAndPostsExist ? this.getItemPostsHTML(posts) : ''}
  </li>`;
  }

  getItemPostsHTML(posts: CheckPostSummaryType[]): string {
    const postsHTML = posts.reduce(
      (acc, item) => (acc += this.getItemPostHTML(item)),
      ''
    );
    return `<ul class="accordion__list">${postsHTML}</ul>`;
  }

  getItemPostHTML(item: CheckPostSummaryType): string {
    const { currentCheckPostId } = useGlobalState('checkpostControl');
    const ifPostChoosed = currentCheckPostId === item.id ? 'choosed__item' : '';
    return `<div class="accordion__item ${ifPostChoosed}" id="${item.id}">
      <div class="accordion__item__left">
        <div class="accordion__status ${getStatusClass(item.status)}"></div>
        <span>${item.title}</span>
      </div>
      <span>${item.dday}</span>
    </div>`;
  }

  render(): RenderType {
    const list = useGlobalState('checklist');
    const listHTML = list.reduce(
      (acc: string, listItem: CheckListItemType) =>
        (acc += this.getListItemHTML(listItem)),
      ''
    );

    return {
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
    };
  }
}

createComponent('subnav-check', SubnavCheck);

export default SubnavCheck;
