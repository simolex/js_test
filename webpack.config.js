const path = require('path');
const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const styleLoader = {
    loader: 'style-loader',
    options: {
    }
};

const cssLoader = {
    loader: 'css-loader',
    options: {
        sourceMap: true
    }
};

const resolveUrlLoader = {
    loader: 'resolve-url-loader',
    options: {
        sourceMap: true
    }
};

const sassLoader = {
    loader: 'sass-loader',
    options: {
        sourceMap: true
    }
};

module.exports = {
    context: __dirname,
    mode: 'development',
    entry: {
        rep_log: './assets/js/rep_log.js',
        login: './assets/js/login.js',
        layout: './assets/js/layout.js',
    },
    output: {
        path: path.join(__dirname, 'web', 'build'),
        filename: '[name].js',
        publicPath: '/build/'
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /.*node_modules/,
                loader: 'babel-loader',
                options: {
                    cacheDirectory: true
                }
            },
            {
                test: /\.css$/,
                loader: [ styleLoader, cssLoader ]
            },
            {
                test: /\.s[ac]ss$/,
                use: [
                    styleLoader,
                    cssLoader,
                    resolveUrlLoader,
                    sassLoader,
                ]
            },
            {
                test: /\.(png|jpg|jpeg|gif|ico|svg)$/,
                loader: 'file-loader',
                options: {
                    name: '[name]-[hash:6].[ext]'
                },
            },
            {
                test: /\.(woff|woff2|eot|ttf|otf)$/,
                loader: 'file-loader',
                options: {
                    name: '[name]-[hash:6].[ext]'
                },
            }
        ]
    },
    plugins: [
        new CopyWebpackPlugin([
            // copies to {output}/static
            { from: './assets/static', to: 'static' }
        ]),
        new webpack.ProvidePlugin({
            jQuery: 'jquery',
            $: 'jquery',
            'window.jQuery': 'jquery',
        })
    ],
    watch: true,
    watchOptions: {
        aggregateTimeout: 300,
        ignored: './../../node_modules'
    },
    devtool: 'inline-source-map'
};