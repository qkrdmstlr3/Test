import { state } from '@Lib/shell-html';

state({
  key: 'page',
  initial: 'home',
});

state({
  key: 'checklist',
  initial: [],
});

state({
  key: 'checkpostControl',
  initial: {
    currentCheckListId: undefined,
    currentCheckPostId: undefined,
  },
});

state({
  key: 'checkposts',
  initial: [],
});
