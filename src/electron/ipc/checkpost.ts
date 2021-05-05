import { ipcMain, BrowserWindow } from 'electron';
import { db } from '../db';

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
}
