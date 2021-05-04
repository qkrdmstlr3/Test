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

  ipcMain.on('checklist:modify:name', async (event, data) => {
    await db.checklist?.update(
      { id: data.id },
      { $set: { name: data.newName } }
    );
  });

  ipcMain.on('checklist:delete', async (event, data) => {
    await db.checklist?.remove({ id: data.id }, {});
  });
}
