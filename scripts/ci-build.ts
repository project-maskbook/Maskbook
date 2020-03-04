import { execFileSync, ExecFileSyncOptions } from 'child_process'
import path from 'path'
import os from 'os'
import git from '@nice-labs/git-rev'

const cwd = path.join(__dirname, '..')
const BUILD_PATH = path.join(cwd, 'build')
const stdio = [process.stdin, process.stdout, process.stderr]
const shell = os.platform() === 'win32'

const exec = (command: string, args?: string[], options?: ExecFileSyncOptions) =>
    execFileSync(command, args, { cwd, stdio, shell, ...options })

function buildTypes(name: string): string[] {
    if (/full/.test(name) || name === 'master') {
        return ['base', 'chromium', 'firefox', 'gecko', 'iOS']
    } else if (/ios/.test(name)) {
        return ['iOS']
    } else if (/android|gecko/.test(name)) {
        return ['firefox', 'gecko']
    } else {
        return ['base', 'chromium', 'firefox']
    }
}

const branch = git.branchName()
const types = buildTypes(branch.toLowerCase())
console.log(`Branch: ${branch}`)
for (const type of types) {
    if (type === 'chromium' && types.includes('base')) {
        // chromium doesn't have it's own changes yet.
        // just copying base version is acceptable
        exec('cp', ['Maskbook.base.zip', 'Maskbook.chromium.zip'])
    }
    console.log(`Building for target: ${type}`)
    exec('yarn', [`build:${type.toLowerCase()}`])
    exec('zip', ['-r', `../Maskbook.${type}.zip`, '.'], { cwd: BUILD_PATH })
    exec('rm', ['-rf', BUILD_PATH])
}
