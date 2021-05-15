/* dependencies */
import { getByTestId, fireEvent, getByText } from '@testing-library/dom';
import '@testing-library/jest-dom/extend-expect';
import { getDday } from '../../utils/calcDate';
import _ from 'lodash';

/* component, state */
import CheckPost from '../CheckPost';
import '@Lib/state';
import { setGlobalState } from '@Lib/shell-html';

let checkPost: CheckPost;
let checkPostComponent: HTMLElement;

window.confirm = jest.fn(() => true);

const dummyPost = {
  id: 'dummypost',
  title: 'Title',
  status: '-',
  startDate: '2021-03-20',
  endDate: '2021-06-15',
  content: `
    <div class="box">
      <div contenteditable="true">내용</div>
      <button class="box__deleteButton" data-testid="textboxDelete">x</button>
    </div>
  `,
};

describe('CheckPost Component test', () => {
  beforeEach(() => {
    checkPost = new CheckPost();
    checkPost.connectedCallback();
    if (checkPost.shadowRoot?.childNodes[0]) {
      checkPostComponent = (checkPost.shadowRoot as unknown) as HTMLElement;
    }
    setGlobalState('checkposts', [_.cloneDeep(dummyPost)]);
    setGlobalState('checkpostControl', {
      currentCheckListId: undefined,
      currentCheckPostId: dummyPost.id,
    });
  });

  afterEach(() => {
    checkPost.disconnectedCallback();
  });

  it('post rendering test', () => {
    if (!checkPostComponent) return;

    const title = getByTestId(checkPostComponent, 'title');
    const content = getByTestId(checkPostComponent, 'content');
    const status = getByTestId(checkPostComponent, 'status');
    const startDate = getByTestId(
      checkPostComponent,
      'startdate'
    ) as HTMLInputElement;
    const endDate = getByTestId(
      checkPostComponent,
      'enddate'
    ) as HTMLInputElement;

    expect(title.innerHTML).toContain(dummyPost.title);
    expect(content.innerHTML).toContain(
      dummyPost.content.trim().replace(/>[ |\n]*</g, '><')
    );
    expect(status.innerHTML).toContain('-');
    expect(startDate.value).toBe(dummyPost.startDate);
    expect(endDate.value).toBe(dummyPost.endDate);
  });

  it('add textbox test', () => {
    if (!checkPostComponent) return;

    const addButton = getByTestId(checkPostComponent, 'addTextBox');
    fireEvent.click(addButton);

    const textBox = getByText(checkPostComponent, '새 상자');
    expect(textBox.innerHTML).toBe('새 상자');
  });

  it('add checkbox test', () => {
    if (!checkPostComponent) return;

    const addButton = getByTestId(checkPostComponent, 'addCheckBox');
    fireEvent.click(addButton);

    const textBox = getByText(checkPostComponent, '체크 상자');
    expect(textBox.innerHTML).toBe('체크 상자');
  });

  it('delete checkbox', () => {
    if (!checkPostComponent) return;

    const deleteButton = getByTestId(checkPostComponent, 'textboxDelete');
    fireEvent.click(deleteButton);

    expect(checkPostComponent.innerHTML.includes('내용')).toBeFalsy();
  });

  it('status change', () => {
    if (!checkPostComponent) return;

    const doingStatus = getByTestId(checkPostComponent, 'status');
    expect(doingStatus.classList.contains('status__doing')).toBeTruthy();
    fireEvent.click(doingStatus);

    const doneStatus = getByTestId(checkPostComponent, 'status');
    expect(doneStatus.classList.contains('status__done')).toBeTruthy();
    fireEvent.click(doneStatus);

    const todoStatus = getByTestId(checkPostComponent, 'status');
    expect(todoStatus.classList.contains('status__todo')).toBeTruthy();
  });

  it('delete post test', () => {
    if (!checkPostComponent) return;

    const deleteButton = getByTestId(checkPostComponent, 'delete_button');
    fireEvent.click(deleteButton);
    expect(checkPostComponent.innerHTML.includes('none')).toBeTruthy();
  });

  it('endDate change test', () => {
    if (!checkPostComponent) return;

    const currentDdayDiv = getByTestId(checkPostComponent, 'dday');
    const currentDate = getDday('2021-06-15');
    expect(currentDdayDiv.innerHTML).toBe(currentDate);

    const endDateInput = getByTestId(checkPostComponent, 'enddate');
    fireEvent.change(endDateInput, { target: { value: '2021-07-10' } });

    const changedDdayDiv = getByTestId(checkPostComponent, 'dday');
    const changedDate = getDday('2021-07-10');
    expect(changedDdayDiv.innerHTML).toBe(changedDate);
  });

  it('snapshot', () => {
    expect(checkPostComponent).toMatchSnapshot();
  });
});
