const os = require('os')
const path = require('path')
const fs = require('fs')
const fetch = require('node-fetch')
const {download} = require('electron-dl')
const { exec } = require('child_process')
const chokidar = require('chokidar')

const weaveDir = path.join(os.homedir(), '.weave')
const modsDir = path.join(weaveDir, 'mods')

let upToDate = false

function fetchGitHubReleases() {
    const url = 'https://api.github.com/repos/weave-mc/weave-loader/releases'
    return fetch(url, { headers: {'user-agent': 'node.js'} }).then(response => response.json()).catch(err => {
        console.log('Error fetching Weave-Loader releases', err)
    })
}

function extractVersion(fileName) {
    const regex = /Weave-Loader-v(\d+\.\d+\.\d+)\.jar/;
    const match = regex.exec(fileName)
    if (match)
        return 'v' + match[1]
    return null
}

function retrieveWeaveLoaderFile() {
    const files = fs.readdirSync(weaveDir)

    for (const file of files) {
        if (file.includes('Weave-Loader-'))
            return path.join(weaveDir, file)
    }

    return null
}

function fetchLatestWeave() {
    return fetchGitHubReleases().then(releases => {
        const latestRelease = releases[0]
        const latestVersion = latestRelease.tag_name
        const downloadLink = latestRelease.assets[0].browser_download_url

        return {version: latestVersion, download: downloadLink}
    }).catch(err => {
        console.log('Error fetching Weave-Loader releases', err)
        return null
    })
}

function checkUpdates(window, currentVersion) {
    if (!currentVersion) {
        console.log("Failed to find Weave-Loader jar, make sure the name isn't modified")
        return
    }

    fetchLatestWeave().then(weaveFetch => {
        if (weaveFetch.version !== currentVersion)
            window.webContents.send('fromMain', ['checkUpdates', weaveFetch])
    })
}

function downloadWeave(window, link, version, firstInstall) {
    let event
    // mkdir the folders if it's the first install
    if (firstInstall) {
        fs.mkdirSync(modsDir, {recursive: true})
        event = 'install'
    }
    // delete the previous weave-loader jar if it's an update
    else {
        const weaveLoaderFile = retrieveWeaveLoaderFile()
        if (weaveLoaderFile !== null)
            fs.unlinkSync(retrieveWeaveLoaderFile())

        event = 'update'
    }

    const options = {
        directory: weaveDir,
        filename: `Weave-Loader-${version}.jar`
    }
    download(window, link, options).then(() => {
        upToDate = true
        window.webContents.send('fromMain', [event])
    }).catch(err => {
        console.log("Failed to install Weave-Loader", err)
    })
}

function doesWeaveDirExist() {
    return fs.existsSync(weaveDir)
}

// Called when application is launched, checks for updates, and if Weave is installed
function startup(window) {
    const weaveDirExists = doesWeaveDirExist()
    fetchLatestWeave().then(weaveFetch => {
        // weave is not installed
        if (!weaveDirExists) {
            window.show()
            window.webContents.send('fromMain', ['doInstall', weaveFetch])
            return
        }

        const weaveLoaderFile = retrieveWeaveLoaderFile()
        const weaveLoaderExists = fs.existsSync(weaveLoaderFile)
        const modsDirExists = fs.existsSync(modsDir)

        if (!weaveLoaderExists || !modsDirExists) {
            // weave loader is not downloaded, prompt user to update
            if (!weaveLoaderExists) {
                window.show()
                window.webContents.send('fromMain', ['checkUpdates', weaveFetch])
                return
            }

            if (!weaveDirExists)
                fs.mkdirSync(weaveDir)
            if (!modsDirExists)
                fs.mkdirSync(modsDir)
        }

        const watcher = chokidar.watch(modsDir, {
            awaitWriteFinish: true, // Wait for writes to finish before triggering events
            persistent: true // Keep watching even if the process is idle
        })
        watcher.on('add', () => retrieveModFilesAndNotify(window)).on('unlink', () => retrieveModFilesAndNotify(window))

        const currentVersion = extractVersion(weaveLoaderFile)
        if (currentVersion === null) {
            console.log("Failed to find Weave-Loader jar, make sure the name isn't modified")
            return
        }

        if (weaveFetch.version !== currentVersion) {
            window.show()
            window.webContents.send('fromMain', ['checkUpdates', weaveFetch])
        }
        else
            upToDate = true
    })
}

function openModFolder() {
    const folderPath = path.join(os.homedir(), '.weave', 'mods')
    switch(os.platform()) {
        case 'win32': exec(`start "" "${folderPath}"`); break;
        case 'darwin': exec(`open ${folderPath}`); break;
        default: exec(`xdg-open ${folderPath}`); break;
    }
}

function getMods() {
    return mods
}

let mods = []
function retrieveModFiles() {
    try {
        if (fs.existsSync(modsDir)) {
            const weaveFiles = fs.readdirSync(modsDir)
            const jarFiles = weaveFiles.filter(file => file.endsWith('.jar'))
            mods = jarFiles.map(file => ({name: file}))
        }
    } catch (err) {
        console.error('Error reading weave mods', err)
        mods = []
    }
}

function retrieveModFilesAndNotify(window) {
    retrieveModFiles()
    window.webContents.send('fromMain', ['updatedModList'])
}

function isUpToDate() { return upToDate }

module.exports = { startup, checkUpdates, retrieveWeaveLoaderFile, extractVersion, downloadWeave, doesWeaveDirExist, isUpToDate, openModFolder, getMods, retrieveModFiles }