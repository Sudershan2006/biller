// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
    fetchData: (url) => ipcRenderer.invoke('fetch-data', url),
    postData: (url,data) => ipcRenderer.invoke('post-data', url, data),
    reload: () => ipcRenderer.invoke('reload')
});
