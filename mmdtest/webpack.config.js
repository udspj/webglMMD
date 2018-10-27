let path = require('path');
let webpack = require('webpack');
module.exports = {
	devtool: "inline-source-map",
    entry: {
        index :'./src/index.js',
        utils : './src/utils.js',
    },
    output: {
        path: path.join(__dirname, 'dist'), //输出目录的配置，模板、样式、脚本、图片等资源的路径配置都相对于它
        filename: '[name].bundle.js'
    },
    module: {
        rules: [
          {
            test: /\.exec\.js$/,
            use: [ 'script-loader' ]
          },
          { test: /\.(jpg|png|gif|bmp|jpeg)$/,//正则表达式匹配图片规则
            use: [{
            loader:'url-loader',
            options:{
                // limit:8192,//限制打包图片的大小：
                //如果大于或等于8192Byte，则按照相应的文件名和路径打包图片；如果小于8192Byte，则将图片转成base64格式的字符串。
                name:'images/[name]-[hash:8].[ext]',//images:图片打包的文件夹；
                //[name].[ext]：设定图片按照本来的文件名和扩展名打包，不用进行额外编码
                //[hash:8]：一个项目中如果两个文件夹中的图片重名，打包图片就会被覆盖，加上hash值的前八位作为图片名，可以避免重名。
            }
            }]}
        ]
    },

    devServer: { 
        contentBase: path.join(__dirname, 'dist'),
        inline: true,
        watchContentBase: true,
    }
};