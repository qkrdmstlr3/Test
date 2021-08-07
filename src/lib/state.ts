import { state } from 'shell-html';

state({
  key: 'page',
  initial: 'calendar',
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

state({
  key: 'dateInfo',
  initial: {
    date: new Date(),
    selectedYear: null,
    selectedMonth: null,
    selectedDay: null,
  },
});
