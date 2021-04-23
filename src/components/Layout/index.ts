import { ShellHTML, createComponent, useGlobalState } from '@Lib/shell-html';
import styleSheet from './style.scss';

class Layout extends ShellHTML {
  connectedCallback() {
    this.enrollObserving('page');
  }

  disconnectedCallback() {
    this.releaseObserving('page');
  }

  render() {
    const pageName = useGlobalState('page');

    return {
      html: `
      <div class="layout">
        <header class="header">
          <span>slly</span>
        </header>
        <main class="main">
          <layout-nav></layout-nav>
          <page-${pageName}></page-${pageName}>
        </main>
      </div>
      `,
      css: styleSheet,
    };
  }
}

createComponent('layout-main', Layout);
