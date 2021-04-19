interface CheckListType {
  [key: string]: ItemType[];
}

interface ItemType {
  title: string;
  date: string;
}

export const dummyChecklist: CheckListType = {
  리스트1: [
    { title: 'title1', date: '+3' },
    { title: 'title2', date: '-4' },
    { title: 'title3', date: '-2' },
    { title: 'title3', date: '-2' },
  ],
  리스트2: [
    { title: 'title4', date: '+3' },
    { title: 'title5', date: '-4' },
  ],
  리스트3: [
    { title: 'title7', date: '+3' },
    { title: 'title8', date: '-4' },
    { title: 'title9', date: '-2' },
    { title: 'title9', date: '-2' },
    { title: 'title9', date: '-2' },
  ],
  리스트4: [{ title: 'title10', date: '+3' }],
};
