var path = require('path');
var HtmlWebpackPlugin = require('html-webpack-plugin');
// const ExtractTextPlugin = require("extract-text-webpack-plugin");
// var I18nPlugin = require("i18n-webpack-plugin");
// var languages = {
// 	"en": require("./src/i18n/en.json"),
// 	"sv": null
// };

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
    plugins: [
        new HtmlWebpackPlugin({ template: __dirname + '/src/index.html'})
        // ,
        // new I18nPlugin(languageConfig, optionsObj)
    ],
    resolve: {
        alias: { Components: path.resolve(__dirname, 'src/components/'),
                 Data: path.resolve(__dirname, 'src/data/'),
                 Stylesheets: path.resolve(__dirname, 'src/stylesheets/') }
        // modules: [path.resolve(__dirname, "./src"), "node_modules"]},
    },
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
            }                                           
        ]
    }
};

// In progress - translations - not using currently 

// module.exports = Object.keys(languages).map(function(language) {
// 	return {
// 		name: language,
//         context: path.resolve(__dirname, './src'),        
// 		entry: { app: './app.js'},
// 		output: {
// 			path: path.join(__dirname, "dist"),
// 			filename: language + ".output.js"
// 		},
// 		plugins: [
// 			new I18nPlugin(
// 				languages[language]
// 			)
// 		]
// 	};
// });