import { ShellHTML, createComponent } from '@Lib/shell-html';
import styleSheet from './style.scss';

class Check extends ShellHTML {
  render() {
    return {
      css: styleSheet,
      html: `
      <div class="check">
        <subnav-check></subnav-check>
        <div class="content">
          check
        </div>
      </div>`,
    };
  }
}

createComponent('page-check', Check);
