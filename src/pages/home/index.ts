import { Shellact, createComponent } from '@Lib/shellact';
import styleSheet from './style.scss';

class Home extends Shellact {
  render() {
    return {
      css: styleSheet,
      html: `
      <div class="home">
        <nav class="subnav">
        </nav>
        <div class="content">
          home
        </div>
      </div>`,
    };
  }
}

createComponent('page-home', Home);
