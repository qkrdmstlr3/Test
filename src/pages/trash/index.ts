import { ShellHTML, createComponent } from '@Lib/shell-html';
import styleSheet from './style.scss';

class Trash extends ShellHTML {
  render() {
    return {
      css: styleSheet,
      html: `
      <div class="trash">
        <nav class="subnav">
        </nav>
        <div class="content">
          trash
        </div>
      </div>`,
    };
  }
}

createComponent('page-trash', Trash);
