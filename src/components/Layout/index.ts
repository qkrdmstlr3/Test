import { Shellact, createComponent } from '@Lib/shellact';
import styleSheet from './style.scss';

class Layout extends Shellact {
  render() {
    return {
      html: `
      <div class="layout">
        <header class="header">
          <span>slly</span>
        </header>
        <main class="main">
          <layout-nav></layout-nav>
          <page-home></page-home>
        </main>
      </div>
      `,
      css: styleSheet,
    };
  }
}

createComponent('layout-main', Layout);
