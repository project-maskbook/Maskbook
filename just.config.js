const { task, series, parallel } = require('just-task')
const { spawn } = require('child_process')
const path = require('path')

const prettierCommand = async (str, level = 'log') => {
    const listen = 'onchange "./src/**/*" -i --'
    await step(`${listen} prettier --${str} "./src/**/*.{ts,tsx}" --loglevel ${level}`)
}
const eslintCommand = 'eslint --ext tsx,ts ./src/ --cache'

task('watch', () => parallel('react', 'watch/hot-reload-firefox'))
task('watch/hot-reload-firefox', () => step('web-ext run --source-dir ./dist/'))
task('watch/android-firefox', async () => {
        const i = process.argv.findIndex(v => v === '--android-device')
        if (i > -1) {
            await step(`web-ext run --target=firefox-android --source-dir ./dist/ --android-device=${process.argv[i + 1]}`)
        } else {
            await step(`web-ext run --target=firefox-android --source-dir ./dist/`)
        }
    }
)

task('react', () => parallel('prettier/fix', 'eslint/fix', 'react/start'))
task('react/start', () => step('react-app-rewired start'))
task('react/build', () => step('react-app-rewired build'))
task('react/test', () => step('react-app-rewired test'))

task('lint', () => prettierCommand('check'))
task('prettier/fix', () => prettierCommand('write', 'warn'))
task('eslint/fix', () => step(eslintCommand + ' --fix'))
task('lint/strictonce', async () => {
    const p1 = step(eslintCommand, { withWarn: true }).catch(e => e)
    const p2 = step('prettier --check "./src/**/*.{ts,tsx}" ', { withWarn: true }).catch(e => e)
    const eslint = await p1
    const prettier = await p2
    if (!eslint && !eslint) return
    if (eslint && prettier) throw new Error('Both ESLint and Prettier failed!\n' + eslint + '\n' + prettier)
    if (eslint) throw new Error('ESLint check failed!\n' + eslint)
    if (prettier) throw new Error('Prettier check failed!\n' + prettier)
})

task('storybook', () => parallel('lint/fix', 'storybook/serve'))
task('storybook/serve', () => step('start-storybook -p 9009 -s public --quiet', { withWarn: true }))
task('storybook/build', () => step('build-storybook -s public --quiet', { withWarn: true }))

task('install', () => series('install/holoflows'))
task('install/holoflows', async () => {
    const base = path.join(process.cwd(), 'node_modules/@holoflows')
    if (process.argv.includes('--upgrade')) {
        await step('yarn upgrade @holoflows/kit')
    }
    await step(`cd ${path.join(base, 'kit')} && yarn && yarn build`)
})

/**
 * @param cmd {string} The command you want to run
 * @param [opt] {object} Options
 * @param [opt.withWarn] {boolean} Show warn in stdio
 * @param [opt.env] {NodeJS.ProcessEnv} Environment key-value pairs
 */
const step = (cmd, opt = { withWarn: process.env.CI === 'true' }) => {
    const child = spawn(cmd, [], {
        shell: true,
        stdio: ['inherit', 'inherit', opt.withWarn ? 'inherit' : 'ignore'],
        env: opt.env,
    })

    return new Promise((resolve, reject) => {
        child.on('error', reject)

        child.on('exit', code => {
            if (code === 0) {
                resolve()
            } else {
                const err = new Error(`child exited with code ${code}`)
                reject(err)
            }
        })
    })
}
