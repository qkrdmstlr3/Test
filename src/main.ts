import { app, BrowserWindow, ipcMain } from 'electron';
import { autoUpdater } from 'electron-updater';
import electronLog from 'electron-log';
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

// updater
autoUpdater.on('checking-for-update', () => {
  electronLog.info('업데이트 확인 중...');
});

autoUpdater.on('update-available', () => {
  electronLog.info('업데이트가 가능합니다');
});

autoUpdater.on('update-not-available', () => {
  electronLog.info('현재 최신버전입니다');
});

autoUpdater.on('error', (err) => {
  electronLog.info('에러가 발생했습니다 : ' + err);
});

autoUpdater.on('download-progress', (progressObj) => {
  let log_message = '다운로드 속도: ' + progressObj.bytesPerSecond;
  log_message = log_message + ' - 현재 ' + progressObj.percent + '%';
  log_message =
    log_message +
    ' (' +
    progressObj.transferred +
    '/' +
    progressObj.total +
    ')';
  electronLog.info(log_message);
});

autoUpdater.on('update-downloaded', () => {
  electronLog.info('업데이트가 완료되었습니다');
});

app.on('ready', () => {
  createWindow();
  autoUpdater.checkForUpdates();
});
app.allowRendererProcessReuse = true;
