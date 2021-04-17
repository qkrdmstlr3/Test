import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'path';

let mainWindow: Electron.BrowserWindow | null;
const isDev = process.env.NODE_ENV === 'development';

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 660,
    titleBarStyle: 'hidden',
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  if (isDev) {
    mainWindow.loadURL(`http://localhost:3000`);
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(`${path.join(__dirname, '/index.html')}`);
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  ipcMain.on('todo:add', (event, todo) => {
    if (mainWindow) {
      mainWindow.webContents.send('todo:add', todo);
    }
  });
}

app.on('ready', createWindow);
app.allowRendererProcessReuse = true;
