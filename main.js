// Modules to control application life and create native browser window
const {app, ipcMain, BrowserWindow} = require('electron')
const { exec } = require("child_process");
const path = require('path')

ipcMain.on('asynchronous-message', (event, arg) => {
  if(arg.startsWith("cmd")) {
    let cmd = arg.split("-")[1];
    
    exec(cmd, (error, stdout, stderr) => {
      if (error) {
        event.reply('asynchronous-reply', `error: ${error.message}`)
        return;
      }
      if (stderr) {
        event.reply('asynchronous-reply', `stderr: ${stderr}`)
        return;
      }
      event.reply('asynchronous-reply', `stdout: ${stdout}`)
    });

    console.log(`Executed command: ${cmd}`);
  }
})

// Enable live reload for all the files inside your project directory
require('electron-reload')(__dirname);

function createWindow () {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true
    }
  })

  // console.log(`Process: ${process.cwd()}`)
  
  // and load the index.html of the app.
  mainWindow.loadFile('index.html')
  
  // Open the DevTools.
  // mainWindow.webContents.openDevTools()
  // console.log(mainWindow.webContents.getURL());
  // mainWindow.webContents.session.webRequest.onBeforeRequest({ urls: [mainWindow.webContents.getURL()] },
  // (details, callback) => {

  //   console.log(`success, details: ${details}`);
  //   // console.log("onBeforeRequest details", details);
  //   // const { url } = details;
  //   // const localURL = url.replace(‘YOUR_WEBSITE_URL’, ‘YOUR_REDIRECT_SITE’ )
  //   // get local asset instead of one from pizza bottle
    
  //   // callback({
  //     // cancel: false,
  //     // redirectURL: ( encodeURI(localURL ) )
  //     // });
  // });

  // mainWindow.webContents.session.webRequest.onErrorOccurred((details) => {
  //   console.log(`error, details: ${details}`);
  //   // console.log("error occurred on request");
  //   // console.log(details);
  // })
}




// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow()
  
  app.on('activate', function () {
    // ipcMain.on('asynchronous-message', (event, arg) => {
    //   console.log(arg) // prints "ping"
    //   event.reply('asynchronous-reply', 'pong')
    // })
    
    // ipcMain.on('synchronous-message', (event, arg) => {
    //   console.log(arg) // prints "ping"
    //   event.returnValue = 'pong'
    // })

    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.