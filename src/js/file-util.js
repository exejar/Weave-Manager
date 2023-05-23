const os = require('os')
const path = require('path')
const fs = require('fs')
const fetch = require('node-fetch')

const weaveDir = path.join(os.homedir(), '.weave')
const modsDir = path.join(weaveDir, 'mods')

function fetchGitHubReleases() {
    const url = 'https://api.github.com/repos/weave-mc/weave-loader/releases'
    return fetch(url, { headers: {'user-agent': 'node.js'} })
}

function extractVersion(fileName) {
    const regex = /Weave-Loader-(\d+\.\d+\.\d+)\.jar/;
    const match = regex.exec(fileName)
    if (match)
        return match[1]
    return null
}

function isVersionUpToDate(version, releases) {
    if (releases.length === 0)
        return true

    const latestRelease = releases[0]
    const latestVersion = latestRelease.tag_name

    return version === latestVersion
}

function retrieveWeaveLoaderFile() {
    const files = fs.readdirSync(weaveDir)

    for (const file of files) {
        if (file.includes('Weave-Loader-'))
            return path.join(weaveDir, file)
    }

    return null
}

function checkUpdates(window, currentVersion) {
    if (!currentVersion) {
        console.log("Failed to find Weave-Loader jar, make sure the name isn't modified")
        return
    }

    fetchGitHubReleases().then(releases => {
        const isUpToDate = isVersionUpToDate(currentVersion, releases)

        if (!isUpToDate)
            window.webContents.send('fromMain', 'checkUpdates')
    }).catch(error => {
        console.log('Error fetching Weave-Loader releases', error)
    })
}

// Called when application is launched, checks for updates, and if Weave is installed
function startup(window) {
    const weaveLoaderFile = retrieveWeaveLoaderFile()
    const weaveDirExists = fs.existsSync(weaveDir)
    const weaveLoaderExists = fs.existsSync(weaveLoaderFile)
    const modsDirExists = fs.existsSync(modsDir)

    if (!weaveDirExists || !weaveLoaderExists || !modsDirExists) {
        if (!weaveLoaderExists) {
            window.webContents.send('fromMain', 'install')
            return
        }

        if (!weaveDirExists)
            fs.mkdirSync(weaveDir)
        if (!modsDirExists)
            fs.mkdirSync(modsDir)
    }

    const currentVersion = extractVersion(weaveLoaderFile)
    checkUpdates(window, currentVersion)
}

module.exports = { startup, checkUpdates, retrieveWeaveLoaderFile, extractVersion }