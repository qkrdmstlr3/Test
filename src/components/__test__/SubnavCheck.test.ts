/* dependencies */
import { fireEvent, getByTestId, getByText } from '@testing-library/dom';
import '@testing-library/jest-dom/extend-expect';
import _ from 'lodash';

/* component, state */
import SubnavCheck from '../SubnavCheck';
import '@Lib/state';
import { useGlobalState, setGlobalState } from 'shell-html';

let subnav: SubnavCheck;
let subnavComponent: HTMLElement;

window.confirm = jest.fn(() => true);

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
    setGlobalState('checklist', _.cloneDeep(dummyChecklist));
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

  it('select item test', () => {
    if (!subnavComponent) return;

    fireEvent.click(getByTestId(subnavComponent, dummyChecklist[0].id), {
      button: 0,
    });
    const firstItem = getByTestId(subnavComponent, dummyChecklist[0].id);
    const secondItem = getByTestId(subnavComponent, dummyChecklist[1].id);
    const thirdItem = getByTestId(subnavComponent, dummyChecklist[2].id);

    expect(subnav.state.selectedItem).toBe('list1');
    expect(firstItem.classList.contains('choosed__list')).toBeTruthy();
    expect(secondItem.classList.contains('choosed__list')).toBeFalsy();
    expect(thirdItem.classList.contains('choosed__list')).toBeFalsy();
  });

  it('create new item test', () => {
    if (!subnavComponent) return;

    fireEvent.click(getByTestId(subnavComponent, 'add_button'));
    const lists = useGlobalState('checklist');
    const a = getByText(subnavComponent, '새 목록');

    expect(lists.length).toBe(4);
    expect(a.innerHTML).toContain('새 목록');
  });

  it('change item name test', () => {
    if (!subnavComponent) return;

    const firstItem = getByTestId(subnavComponent, dummyChecklist[0].id);
    const modifyButton = getByTestId(firstItem, 'modify_button');
    fireEvent.click(modifyButton as Element);

    const input = getByTestId(
      subnavComponent.childNodes[0] as HTMLElement,
      'test_input'
    );
    expect(input instanceof HTMLInputElement).toBeTruthy();
    (input as HTMLInputElement).value = '테스트 목록';

    const form = getByTestId(subnavComponent, 'test_form');
    expect(form instanceof HTMLFormElement).toBeTruthy();
    fireEvent.submit(form);

    expect(
      getByTestId(subnavComponent, dummyChecklist[0].id).innerHTML
    ).toContain('테스트 목록');
  });

  it('delete item test', () => {
    if (!subnavComponent) return;

    fireEvent.click(getByTestId(subnavComponent, dummyChecklist[0].id));
    const firstItem = getByTestId(subnavComponent, dummyChecklist[0].id);
    const deleteButton = getByTestId(firstItem, 'delete_button');

    fireEvent.click(deleteButton);
    expect(window.confirm).toBeCalled();

    expect(
      subnavComponent.innerHTML.includes(dummyChecklist[0].name)
    ).toBeFalsy();
  });

  it('snapshot', () => {
    expect(subnavComponent).toMatchSnapshot();
  });
});
