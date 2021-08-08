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
    const monthWithPad = `${month}`.padStart(2, '0');
    const posts = await db.checkpost?.find(
      {
        startDate: { $gte: `${year}-${monthWithPad}-1` },
        endDate: { $lte: `${year}-${monthWithPad}-31` },
      },
      { id: 1, title: 1, status: 1, endDate: 1, startDate: 1, listId: 1 }
    );

    const result = { posts, month };
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
