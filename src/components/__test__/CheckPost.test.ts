/* dependencies */
import { getByTestId } from '@testing-library/dom';
import '@testing-library/jest-dom/extend-expect';
import _ from 'lodash';

/* component, state */
import CheckPost from '../CheckPost';
import '@Lib/state';
import { setGlobalState } from '@Lib/shell-html';

let checkPost: CheckPost;
let checkPostComponent: HTMLElement;

const dummyPost = {
  id: 'dummypost',
  title: 'Title',
  status: 'doing',
  startDate: '2021-03-20',
  endDate: '2021-06-15',
  content: `<div>
    <h2>Hellllo</h2>
    <div>content</div>
  </div>`,
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
    expect(status.innerHTML).toContain('⎯');
    expect(startDate.value).toBe(dummyPost.startDate);
    expect(endDate.value).toBe(dummyPost.endDate);
  });
});
