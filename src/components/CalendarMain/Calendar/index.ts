import { ShellHTML, createComponent } from 'shell-html';
import styleSheet from './style.scss';

class Calendar extends ShellHTML {
  render() {
    return {
      html: `<div>hello</div>`,
      css: styleSheet,
    };
  }
}

createComponent('calendar-calendar', Calendar);
