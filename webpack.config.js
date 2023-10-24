const path = require('path');

module.exports = {
    entry: {
        files: [
            './src/bsms-code-picker.js', 
            './src/bsms-code-picker.css',
        ]
    },
    output: {
        filename: 'bsms-code-picker.min.js',
        path: path.resolve(__dirname, 'dist')
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader'],
            },
        ],
    },
};
