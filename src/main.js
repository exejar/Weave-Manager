const { app, BrowserWindow, ipcMain, Tray, Menu} = require('electron')
const path = require('path')
const {loadFiles, getMods, listenForMinecraft} = require("./js/launch-util");
const {fadeWindowIn, fadeWindowOut} = require("./js/window-util");

app.setLoginItemSettings({
    openAtLogin: true
})

ipcMain.on("toMain", (event, ...args) => {
    if (args.includes('getModList')) {
        if (getMods.length < 0) loadFiles()

        win.webContents.send("fromMain", ['getModList', getMods()])
    } else if (args.includes('closeWindow')) {
        fadeWindowOut(BrowserWindow.fromWebContents(event.sender), 0.1, 10, true)
    } else if (args.includes('minimizeWindow')) {
        fadeWindowOut(BrowserWindow.fromWebContents(event.sender), 0.1, 10)
    }
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
    })

    win.setIcon('public/icon.png')
    win.loadFile('public/index.html')

    return win
}

const createTray = () => {
    const tray = new Tray('public/icon.ico')
    const contextMenu = Menu.buildFromTemplate([
        { label: 'Open', click: () => win.show() },
        { label: 'Quit', click: () => app.quit() }
    ])
    tray.setToolTip('Weave Manager')
    tray.setContextMenu(contextMenu)

    return tray
}

let win
let tray
app.whenReady().then(() => {
    loadFiles()
    win = createWindow()
    tray = createTray()

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            win = createWindow()
            win.openDevTools()
        }
    })

    win.on('focus', () => {
        fadeWindowIn(win, 0.1, 10)
    })

    listenForMinecraft(win)
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

