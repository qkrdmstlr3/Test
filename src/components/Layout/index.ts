import {
  ShellHTML,
  createComponent,
  useGlobalState,
  RenderType,
} from '@Lib/shell-html';
import styleSheet from './style.scss';

class Layout extends ShellHTML {
  connectedCallback(): void {
    this.enrollObserving('page');
  }

  disconnectedCallback(): void {
    this.releaseObserving('page');
  }

  render(): RenderType {
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

export default Layout;
