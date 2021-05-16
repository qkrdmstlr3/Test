import { getByTestId, fireEvent } from '@testing-library/dom';
import '@testing-library/jest-dom/extend-expect';
import Nav from '../Nav';
import '@Lib/state';

const OPACITY_SELECTED = '1';
const OPACITY_NOTSELECTED = '0.4';
let nav: Nav;
let navComponent: HTMLElement;

describe('Nav Component test', () => {
  beforeEach(() => {
    nav = new Nav();
    nav.connectedCallback();
    if (nav.shadowRoot?.childNodes[0]) {
      navComponent = (nav.shadowRoot as unknown) as HTMLElement;
    }
  });

  afterEach(() => {
    nav.disconnectedCallback();
  });

  it('초기 tab이 home인지 확인', () => {
    if (!navComponent) return;

    const home = getByTestId(navComponent, 'home');
    const calendar = getByTestId(navComponent, 'calendar');
    const check = getByTestId(navComponent, 'check');
    const note = getByTestId(navComponent, 'note');

    expect(home.style.opacity).toBe(OPACITY_SELECTED);
    expect(calendar.style.opacity).toBe(OPACITY_NOTSELECTED);
    expect(check.style.opacity).toBe(OPACITY_NOTSELECTED);
    expect(note.style.opacity).toBe(OPACITY_NOTSELECTED);
  });

  it('calendar tab click시 opacity 확인', () => {
    if (!navComponent) return;

    fireEvent.click(getByTestId(navComponent, 'calendar'), { button: 0 });
    const calendar = getByTestId(navComponent, 'calendar');
    const home = getByTestId(navComponent, 'home');
    const check = getByTestId(navComponent, 'check');
    const note = getByTestId(navComponent, 'note');

    expect(home.style.opacity).toBe(OPACITY_NOTSELECTED);
    expect(calendar.style.opacity).toBe(OPACITY_SELECTED);
    expect(check.style.opacity).toBe(OPACITY_NOTSELECTED);
    expect(note.style.opacity).toBe(OPACITY_NOTSELECTED);
  });

  it('check tab click시 opacity 확인', () => {
    if (!navComponent) return;

    fireEvent.click(getByTestId(navComponent, 'check'), { button: 0 });
    const calendar = getByTestId(navComponent, 'calendar');
    const home = getByTestId(navComponent, 'home');
    const check = getByTestId(navComponent, 'check');
    const note = getByTestId(navComponent, 'note');

    expect(home.style.opacity).toBe(OPACITY_NOTSELECTED);
    expect(calendar.style.opacity).toBe(OPACITY_NOTSELECTED);
    expect(check.style.opacity).toBe(OPACITY_SELECTED);
    expect(note.style.opacity).toBe(OPACITY_NOTSELECTED);
  });

  it('note tab click시 opacity 확인', () => {
    if (!navComponent) return;

    fireEvent.click(getByTestId(navComponent, 'note'), { button: 0 });
    const calendar = getByTestId(navComponent, 'calendar');
    const home = getByTestId(navComponent, 'home');
    const check = getByTestId(navComponent, 'check');
    const note = getByTestId(navComponent, 'note');

    expect(home.style.opacity).toBe(OPACITY_NOTSELECTED);
    expect(calendar.style.opacity).toBe(OPACITY_NOTSELECTED);
    expect(check.style.opacity).toBe(OPACITY_NOTSELECTED);
    expect(note.style.opacity).toBe(OPACITY_SELECTED);
  });

  it('snapshot', () => {
    expect(navComponent).toMatchSnapshot();
  });
});
