import { getByText } from '@testing-library/dom';
import '@testing-library/jest-dom/extend-expect';
import Layout from '../Layout';
import '@Lib/state';

let layout: Layout;
let layoutComponent: HTMLElement;

describe('Layout Component test', () => {
  beforeEach(() => {
    layout = new Layout();
    if (layout.shadowRoot?.childNodes[0]) {
      layoutComponent = (layout.shadowRoot as unknown) as HTMLElement;
    }
  });

  it('title 확인', () => {
    if (!layoutComponent) return;

    const slly = getByText(layoutComponent, 'slly');
    expect(slly.innerHTML).toBe('slly');
  });

  it('초기 페이지가 home 페이지인지 확인', () => {
    if (!layoutComponent) return;

    expect(layoutComponent.innerHTML).toContain('<page-home></page-home>');
  });

  it('snapshot', () => {
    expect(layoutComponent).toMatchSnapshot();
  });
});
