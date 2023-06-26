const { contextBridge, ipcRenderer } = require('electron')

const updateOnlineStatus = () => {
  ipcRenderer.send(
    'online-status-changed',
    navigator.onLine ? 'online' : 'offline'
  )
}

contextBridge.exposeInMainWorld('preload', {
  updateOnlineStatus,
})
