// Native
const { format } = require('url')
const fs = require('fs');
const path = require('path');

// Packages
const { BrowserWindow, app } = require('electron')
const isDev = require('electron-is-dev')
const prepareNext = require('electron-next')
const { resolve } = require('app-root-path')

// Prepare the renderer once the app is ready
app.on('ready', async () => {
  await prepareNext('./renderer')

  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    title: 'Crypto - DES',
    show: false,
    icon: path.join(__dirname, 'static/icons/windows.ico')
  });

  mainWindow.once('ready-to-show', mainWindow.show);

  const devPath = 'http://localhost:8000/main'

  const prodPath = format({
    pathname: resolve('renderer/out/main/index.html'),
    protocol: 'file:',
    slashes: true
  })

  const url = isDev ? devPath : prodPath
  mainWindow.loadURL(url)
  mainWindow.setMenu(null);
  // mainWindow.openDevTools({mode: 'detach'});
})

const createDesWindow = ({message, key}) => {
  const desWindow = new BrowserWindow({
    width: 800,
    height: 600,
    title: 'DES',
    show: false,
    icon: path.join(__dirname, 'static/icons/windows.ico')
  });

  desWindow.once('ready-to-show', desWindow.show);

  desWindow.webContents.on('did-finish-load', function() {
    desWindow.webContents.send('data', {message ,key});
  });

  const devPath = 'http://localhost:8000/start'

  const prodPath = format({
    pathname: resolve('renderer/out/start/index.html'),
    protocol: 'file:',
    slashes: true
  })

  const url = isDev ? devPath : prodPath
  desWindow.loadURL(url)
  desWindow.setMenu(null);
  // desWindow.openDevTools({mode: 'detach'});
}

const getFile = (path) => {
  console.log(path);
  return fs.readFileSync(path).toString();
}

const saveFile = (path, contents) => {
  console.log(path);
  console.log(contents);
  fs.writeFileSync(path, contents);
}

module.exports = {
  createDesWindow,
  getFile,
  saveFile
};

// Quit the app once all windows are closed
app.on('window-all-closed', app.quit)
