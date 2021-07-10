import { ShellHTML, createComponent } from 'shell-html';
import styleSheet from './style.scss';

class Note extends ShellHTML {
  render() {
    return {
      css: styleSheet,
      html: `
      <div class="note">
        <nav class="subnav">
        </nav>
        <div class="content">
          note
        </div>
      </div>`,
    };
  }
}

createComponent('page-note', Note);
