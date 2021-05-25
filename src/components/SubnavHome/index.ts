import { ShellHTML, createComponent, RenderType } from '@Lib/shell-html';
import styleSheet from './style.scss';

class SubnavHome extends ShellHTML {
  render(): RenderType {
    return {
      html: `
      <nav class="nav">
      </nav>
      `,
      css: styleSheet,
    };
  }
}

createComponent('subnav-home', SubnavHome);

export default SubnavHome;
