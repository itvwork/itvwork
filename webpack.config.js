var path = require('path');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var webpack = require('webpack');
module.exports = function() {
    return {
        "resolve": {
            "extensions": [
                ".ts",
                ".js",
                ".vue"
            ],
            "modules": [
                "./node_modules",
                "./node_modules"
            ],
            "symlinks": true
        },
        entry: {
            index: './app/index.js',
            // polyfill: './app/other/polyfill.js',
            // jquery:'./app/other/jquery.js'
            //vendor: 'moment'
        },
        output: {
            filename: '[name].js',
            publicPath: '/js/',
            path: path.resolve(__dirname, 'dist/js'),
        },
        module: {
            rules: [{
                    test: /\.vue$/,
                    loader: 'vue-loader'
                }, {
                    test: /\.css$/,
                    use: ExtractTextPlugin.extract({
                        use: 'css-loader'
                    })
                }, {
                    test: /\.js/,
                    loader: 'babel-loader',
                    exclude: /(node_modules)/,
                    query: {
                        presets: ['es2015', 'stage-3']
                    }
                }

                // test: /\.js$/,
                // loader: 'babel-loader?presets=es2015',
                // {
                //     test: /\.less$/,
                //     use: ExtractTextPlugin.extract(['css-loader', 'less-loader']),
                //     exclude: /node_modules/
                // }
            ],
            // loaders: [{
            //     test: /\.js$/,
            //     exclude: /(node_modules|bower_components)/,
            //     loader: 'babel-loader',
            //     query: {
            //         presets: ['es2015']
            //     }
            // }]
        },
        plugins: [
            //new ExtractTextPlugin('../style/styles.css'),
            // new webpack.optimize.UglifyJsPlugin({
            //   compress: {
            //     warnings: false
            //   }
            // }),
            //  new webpack.optimize.DedupePlugin(),//去重
            // new webpack.optimize.CommonsChunkPlugin({
            //     name: 'vendor' // 指定公共 bundle 的名字。
            // }),
            // new webpack.optimize.UglifyJsPlugin(), //压缩js,
            // new webpack.DefinePlugin({
            //     'process.env.NODE_ENV': JSON.stringify('production')
            // })
            // new webpack.DefinePlugin({
            //     'process.env': {
            //         NODE_ENV: '"production"'
            //     }
            // }),
        ]
    }
}
