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
}
