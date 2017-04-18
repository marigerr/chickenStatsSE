var path = require('path');
var HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    context: path.resolve(__dirname, './src'),
    entry: { app: './app.js'},
    output: { 
            filename: '[name].bundle.js',
            path: path.resolve(__dirname, 'dist/')
            },
    devtool: "cheap-eval-source-map",
    devServer: {
        contentBase: path.resolve(__dirname, './dist/'),
        watchOptions: { poll: true },
        compress: true,
        port: 8080
    },
    plugins: [new HtmlWebpackPlugin({
        template: __dirname + '/src/index.html'
    })],
    module: {
        rules: [
            { test: /\.css$/,
            //   exclude: [/node_modules/],
              use: [{ loader: "style-loader" }, { loader: "css-loader" }]
            },
            { test: /\.js$/, // include .js files
              enforce: "pre", // preload the jshint loader
              exclude: [/node_modules/, /selectCtrl/], // exclude any and all files in the node_modules folder
              use: [{loader: "jshint-loader",
                            options: { emitErrors: false, failOnHint: false, esversion: 6 }}]
            },
            { test: /\.js$/,
              exclude: [/node_modules/, /selectCtrl/],
              use: [{ loader: 'babel-loader', options: { presets: ['es2015'] }}],
            },
            {
                test: /\.(woff2?|ttf|eot|jpe?g|png|gif|svg)$/,
                use: [{loader: 'file-loader?name=img/[name].[ext]'}] 
            },
            {
                test: /\.geojson$/,
                use: [{loader: 'file-loader?name=GeoJson/[name].[ext]'}] 
            }                                            
        ]
    }
};