import { ShellHTML, createComponent } from 'shell-html';
import styleSheet from './style.scss';

class Calendar extends ShellHTML {
  render() {
    return {
      css: styleSheet,
      html: `
      <div class="calendar">
        <nav class="subnav">
        </nav>
        <div class="content">
          <calendar-main></calendar-main>
        </div>
      </div>`,
    };
  }
}

createComponent('page-calendar', Calendar);
