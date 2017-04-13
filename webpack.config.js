var path = require('path');

module.exports = {
    context: path.resolve(__dirname, './src'),
    entry: { app: './app.js'},
    output: { 
            filename: '[name].bundle.js',
            path: path.resolve(__dirname, 'dist/assets'),
            publicPath: '/assets'},
    watch: true,
    devtool: "cheap-eval-source-map",
    devServer: {
        contentBase: path.resolve(__dirname, './src'),
        watchOptions: { poll: true },
        compress: true,
        port: 8080
    },
    module: {
        rules: [
            { test: /\.css$/,
            //   exclude: [/node_modules/],
              use: [{ loader: "style-loader" }, { loader: "css-loader" }]
            },
            { test: /\.js$/, // include .js files
              enforce: "pre", // preload the jshint loader
              exclude: /node_modules/, // exclude any and all files in the node_modules folder
              use: [{loader: "jshint-loader",
                            options: { camelcase: true, emitErrors: false, failOnHint: false, esversion: 6 }}]
            },
            { test: /\.js$/,
              exclude: [/node_modules/],
              use: [{ loader: 'babel-loader', options: { presets: ['es2015'] }}],
            },
            {
                test: /\.(woff2?|ttf|eot|jpe?g|png|gif|svg)$/,
                loader: 'file-loader'
            }                        
        ]
    }
};