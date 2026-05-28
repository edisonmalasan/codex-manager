import { app } from 'electron';
import started from 'electron-squirrel-startup';

import { registerIpcHandlers } from '../ipc/register';
import { initializeMainProcessPersistence } from './persistence';
import { createMainWindow, focusMainWindow } from './windows/main-window';

if (started) {
  app.quit();
}

const gotSingleInstanceLock = app.requestSingleInstanceLock();

if (!gotSingleInstanceLock) {
  app.quit();
} else {
  app.on('second-instance', () => {
    focusMainWindow();
  });

  app.whenReady().then(() => {
    initializeMainProcessPersistence();
    registerIpcHandlers();
    createMainWindow();

    app.on('activate', () => {
      createMainWindow();
    });
  });
}

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
