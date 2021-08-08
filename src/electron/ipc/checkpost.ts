import { ipcMain, BrowserWindow } from 'electron';
import { db } from '../db';
import { CheckPostType } from '../../types/types';

export default function checkListIpcMain(mainWindow: BrowserWindow): void {
  ipcMain.on('checkpost:add', async (event, newPost) => {
    await db.checkpost?.insert(newPost);
  });

  ipcMain.on('checkpost:getPost', async (event, data) => {
    const post = await db.checkpost?.findOne({ id: data.id });

    if (mainWindow) {
      mainWindow.webContents.send('checkpost:getPost', post);
    }
  });

  ipcMain.on('checkpost:getPosts:date', async (event, data) => {
    const { year, month } = data;
    const posts = await db.checkpost?.find(
      {},
      { id: 1, title: 1, status: 1, endDate: 1, startDate: 1, listId: 1 }
    );
    const filteredPost = posts?.filter((post) => {
      const [year1, month1] = (post.startDate as string).split('-');
      const [year2, month2] = (post.endDate as string).split('-');
      if (
        Number(year1) <= year &&
        Number(year2) >= year &&
        Number(month1) <= month &&
        Number(month2) >= month
      )
        return true;
    });

    const result = { posts: filteredPost, month };
    if (mainWindow) {
      mainWindow.webContents.send('checkpost:getPosts:date', result);
    }
  });

  ipcMain.on('checkpost:update', async (event, data) => {
    const post = (await (db.checkpost?.findOne({
      id: data.id,
    }) as unknown)) as CheckPostType;

    const isChangeExits =
      post.content !== data.content ||
      post.endDate !== data.endDate ||
      post.startDate !== data.startDate ||
      post.status !== data.status ||
      post.title !== data.title;
    if (data && isChangeExits) {
      await db.checkpost?.update(
        { id: data.id },
        {
          $set: {
            content: data.content,
            endDate: data.endDate,
            startDate: data.startDate,
            status: data.status,
            title: data.title,
          },
        }
      );
    }
  });

  ipcMain.on('checkpost:delete', async (event, data) => {
    await db.checkpost?.remove({ id: data.id }, {});
  });
}
