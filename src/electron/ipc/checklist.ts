import { ipcMain, BrowserWindow } from 'electron';
import { db } from '../db';
import { getDday } from '../../utils/calcDate';
import { CheckPostSummaryType } from '../../types/types';
import { CheckPostStatusType } from '@Types/enum';

export default function checkListIpcMain(mainWindow: BrowserWindow): void {
  ipcMain.on('checklist:read:all', async () => {
    const lists =
      (await db.checklist
        ?.find({}, { id: 1, name: 1, updatedAt: 1 })
        .sort({ updatedAt: 1 })) || [];
    const posts =
      (await db.checkpost
        ?.find({}, { id: 1, title: 1, endDate: 1, listId: 1, status: 1 })
        .sort({ updatedAt: 1 })) || [];

    const newList = [...Array(lists?.length || 0)];
    const newListPlusPosts = newList.map((_, i) => {
      const { id, name } = lists[i];
      const newItem = {
        id: id as string,
        name: name as string,
        posts: [] as Array<CheckPostSummaryType>,
      };
      posts.map((post) => {
        const { id: postId, title, endDate, listId, status } = post;
        if (listId === id) {
          const newPost = {
            id: postId as string,
            title: title as string,
            dday: getDday(endDate as string),
            status: status as CheckPostStatusType,
          };
          newItem.posts.push(newPost);
        }
      });

      return newItem;
    });

    if (mainWindow) {
      mainWindow.webContents.send('checklist:read:all', newListPlusPosts);
    }
  });

  ipcMain.on('checklist:add', async (event, list) => {
    await db.checklist?.insert(list);
  });

  ipcMain.on('checklist:modify:name', async (event, data) => {
    await db.checklist?.update(
      { id: data.id },
      { $set: { name: data.newName } }
    );
  });

  ipcMain.on('checklist:delete', async (event, data) => {
    await db.checklist?.remove({ id: data.id }, {});
    await db.checkpost?.remove({ listId: data.id }, { multi: true });
  });
}
