let path = require('path');
let webpack = require('webpack');
module.exports = {
	devtool: "inline-source-map",
    entry: './src/index.js',
    output: {
        path: path.join(__dirname, 'dist'), //输出目录的配置，模板、样式、脚本、图片等资源的路径配置都相对于它
        filename: "bundle.js"
    },
    module: {
        rules: [

        ]
    },

    devServer: { 
        contentBase: path.join(__dirname, 'dist'),
        inline: true,
        watchContentBase: true,
    }
};