const { app, BrowserWindow,ipcMain } = require('electron');
const path = require('path');
const axios = require('axios');


if (require('electron-squirrel-startup')) {
  app.quit();
}

const createWindow = () => {

  const startUrl = process.env.ELECTRON_START_URL || 'http://localhost:3000';
  const mainWindow = new BrowserWindow({
    width: 1920,
    height: 1080,
    webPreferences: {
      preload: path.join(__dirname,'..','renderer','main_window','preload.js'),
      nodeIntegration: false
    },
    autoHideMenuBar:true,
    contextIsolation: true,
    enableRemoteModule: false
  });

  // and load the index.html of the app.
  mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);

  ipcMain.handle('fetch-data', async (event, url) => {
    try {
        const response = await axios.get(url);
        return response.data;
    } catch (error) {
        console.error("Error fetching data:", error);
        throw new Error("Failed to fetch data"); 
    }
  });

  ipcMain.handle('post-data', async (event, url, data) => {
    try {
        const response = await axios.post(url,data);
        return response.ok;
    } catch (error) {
        console.error("Error posting data:", error);
        throw new Error("Failed to post data");
    }
  });
  
  
 

  // mainWindow.webContents.session.webRequest.onBeforeSendHeaders((details,callback)=>{
  //   callback({
  //     requestHeaders:Object.assign({},details.requestHeaders,{
  //       'Content-Security-Policy':''
  //     })
  //   })
  // })


  // Open the DevTools.
  // mainWindow.webContents.openDevTools();
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow();

  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
