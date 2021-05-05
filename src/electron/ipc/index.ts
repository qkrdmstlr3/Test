import { BrowserWindow } from 'electron';
import checkListIpcMain from './checklist';
import checkPostIpcMain from './checkpost';

export default function ipcMain(mainWindow: BrowserWindow): void {
  checkListIpcMain(mainWindow);
  checkPostIpcMain(mainWindow);
}
