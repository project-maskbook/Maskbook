import { spawn } from 'child_process'
import { resolve } from 'path'
import { PKG_PATH } from '../utils'

const presets = ['chromium', 'E2E', 'firefox', 'android', 'iOS', 'base']
const otherFlags = ['beta', 'insider', 'reproducible', 'profile', 'manifest-v3']
const knownTargets = ['-h', '--help', ...presets, ...otherFlags]

async function main(mode: 'dev' | 'build') {
    let targets = process.argv.slice(2)

    if (targets.includes('-h') || targets.includes('--help')) {
        const inquirer = require('inquirer')
        const { preset } = await inquirer.prompt({
            type: 'list',
            name: 'preset',
            message: 'Choose preset',
            choices: presets,
        })
        const { flags } = await inquirer.prompt({
            type: 'checkbox',
            name: 'flags',
            choices: otherFlags,
        })
        targets = [...flags, preset]

        const command = ['npx', mode === 'dev' ? 'dev' : 'build', ...targets]
        const { confirm } = await inquirer.prompt({
            type: 'confirm',
            name: 'confirm',
            message: `Command is: "${command.join(' ')}". Is that OK?`,
        })
        if (!confirm) return process.exit(0)
    }

    const command = ['webpack', '--mode', mode === 'dev' ? 'development' : 'production']
    if (mode === 'dev') command.unshift('serve')
    for (const target of targets) {
        if (target.startsWith('-')) {
            continue
        } else if (!knownTargets.includes(target)) {
            throw new TypeError(`Unknown target ${target}. Known targets: ${knownTargets}`)
        }
        command.push('--env', target)
    }
    return spawn('npx', command, {
        cwd: resolve(PKG_PATH, 'maskbook'),
        stdio: 'inherit',
        shell: true,
    })
}

export default main
