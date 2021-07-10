/* dependencies */
import { getByTestId } from '@testing-library/dom';
import '@testing-library/jest-dom/extend-expect';

/* component, state */
import HomeMain from '../HomeMain';
import '@Lib/state';
import { setGlobalState } from 'shell-html';

let homemain: HomeMain;
let homemainComponent: HTMLElement;

const dummyPost1 = {
  dday: '+10',
  id: 10,
  status: '-',
  title: 'title1',
};

const dummyPost2 = {
  dday: '-10',
  id: 11,
  status: 'v',
  title: 'title2',
};

const dummyCheckList = [
  {
    id: 0,
    name: 'name1',
    posts: [dummyPost1, dummyPost2],
  },
];

describe('HomeMain Component test', () => {
  beforeEach(() => {
    homemain = new HomeMain();
    homemain.connectedCallback();
    if (homemain.shadowRoot?.childNodes[0]) {
      homemainComponent = (homemain.shadowRoot as unknown) as HTMLElement;
    }
    setGlobalState('checklist', dummyCheckList);
  });

  afterEach(() => {
    homemain.disconnectedCallback();
  });

  it('렌더링 테스트', () => {
    if (!homemainComponent) return;

    const listName = getByTestId(homemainComponent, 'itemname');
    const post1 = getByTestId(homemainComponent, '10');
    const post2 = getByTestId(homemainComponent, '11');

    expect(listName.innerHTML).toBe(dummyCheckList[0].name);
    expect(post1.innerHTML).toContain(dummyPost1.title);
    expect(post2.innerHTML).toContain(dummyPost2.title);
    expect(post1.innerHTML).toContain(dummyPost1.dday);
    expect(post2.innerHTML).toContain(dummyPost2.dday);
    expect(post1.id).toBe(`${dummyPost1.id}-${dummyCheckList[0].id}`);
    expect(post2.id).toBe(`${dummyPost2.id}-${dummyCheckList[0].id}`);
  });
});
