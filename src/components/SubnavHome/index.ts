import { ShellHTML, createComponent, RenderType } from '@Lib/shell-html';
import styleSheet from './style.scss';
import { getToday } from '@Utils/calcDate';

class SubnavHome extends ShellHTML {
  getTime: NodeJS.Timeout | undefined;

  constructor() {
    super([]);
  }

  connectedCallback(): void {
    this.getTime = setInterval(() => {
      this.getTimeNow();
    }, 1000);
  }

  disconnectedCallback(): void {
    if (this.getTime) {
      clearInterval(this.getTime);
    }
  }

  getTimeNow(): void {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [_, minute] = getToday();
    this.setState(minute);
  }

  render(): RenderType {
    const [hour, minute, year, month, day, dow] = getToday();

    return {
      html: `
      <nav class="nav">
        <div class="nav__date">${year} . ${month} . ${day}</div>
        <div class="nav__dow">${dow}</div>
        <div class="nav__time">${hour} : ${minute}</div>
      </nav>
      `,
      css: styleSheet,
    };
  }
}

createComponent('subnav-home', SubnavHome);

export default SubnavHome;
