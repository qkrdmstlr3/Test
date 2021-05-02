import { ipcMain, BrowserWindow } from 'electron';
import { db } from '../db';

export default function checkListIpcMain(mainWindow: BrowserWindow): void {
  ipcMain.on('checklist:read:all', async () => {
    const lists = await db.checklist?.find({});

    if (mainWindow) {
      mainWindow.webContents.send('checklist:read:all', lists);
    }
  });

  ipcMain.on('checklist:add', async (event, list) => {
    await db.checklist?.insert(list);
  });
}
