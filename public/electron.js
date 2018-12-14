const { app, BrowserWindow } = require('electron');

const path = require('path');
const url = require('url');
const isDev = require('electron-is-dev');


let mainWindow;

function createWindow() {
    mainWindow = new BrowserWindow({width: 1100, height: 800, webPreferences: { webSecurity: false}});
    // Dev Tools
    mainWindow.webContents.openDevTools();

    mainWindow.loadURL(isDev ? 'http://localhost:3000' : `file://${path.join(__dirname, '../build/index.html')}`);
  
    mainWindow.on('closed', () => mainWindow = null);
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});