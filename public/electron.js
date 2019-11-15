const { app, BrowserWindow, ipcMain } = require('electron');

const path = require('path');
const url = require('url');
const isDev = require('electron-is-dev');

var si = require('systeminformation');

let mainWindow;

function createWindow() {
    mainWindow = new BrowserWindow({width: 1100, height: 800, webPreferences: { nodeIntegration: true, webSecurity: false }});
    
    mainWindow.loadURL(isDev ? 'http://localhost:3000' : `file://${path.join(__dirname, '../build/index.html')}`);
  
    mainWindow.on('closed', () => mainWindow = null);    
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

/* Render Processes */
ipcMain.on('arnold-info-msg', (event, arg) => {  
  var systype = (arg ? arg : null);
  //console.log("Received: ", systype);
  
  switch(systype){
    case 'all':
      si.getAllData(function(data) { event.sender.send('arnold-info-reply', {"data":data}); });
      break;
    case 'cpu':    
      si.cpu(function(data) { event.sender.send('arnold-info-reply', {"data":data}); });
      break;        
    default:
      event.sender.send('arnold-info-reply', {"error":"No Data [1]"});
      break;
  }
});