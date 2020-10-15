import { app, BrowserWindow } from 'electron';
import { serverHost } from './config';
import startLocalServer from './server';
import startParseBiddings from './parser';
import {
    dataBiddings, saveBiddings, loadBiddings, deleteOldBiddings,
} from './server/data/biddings';
import { loadUsers, saveUsers } from './server/data/users';
import { openLink } from './server/data/links';

startLocalServer();
startParseBiddings();

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) { // eslint-disable-line global-require
    app.quit();
}

const createWindow = () => {
    // Create the browser window.
    const mainWindow = new BrowserWindow({
        width: 1024,
        height: 600,
    });

    const productWindow = `${serverHost}/main_window`;
    const devWindow = MAIN_WINDOW_WEBPACK_ENTRY;
    // and load the index.html of the app.
    setTimeout(() => {
        mainWindow.loadURL(productWindow);
        // Open the DevTools.
        mainWindow.webContents.openDevTools();

        openLink(devWindow.includes('3000') ? devWindow : productWindow);
    }, 10000);
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', () => {
    Promise.all([
        loadUsers(),
        loadBiddings(),
    ])
        .then(() => {
            createWindow();
            console.log(`All biddings loaded: ${dataBiddings.length}  items`);
            deleteOldBiddings();
            console.log(MAIN_WINDOW_WEBPACK_ENTRY);
        });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        Promise.all([
            saveBiddings(),
            saveUsers(),
        ])
            .then(() => {
                console.log('promise saved');
                app.quit();
            });
    }
});

app.on('activate', () => {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.

/**
 * Автосейв каждые 5 минут
 */
const autosaveInterval = 5 * 60 * 1000;
setInterval(() => {
    saveBiddings();
    console.log('autosave inited');
}, autosaveInterval);
