import { ShellHTML, RenderType, createComponent } from '@Lib/shell-html';
import styleSheet from './style.scss';

class HomeMain extends ShellHTML {
  render(): RenderType {
    return {
      html: `<div>home</div>`,
      css: styleSheet,
    };
  }
}

createComponent('home-main', HomeMain);

export default HomeMain;
