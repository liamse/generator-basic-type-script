const path = require('path')
const webpack = require('webpack')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')

const inProduction = (process.env.NODE_ENV === 'production')

module.exports = {
    entry: {
        app: './src/app.ts'
    },
    output: {
        path: path.join(process.cwd(), 'dist'),
        filename: '[name].js',
        sourceMapFilename: '[file].map',
        library: 'someLibName',
        libraryTarget: 'umd'
    },
    resolve: {
        extensions: ['.ts', '.tsx', '.js', '.json']
    },
    module: {
        rules: [
            {
                test: /\.json$/,
                loaders: [
                    'json-loader'
                ]
            },
            {
                test: /\.(tsx|ts)?$/,
                use: [{
                    loader: 'ts-loader',
                    options: {
                        configFile: path.resolve(process.cwd(), 'conf', 'tsconfig.json')
                    }
                }],
                exclude: /node_modules/
            },
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                loader: 'babel-loader'
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'eslint-loader',
                enforce: 'pre'
            }
        ]
    },
    plugins: [
        new CleanWebpackPlugin(['dist'], {
            root: path.join(process.cwd()),
            verbos: true,
            dry: false
        })
    ],
    devServer: {
        contentBase: path.join(process.cwd(), 'dist'),
        compress: true,
        port: 9000
    },
    devtool: 'source-map'
}
// add this when we webpack in production mode
if (inProduction) {
    // uglify, in other means minify the javascript files.
    module.exports.plugins.push(
        new webpack.optimize.UglifyJsPlugin()
    )
    module.exports.plugins.push(
        new webpack.LoaderOptionsPlugin({
            minimize: true
            // if use PurifyCSSPlugin this is ignore, you must write minimize: true after paths
        })
    )
}
