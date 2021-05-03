import { fireEvent, getByTestId, getByText } from '@testing-library/dom';
import '@testing-library/jest-dom/extend-expect';
import SubnavCheck from '../SubnavCheck';
import '@Lib/state';
import { useGlobalState, setGlobalState } from '@Lib/shell-html';

let subnav: SubnavCheck;
let subnavComponent: HTMLElement;

const dummyChecklist = [
  { id: 'list1', name: '리스트1', posts: [] },
  { id: 'list2', name: '리스트2', posts: [] },
  { id: 'list3', name: '리스트3', posts: [] },
];

describe('SubnavCheck Component test', () => {
  beforeEach(() => {
    subnav = new SubnavCheck();
    subnav.connectedCallback();
    if (subnav.shadowRoot?.childNodes[0]) {
      subnavComponent = (subnav.shadowRoot as unknown) as HTMLElement;
    }
    setGlobalState('checklist', dummyChecklist);
  });

  afterEach(() => {
    subnav.disconnectedCallback();
  });

  it('list rendering test', () => {
    if (!subnavComponent) return;

    dummyChecklist.forEach((item) => {
      const list = getByTestId(subnavComponent, item.id);
      expect(list.innerHTML).toContain(item.name);
    });
  });

  it('select list test', () => {
    if (!subnavComponent) return;

    fireEvent.click(getByTestId(subnavComponent, dummyChecklist[0].id), {
      button: 0,
    });
    const firstItem = getByTestId(subnavComponent, dummyChecklist[0].id);
    const secondItem = getByTestId(subnavComponent, dummyChecklist[1].id);
    const thirdItem = getByTestId(subnavComponent, dummyChecklist[2].id);

    expect(subnav.state.selectedItem).toBe('list1');
    expect(firstItem.classList.contains('choosed')).toBeTruthy();
    expect(secondItem.classList.contains('choosed')).toBeFalsy();
    expect(thirdItem.classList.contains('choosed')).toBeFalsy();
  });

  it('create new list test', () => {
    if (!subnavComponent) return;

    fireEvent.click(getByTestId(subnavComponent, 'add_button'));
    const lists = useGlobalState('checklist');
    const a = getByText(subnavComponent, '새 목록');

    expect(lists.length).toBe(4);
    expect(a.innerHTML).toContain('새 목록');
  });

  it('snapshot', () => {
    expect(subnavComponent).toMatchSnapshot();
  });
});
