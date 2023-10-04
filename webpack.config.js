const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
    entry: {
        js: './src/bsms-code-picker.js', 
    },
    output: {
        filename: 'bsms-code-picker.min.[name]',
        path: path.resolve(__dirname, 'dist')
    },
    plugins: [
        new CopyWebpackPlugin({
            patterns: [
                { from: './src/bsms-code-picker.css', to: 'bsms-code-picker.min.css' }, 
            ],
        }),
    ],
};
