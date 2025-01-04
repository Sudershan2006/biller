const { app, BrowserWindow,ipcMain } = require('electron');
const path = require('path');
const url = require('url');
const axios = require('axios');
const { fork } = require('child_process');

function createWindow(){
    const mainWindow = new BrowserWindow( {
        title:'Electron',
        width:1000,
        height:600,
        webPreferences:{
            contextIsolation:true,
            nodeIntegration:true,
            preload:path.join(__dirname,'preload.js')
        }
    });


    const startUrl = url.format({
        pathname: path.join(__dirname, '../my-app/build/index.html'),
        protocol: 'file:'
    })
    
    mainWindow.loadFile(path.join('D://Billing/my-app/build/index.html'));

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
            await axios.post(url,data);
            return true;
        } catch (error) {
            console.error("Error posting data:", error);
            throw new Error("Failed to post data");
        }
      });
}

const startBackendServer = () => {
    const serverPath = path.join('D://Billing/billing-backend/index.js'); 
    fork(serverPath); 
};


app.whenReady().then(()=>{
    startBackendServer();
    createWindow();
}
);
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
      app.quit();
    }
  });