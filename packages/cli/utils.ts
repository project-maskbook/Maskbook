import { spawnSync } from 'child_process'
import os from 'os'
import path from 'path'

export const ROOT_PATH = path.resolve(__dirname, '..', '..')
export const PKG_PATH = path.resolve(ROOT_PATH, 'packages')
export const BUILD_PATH = path.resolve(ROOT_PATH, 'build')
export const NETLIFY_PATH = path.resolve(PKG_PATH, 'netlify')

export function run(cwd = ROOT_PATH, cmd: string, ...args: string[]) {
    console.log('$', cmd, args.join(' '), '# cwd:', path.relative(ROOT_PATH, cwd))
    return spawnSync(cmd, args, {
        cwd,
        stdio: 'inherit',
        shell: os.platform() === 'win32',
    })
}

export const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))
