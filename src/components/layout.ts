import { Shellact, EventType, createComponent } from '../lib/shellact';
import styleSheet from './layout.scss';

import './child';

class Layout extends Shellact {
  constructor() {
    super('shellboy');
  }

  clickHandler(): void {
    this.setState(this.state + '!');
  }

  render() {
    return {
      html: `
      <div>
        <div class="hello">
          <span>nice</span>
          <span>helloworld ${this.state}</span>
        </div>
        <span>nice</span>
        <layout-child id="1"></layout-child>
        <div>${this.state}</div>
      </div>
      `,
      eventFuncs: [
        {
          className: 'hello',
          func: this.clickHandler,
          type: EventType.click,
        },
      ],
      css: styleSheet,
    };
  }
}

createComponent('layout-ui', Layout);
