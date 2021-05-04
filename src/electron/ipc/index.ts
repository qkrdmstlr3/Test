import { BrowserWindow } from 'electron';
import checkListIpcMain from './checklist';

export default function ipcMain(mainWindow: BrowserWindow): void {
  checkListIpcMain(mainWindow);
}
