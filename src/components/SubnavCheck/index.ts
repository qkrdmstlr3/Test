import {
  ShellHTML,
  createComponent,
  EventType,
  RenderType,
  useGlobalState,
  setGlobalState,
} from '@Lib/shell-html';
import { CheckListType } from '@Types/types';
import styleSheet from './style.scss';
import { ipcRenderer } from 'electron';
import short from 'short-uuid';

class SubnavCheck extends ShellHTML {
  constructor() {
    super({
      selectedItem: '',
      toModifyItem: false,
    });
  }

  connectedCallback(): void {
    this.enrollObserving('checklist');

    const list = useGlobalState('checklist');
    if (!list.length) {
      ipcRenderer?.send('checklist:read:all');
      ipcRenderer?.once('checklist:read:all', (event, list) => {
        list.forEach((item: CheckListType) => (item.posts = []));
        setGlobalState('checklist', list);
      });
    }
  }

  disconnectedCallback(): void {
    this.enrollObserving('checklist');
    ipcRenderer?.removeAllListeners('checklist:read:all');
  }

  clickAccordionHeaderHandler(event: Event): void {
    if (!(event.target instanceof HTMLElement)) return;

    const accordionItemId = event.target.closest('.accordion__header')?.id;
    if (this.state.selectedItem !== accordionItemId) {
      this.setState({ selectedItem: accordionItemId, toModifyItem: false });
    } else if (this.state.selectedItem.length && !this.state.toModifyItem) {
      this.setState({ selectedItem: '', toModifyItem: false });
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
      return;
    }
  }

  submitToChangeNameHandler(event: Event): void {
    event.preventDefault();
    if (!(event.target instanceof HTMLFormElement)) return;

    // queryselector사용을 바꾸면 좋을 것 같은데...
    const listname = event.target.querySelector('input')?.value;
    if (!listname || !listname.length) return; //TODO: alert

    const lists = useGlobalState('checklist');
    lists.forEach((list: CheckListType) => {
      if (list.id === this.state.selectedItem) {
        list.name = listname;
      }
    });

    ipcRenderer?.send('checklist:modify:name', {
      id: this.state.selectedItem,
      newName: listname,
    });
    setGlobalState('checklist', lists);
    this.setState({ ...this.state, toModifyItem: false });
  }

  render(): RenderType {
    const list = useGlobalState('checklist');
    const listHTML = list.reduce(
      (acc: string, { id, name }: { id: string; name: string }) =>
        (acc += `
      <li class="accordion">
        <header class="accordion__header ${
          this.state.selectedItem === id ? 'choosed' : ''
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
            <button class="accordion__button__delete">✖️</button>`
          }
          </div>
        </header>
      </li>
      `),
      ''
    );

    return {
      css: styleSheet,
      eventFuncs: [
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
