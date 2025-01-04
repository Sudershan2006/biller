const { contextBridge,ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld(
    'electron',
    {
        fetchData: (url) => ipcRenderer.invoke('fetch-data', url),
        postData: (url,data) => ipcRenderer.invoke('post-data', url, data),
    }
)