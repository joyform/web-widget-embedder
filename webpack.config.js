const path = require('path');
const webpack = require('webpack');
const copyWebpackPlugin = require('copy-webpack-plugin');
const bundleOutputDir = './dist';

module.exports = (env) => {
    const isDevBuild = !(env && env.prod);

    return [{
        entry: './src/main.js',
        output: {
            filename: 'widget.js',
            path: path.resolve(bundleOutputDir),
        },
        devServer: {
            contentBase: bundleOutputDir
        },
        plugins: isDevBuild
            ? [new webpack.SourceMapDevToolPlugin(), new copyWebpackPlugin([{ from: 'dev/' }])]
            : [new webpack.SourceMapDevToolPlugin(), new copyWebpackPlugin([{ from: 'dev/' }])],
        optimization: {
            minimize: !isDevBuild
        },
        mode: isDevBuild ? 'development' : 'production',
        module: {
            rules: [
                // packs SVG's discovered in url() into bundle
                { test: /\.svg/, use: 'svg-url-loader' },
                { test: /\.html$/i, use: 'html-loader' },
                { test: /\.css$/i, use: ['style-loader', 'css-loader'] },
                {
                    test: /\.js$/i, exclude: /node_modules/, use: {
                        loader: 'babel-loader',
                        options: {
                            presets: [['@babel/env', {
                                'targets': {
                                    'browsers': ['IE 11, last 2 versions']
                                }
                            }]]
                        }
                    }
                }
            ]
        }
    }];
};