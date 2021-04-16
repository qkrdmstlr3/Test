import { Shellact, createComponent, EventType } from '../lib/shellact';
import { ipcRenderer } from 'electron';

class Child extends Shellact {
  constructor() {
    super('tallmurf');
  }

  connectedCallback() {
    // overload
    ipcRenderer.on('todo:add', () => {
      this.setState(this.state + '!');
    });
  }

  disconnectedCallback() {
    ipcRenderer.removeAllListeners('todo:add');
  }

  clickHandler(): void {
    ipcRenderer.send('todo:add', 'todo');
  }

  render() {
    return {
      html: `
      <div>
        <div class="child">I'm child ${this.state}</div>
        <button>yoo</button>
      </div>
      `,
      eventFuncs: [
        {
          className: 'child',
          func: this.clickHandler,
          type: EventType.click,
        },
      ],
    };
  }
}

createComponent('layout-child', Child);
