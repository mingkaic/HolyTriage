'using strict';

const electron = require('electron');
const path = require('path');
const url = require('url');

const app = electron.app
const BrowserWindow = electron.BrowserWindow
const ipc = electron.ipcMain;

// global
var mainWindow = null;

// // Quit when all windows are closed.
// app.on('window-all-closed', function () {
// 	// On OS X it is common for applications and their menu bar
// 	// to stay active until the user quits explicitly with Cmd + Q
// 	if (process.platform !== 'darwin') {
// 		app.quit()
// 	}
// });

// app.on('activate', function () {
// 	// On OS X it's common to re-create a window in the app when the
// 	// dock icon is clicked and there are no other windows open.
// 	if (mainWindow === null) {
// 		createWindow()
// 	}
// });

app.on('ready', function () {
	// Create the browser window.
	mainWindow = new BrowserWindow({width: 1000, height: 800});

	// and load the index.html of the app.
	mainWindow.loadURL(url.format({
		pathname: path.join(__dirname, 'index.html'),
		protocol: 'file:',
		slashes: true
	}));

	// Emitted when the window is closed.
	mainWindow.on('closed', function () {
		mainWindow = null;
	});

	// Open the DevTools on open by default
	mainWindow.webContents.openDevTools();
});

