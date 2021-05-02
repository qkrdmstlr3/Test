import {
  ShellHTML,
  createComponent,
  EventType,
  RenderType,
  useGlobalState,
  setGlobalState,
} from '@Lib/shell-html';
import styleSheet from './style.scss';
import { ipcRenderer } from 'electron';
import short from 'short-uuid';

class SubnavCheck extends ShellHTML {
  constructor() {
    super('');
  }

  connectedCallback(): void {
    this.enrollObserving('checklist');

    const list = useGlobalState('checklist');
    if (!list.length) {
      ipcRenderer.send('checklist:read:all');
      ipcRenderer.once('checklist:read:all', (event, list) => {
        setGlobalState('checklist', list);
      });
    }
  }

  disconnectedCallback(): void {
    this.enrollObserving('checklist');
    ipcRenderer.removeAllListeners('checklist:read:all');
  }

  clickAccordionHandler(event: Event): void {
    if (!(event.target instanceof HTMLElement)) return;

    const accordionTitleId = event.target.closest('.accordion__header')?.id;
    if (this.state !== accordionTitleId) {
      this.setState(accordionTitleId);
      return;
    }
    this.setState('');
  }

  clickAddButtonHandler(event: Event): void {
    if (!(event.target instanceof HTMLElement)) return;

    const list = useGlobalState('checklist');
    const newItem = { id: short.generate(), name: '새 목록' };

    setGlobalState('checklist', [...list, newItem]);
    ipcRenderer.send('checklist:add', newItem);
  }

  render(): RenderType {
    const list = useGlobalState('checklist');
    const listHTML = list.reduce(
      (acc: string, { id, name }: { id: string; name: string }) => {
        return (acc += `
      <li class="accordion">
        <header class="accordion__header ${
          this.state === id ? 'choosed' : ''
        }" id="${id}">
          <h3 class="accordion__name">${name}</h3>
          <span>▼</span>
        </header>
      </li>
      `);
      },
      ''
    );

    return {
      css: styleSheet,
      eventFuncs: [
        {
          className: 'accordion__header',
          func: this.clickAccordionHandler,
          type: EventType.click,
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
          <li class="accordion__plus"> + </li>
        </ul>
      </nav>
      `,
    };
  }
}

createComponent('subnav-check', SubnavCheck);
