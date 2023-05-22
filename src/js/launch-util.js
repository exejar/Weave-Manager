const fs = require('fs')
const os = require('os')
const path = require('path')
const find = require('find-process')
const {exec, spawn} = require('child_process')
const userHomeDir = os.homedir()

function getMods() {
    return mods
}

let mods = []
function loadFiles() {
    try {
        const weaveFiles = fs.readdirSync(path.join(userHomeDir, '.weave', 'mods'))
        const jarFiles = weaveFiles.filter(file => file.endsWith('.jar'))
        mods = jarFiles.map(file => ({name: file}))
    } catch (err) {
        console.error('Error reading weave mods', err)
        mods = []
    }
}

function minecraftLookup() {
    return new Promise((resolve, reject) => {
        function check() {
            find('name', "javaw.exe")
                .then((list) => {
                    if (list.length > 0) {
                        resolve(list[0])
                    } else {
                        setTimeout(check, 1000)
                    }
                }).catch(reject)
        }
        check()
    })
}
function relaunchWithWeave(minecraft) {
    killMinecraft(minecraft)

    const [command, ...args] = minecraft.cmd.split(' ')

    const options = {
        cwd: getWorkingDirectory(command),
        stdio: 'inherit',
        env: Object.assign(process.env, {
            JAVA_TOOL_OPTIONS: `-javaagent:${path.join(userHomeDir, '.weave', 'Weave-Loader-Agent-0.1.0.jar')}`
        })
    }

    const child = spawn(command, args, options)

    child.on('error', (err) => {
        console.error('Failed to spawn Minecraft', err)
    })

    child.on('exit', (code, signal) => {
        console.log(`Minecraft exited with code: ${code} and signal: ${signal}`)
        minecraftLookup().then((minecraft) => {
            relaunchWithWeave(minecraft)
        }).catch((err) => {
            console.log('Error:', err.stack || err)
        })
    })
}

// TODO kill parent process as well
function killMinecraft(minecraft) {
    switch (os.platform()) {
        case 'win32': {
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
    getMods, loadFiles, minecraftLookup, relaunchWithWeave, getWorkingDirectory
}