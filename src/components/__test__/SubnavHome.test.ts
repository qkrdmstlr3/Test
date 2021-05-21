import SubnavHome from '../SubnavHome';

let subnav: SubnavHome;
let subnavComponent: HTMLElement;

describe('SubnavHome Component test', () => {
  beforeEach(() => {
    subnav = new SubnavHome();
    if (subnav.shadowRoot?.childNodes[0]) {
      subnavComponent = (subnav.shadowRoot as unknown) as HTMLElement;
    }
  });

  it('snapshot', () => {
    expect(subnavComponent).toMatchSnapshot();
  });
});
