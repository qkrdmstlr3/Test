import { ShellHTML, createComponent, EventType } from '@Lib/shell-html';
import styleSheet from './style.scss';
import { dummyChecklist } from '../../common/data/dummyData';

class SubnavCheck extends ShellHTML {
  constructor() {
    super('');
  }

  clickNameHandler(event: Event) {
    if (!(event.target instanceof HTMLElement)) return;

    const accordionTitleId = event.target.closest('.accordion__header')?.id;
    if (this.state !== accordionTitleId) {
      this.setState(accordionTitleId);
      return;
    }
    this.setState('');
  }

  render() {
    const listNames = Object.keys(dummyChecklist);
    const list = listNames.reduce((acc: string, name: string) => {
      return (acc += `
      <li class="accordion">
        <header class="accordion__header ${
          this.state === name ? 'choosed' : ''
        }" id="${name}">
          <h3 class="accordion__name">${name}</h3>
          <span>▼</span>
        </header>
        ${
          this.state === name
            ? `<ul class="accordion__list">
          ${dummyChecklist[name].reduce((acc: string, { title, date }) => {
            return (acc += `
              <li class="accordion__item">
                <h4 class="accordion__item__name ${title}">${title}</h4>
                <span>${date}</span>
              </li>
            `);
          }, '')}
        </ul>`
            : ''
        }
      </li>
      `);
    }, '');

    return {
      css: styleSheet,
      eventFuncs: [
        {
          className: 'accordion__header',
          func: this.clickNameHandler,
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
          ${list}
        </ul>
      </nav>
      `,
    };
  }
}

createComponent('subnav-check', SubnavCheck);
