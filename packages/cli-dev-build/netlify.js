const { series, parallel } = require('gulp')
const { spawn } = require('child_process')

const { join } = require('path')
const root = join(__dirname, '../../')
const dashboard = join(__dirname, '../dashboard')
const theme = join(__dirname, '../theme')
const output = join(__dirname, '../netlify/')

const createBuildStorybook6 = (basePath, output, name) => {
    const f = () =>
        spawn(`npx build-storybook --output-dir ${output}`, {
            cwd: basePath,
            shell: true,
        })
    f.displayName = name + '-storybook'
    f.description = `Build storybook of ${name} to ${output}`
    return f
}

const { build } = require('./ts')
const a = createBuildStorybook6(dashboard, join(output, './dashboard-storybook/'), 'dashboard')
const b = createBuildStorybook6(theme, join(output, './theme-storybook/'), 'theme')

exports.buildNetlify = series(build, parallel(a, b))
