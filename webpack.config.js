const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');

module.exports = {
    mode: 'production',
    entry: {
        index: { import: './src/index.js', dependOn: 'shared' },
        core: { import: './src/core.js', dependOn: 'shared' },
        events: { import: './src/events/', dependOn: 'shared' },
        shared: 'three',
    },
    output: {
        filename: '[name].bundle.js',
        path: path.resolve(__dirname, '../assets/web'),
    },
    optimization: { runtimeChunk: 'single' },
    plugins: [new HtmlWebpackPlugin()],
};
