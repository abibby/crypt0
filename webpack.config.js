//@ts-check

const { build } = require('@zwzn/build')
const { join } = require('path')

module.exports =  build({
    entry: join(__dirname, 'src/app.tsx'),
    html: join(__dirname, 'src/index.html'),
    moduleBase: join(__dirname, 'src'),
    dist: join(__dirname, 'dist'),
    // publicPath:'',
})
