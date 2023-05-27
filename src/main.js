const { app, BrowserWindow, ipcMain, Tray, Menu} = require('electron')
const path = require('path')
const {listenForMinecraft, relaunchWithWeave} = require("./js/launch-util");
const {fadeWindowIn, fadeWindowOut} = require("./js/window-util");
const {getMods, retrieveModFiles, startup, checkUpdates, retrieveWeaveLoaderFile, extractVersion, downloadWeave, doesWeaveDirExist, openModFolder } = require('./js/file-util')
const {autoUpdater} = require('electron-updater')

app.setLoginItemSettings({
    openAtLogin: true
})

const eventActions = {
    closeWindow: () => {
        fadeWindowOut(win, 0.1, 10, true)
    },
    minimizeWindow: () => {
        fadeWindowOut(win, 0.1, 10)
    },
    checkUpdates: () => {
        // ignore checkUpdates event if .weave dir doesn't exist
        const weaveDirExists = doesWeaveDirExist()
        if (weaveDirExists) {
            const weaveLoaderFile = retrieveWeaveLoaderFile()
            const version = extractVersion(weaveLoaderFile)
            checkUpdates(win, version)
        }
    },
    update: (args) => {
        const json = args[0]
        downloadWeave(win, json.download, json.version, false)
    },
    install: (args) => {
        const json = args[0]
        downloadWeave(win, json.download, json.version, true)
    },
    openModFolder: () => {
        openModFolder()
    },
    restartApp: () => {
        autoUpdater.quitAndInstall()
    },
    relaunchWithWeave: (args) => {
        relaunchWithWeave(args[0], win)
    },
    ignoreRelaunch: () => {
        /* Start listening for Minecraft again */
        listenForMinecraft(win)
    }
}

const invokeActions = {
    getModList: () => {
        return getMods()
    },
}

ipcMain.on("toMain", (event, args) => {
    const action = eventActions[args[0]]
    if (action)
        action(args.slice(1))
})

ipcMain.handle('toMain', (event, args) => {
    const action = invokeActions[args[0]]
    if (action)
        return action(args.slice(1))
})

const createWindow = () => {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        frame: false,
        fullscreenable: false,
        maximizable: false,
        resizable: false,
        transparent: true,
        webPreferences: {
            contextIsolation: true,
            preload: path.join(__dirname, "preload.js")
        }
    })

    win.once('ready-to-show', () => {
        win.show()
        autoUpdater.checkForUpdatesAndNotify()
        startup(win)
    })

    win.on('focus', () => {
        fadeWindowIn(win, 0.1, 10)
    })

    win.setIcon(path.join(__dirname, '..', 'buildResources', 'icon.png'))
    win.loadFile(path.join(__dirname, '..', 'buildResources', 'index.html'))

    return win
}

const createTray = () => {
    const tray = new Tray(path.join(__dirname, '..', 'buildResources', 'icon.png'))
    const contextMenu = Menu.buildFromTemplate([
        { label: 'Open', click: () => win.show() },
        { label: 'Quit', click: () => app.quit() }
    ])
    tray.setToolTip('Weave Manager')
    tray.setContextMenu(contextMenu)

    tray.on('click', () => {
        win.show()
    })

    return tray
}

let win
let tray
app.whenReady().then(() => {
    retrieveModFiles()
    win = createWindow()
    tray = createTray()

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            win = createWindow()
            win.openDevTools()
        }
    })

    listenForMinecraft(win)
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

autoUpdater.on('update-available', () => {
    win.webContents.send('fromMain', ['updateAvailable'])
})
autoUpdater.on('update-downloaded', () => {
    win.webContents.send('fromMain', ['updateDownloaded'])
})
