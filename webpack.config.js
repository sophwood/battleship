var path = require('path');

var config = {
    entry: './src/entry.js',
    output: {
        path: path.join(__dirname, 'build'),
        publicPath: '/assets/',
        filename: 'bundle.js'
    },
    devtool: 'inline-source-map',
    module: {
        loaders: [{
            test: /\.js$/,
            include: path.join(__dirname, 'src'),
            loader: 'babel'
        }]
    }
};

module.exports = config;