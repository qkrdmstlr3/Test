import { Shellact, createComponent } from '@Lib/shellact';
import styleSheet from './style.scss';

class Layout extends Shellact {
  render() {
    return {
      html: `
      <main class="main">
        <header class="header">
          <span>slly</span>
        </header>
        <div class="body">
          <layout-nav></layout-nav>
          <div class="content"></div>
        </div>
      </main>
      `,
      css: styleSheet,
    };
  }
}

createComponent('layout-main', Layout);
