import { RenderType, EventFuncType } from './type';

class Shellact extends HTMLElement {
  state: unknown;

  // TODO: 첫 째 인자로 받은 props를 두 번째 인자로 component의 state를 보냄
  constructor(props: unknown = null) {
    super();
    this.state = props; // TODO: 불변성 보장해야됨

    this.attachShadow({ mode: 'open' });
    const element = this.render();

    if (element && this.shadowRoot) {
      this.renderFirst(element, this.shadowRoot);
    }
  }

  /**
   * HTMLElement Functions
   */
  connectedCallback(): void {
    // overriding
  }

  disconnectedCallback(): void {
    // overriding
  }

  // TODO: 자식의 super의 인자로 props를 넘겨주어서 상태로 저장하고 변경하면 리렌더링하는 방식
  // static get observedAttributes() {}
  // arrtibuteChangedCallback(attrName, oldVal, newVal) {}

  /**
   * DOM Tree
   */
  compareNodeTree(oldDOM: ShadowRoot, newDOM: HTMLElement): void {
    // TODO: 두 돔 트리를 비교하고 알맞은 html 리렌더링시켜준다
    if (oldDOM.hasChildNodes()) {
      console.log(oldDOM.childNodes);
    }
  }

  /**
   * state
   */
  setState(state: unknown): void {
    if (this.state !== state) {
      this.state = state;

      const element = this.render(); // html만 검사해서 바꾼다.
      if (element && element.html) {
        this.rerender(element.html);
      }
    }
  }

  /**
   * Rendering
   */
  render(): RenderType | void {
    // overriding
  }

  renderFirst({ html, eventFuncs, css }: RenderType, dom: ShadowRoot): void {
    dom.innerHTML = html.trim();

    if (css) {
      this.renderCSS(css, dom);
    }

    /* ShadowRoot Event Delegation */
    eventFuncs.forEach((eventFunc) => this.eventDelegation(eventFunc, dom));
  }

  renderCSS(css: string, dom: ShadowRoot): void {
    const style = document.createElement('style');
    style.appendChild(document.createTextNode(css));
    dom.appendChild(style);
  }

  eventDelegation(
    { className, func, type }: EventFuncType,
    dom: ShadowRoot
  ): void {
    dom.addEventListener(type, (event: Event) => {
      event.stopPropagation();

      const isCorrectElement =
        event.target instanceof HTMLElement &&
        event.target.classList.contains(className);
      if (isCorrectElement) {
        func.call(this, event);
      }
    });
  }

  rerender(html: string): void {
    // TODO: only check html
  }
}

export default Shellact;
