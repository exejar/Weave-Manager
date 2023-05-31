const os = require('os')
const path = require('path')
const find = require('find-process')
const {exec, spawn} = require('child_process')
const userHomeDir = os.homedir()
const { retrieveWeaveLoaderFile, isUpToDate } = require('./file-util')

let ignore = new Set()

function minecraftLookup() {
    return new Promise((resolve, reject) => {
        function check() {
            // Only search for MC processes if weave is installed/up-to-date
            find('name', /java/i)
                .then((list) => {
                    if (list.length > 0) {
                        for (const process of list) {
                            /* Skip processes that were ignored */
                            if (ignore.has(process.pid))
                                continue

                            if (process.cmd) {
                                // currently weave only supports 1.8.9, so we will only attach to 1.8.9 instances of Minecraft
                                if (process.cmd.includes('1.8.9')) {
                                    if (process.cmd.includes('lunar'))
                                        resolve({type: "Lunar Client", process: process})
                                    // else if (process.cmd.includes('minecraftforge'))
                                        // resolve({type: "Minecraft Forge", process: process})
                                }
                            }
                        }
                    }

                    setTimeout(check, 1000)
                }).catch(reject)
        }
        check()
    })
}
function relaunchWithWeave(minecraft, window) {
    const type = minecraft.type
    const mcProcess = minecraft.process

    killMinecraft(mcProcess)

    // Split command using spaces outside quotation marks
    console.log(mcProcess.cmd)

    const commandRegex = /[^\s"']+|"([^"]*)"|'([^']*)'/g
    const split = mcProcess.cmd.match(commandRegex).map(arg => arg.replace(/"/g, ''))
    const command = split[0]
    const args = split.slice(1)


    const options = {
        cwd: getWorkingDirectory(command),
        stdio: 'inherit',
        env: Object.assign(process.env, {
            JAVA_TOOL_OPTIONS: `-javaagent:${retrieveWeaveLoaderFile()}`
        })
    }

    const child = spawn(command, args, options)

    window.webContents.send('fromMain', ['weaveState', `Weave is currently running in ${type}`])

    child.on('error', (err) => {
        console.error('Failed to spawn Minecraft', err)
    })

    child.on('exit', (code, signal) => {
        console.log(`Minecraft exited with code: ${code} and signal: ${signal}`)
        window.webContents.send('fromMain', ['weaveState', 'Waiting for user to launch Minecraft'])
        listenForMinecraft(window)
    })
}

function listenForMinecraft(window) {
    minecraftLookup().then((minecraft) => {
        ignore.add(minecraft.process.pid)
        window.webContents.send('fromMain', ['foundMinecraftProcess', minecraft])
        window.show()
    }).catch((err) => {
        console.log('Error:', err.stack || err)
    })
}

// TODO kill parent process as well
function killMinecraft(minecraft) {
    switch (os.platform()) {
        case 'win32': {
            // kill launcher first to prevent flooding crash codes
            // exec(`taskkill /f /pid ${minecraft.ppid}`, (err, stdout, stderr) => {
            //     if (err)
            //         console.error(`Failed to kill minecraft parent with PID ${minecraft.ppid}: ${err.message}`)
            //     else if (stderr)
            //         console.log(`Error killing minecraft parent with PID ${minecraft.ppid}: ${stderr}`)
            // })

            exec(`taskkill /f /pid ${minecraft.pid}`, (err, stdout, stderr) => {
                if (err)
                    console.error(`Failed to kill minecraft with PID ${minecraft.pid}: ${err.message}`)
                else if (stderr)
                    console.log(`Error killing minecraft with PID ${minecraft.pid}: ${stderr}`)
            })
            break
        }
        // linux and darwin (mac) kill processes the same
        default: {
            // kill launcher first to prevent flooding crash codes
            // exec(`kill -9 ${minecraft.ppid}`, (err, stdout, stderr) => {
            //     if (err)
            //         console.error(`Failed to kill minecraft parent with PID ${minecraft.ppid}: ${err.message}`)
            //     else if (stderr)
            //         console.log(`Error killing minecraft parent with PID ${minecraft.ppid}: ${stderr}`)
            // })

            exec(`kill -9 ${minecraft.pid}`, (err, stdout, stderr) => {
                if (err)
                    console.error(`Failed to kill minecraft with PID ${minecraft.pid}: ${err.message}`)
                else if (stderr)
                    console.log(`Error killing minecraft with PID ${minecraft.pid}: ${stderr}`)
            })
            break
        }
    }
}

function getWorkingDirectory(launchCommand) {
    if (launchCommand.includes('.lunar')) {
        return path.join(userHomeDir, '.lunarclient', 'offline', 'multiver')
    } else if (launchCommand.includes('.minecraft')) {
        switch(os.platform()) {
            case 'win32': return path.join(userHomeDir, 'AppData', 'Roaming', '.minecraft')
            case 'darwin': return path.join(userHomeDir, 'Library', 'Application Support', 'minecraft')
            default: return path.join(userHomeDir, '.minecraft')
        }
    } else {
        console.log('Minecraft client launched is not compatible with Weave')
    }
}

module.exports = {
    getWorkingDirectory, listenForMinecraft, relaunchWithWeave
}