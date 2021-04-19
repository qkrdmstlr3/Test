import { ShellHTML, createComponent, EventType } from '@Lib/shell-html';
import styleSheet from './style.scss';
import { dummyChecklist } from '../../common/data/dummyData';

class SubnavCheck extends ShellHTML {
  constructor() {
    super('');
  }

  clickNameHandler(event: Event) {
    if (!event.target || !(event.target instanceof HTMLElement)) return;

    const accordionTitleClass = event.target.closest('.accordion')?.classList;
    accordionTitleClass?.toggle('choosed');
  }

  render() {
    const listNames = Object.keys(dummyChecklist);

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
        ${listNames.reduce((acc: string, name: string) => {
          return (acc += `
          <div class="accordion">
            <header class="accordion__header ${
              this.state === name ? 'choosed' : ''
            }" id="${name}">
              <h3 class="accordion__name">${name}</h3>
              <span>▼</span>
            </header>
            <ul class="accordion__list">
              ${dummyChecklist[name].reduce((acc: string, { title, date }) => {
                return (acc += `
                  <li class="accordion__item">
                    <h4 class="accordion__item__name ${title}">${title}</h4>
                    <span>${date}</span>
                  </li>
                `);
              }, '')}
            </ul>
          </div>
          `);
        }, '')}
      </nav>
      `,
    };
  }
}

createComponent('subnav-check', SubnavCheck);
