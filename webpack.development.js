const webpack = require('webpack');
const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');
const autoprefixer = require('autoprefixer');

const phaserModule = path.join(__dirname, '/node_modules/phaser-ce/')
const phaser = path.join(phaserModule, 'build/custom/phaser-split.js')
const pixi = path.join(phaserModule, 'build/custom/pixi.js')
const p2 = path.join(phaserModule, 'build/custom/p2.js')

const baseCSSLoader = [
    {
        loader: 'css-loader',
        options: {
            modules: true,
            importLoaders: 1,
            localIdentName: '[name]__[local]-[hash:base64:5]',
            sourceMap: true
        }
    },
    {
        loader: 'postcss-loader',
        options: {
            plugins: (loader) => [
                require('autoprefixer')({ browsers: ['last 3 versions', 'iOS 9'] }),
            ]
        }
    }
];

const baseNotCSSModuleLoader = [
    {
        loader: 'css-loader',
        options: {
            sourceMap: true
        }
    },
    {
        loader: 'postcss-loader',
        options: {
            plugins: (loader) => [
                require('autoprefixer')({ browsers: ['last 3 versions', 'iOS 9'] }),
            ]
        }
    }
]

const config = {
    entry: {
        vendor: ['pixi.js', 'p2', 'phaser-ce'],
        index: ['webpack-hot-middleware/client?&reload=true',
            'babel-polyfill',
            './src/index.ts'
        ],
       
    },
    output: {
        path: path.join(__dirname, 'dist'),
        chunkFilename: '[name].bundle.js',
        filename: '[name].js',
        publicPath: '/dist/',
        pathinfo: true
    },
    resolve: {
        extensions: [".webpack.js", ".web.js", ".ts", ".tsx", ".js", '.jsx', ".css", ".less"],
        alias: {
            '@src': path.resolve(__dirname, './src'),
            'phaser-ce': phaser,
            'pixi.js': pixi,
            'p2': p2,
        }

    },
    devtool: "cheap-module-eval-source-map",
    module: {

        rules: [
            {
                test: /\.tsx?$/,
                enforce: 'pre',
                loader: 'tslint-loader',
                options: {
                    emitErrors: true
                }
            },
            {
                exclude: [
                    /\.html$/,
                    /\.(ts|tsx)$/,
                    /\.(js|jsx)$/,
                    /\.css$/,
                    /\.less$/,
                    /\.json$/,
                    /\.bmp$/,
                    /\.gif$/,
                    /\.jpe?g$/,
                    /\.png$/,
                ],
                loader: require.resolve('file-loader'),
                options: {
                    name: 'images/[name].[hash:8].[ext]',
                },
            },
            { test: /pixi\.js/, use: ['expose-loader?PIXI'] },
            { test: /phaser-split\.js$/, use: ['expose-loader?Phaser'] },
            { test: /p2\.js/, use: ['expose-loader?p2'] },
            {
                test: /\.(tsx|jsx|js|ts)$/,
                use: [
                    'babel-loader?cacheDirectory',
                    {
                        loader: 'ts-loader',
                        options: {

                        }
                    }
                ],
                exclude: /node_modules/
            },
            {
                test: /\.jsx?$/,
                use: [
                    'babel-loader?cacheDirectory'
                ]
            },
            {
                test: /\.css/,
                use: [
                    'style-loader',
                    ...baseNotCSSModuleLoader
                ],
                exclude: /node_modules/,
            },
            {
                test: /\.(jpe?g|png|gif)/,
                loader: 'url-loader?limit=4000&name=images/[name][hash:8].[ext]'
            },
            {
                test: /\.(html)$/,
                loader: 'url-loader?limit=1&name=html/[name].[ext]'
            },
            {
                test: /\.less$/,
                use: [
                    'style-loader',
                    ...baseCSSLoader,
                    'less-loader'

                ],
                exclude: /node_modules/
            },
            {
                test: /\.(js|ts|tsx)$/, loader: "source-map-loader", enforce: 'pre'
            },
        ]
    },
    plugins: [
        new CaseSensitivePathsPlugin(),
        new webpack.DefinePlugin({
            "process.env": {
                "NODE_ENV": JSON.stringify("development")
            }
        }),
        new webpack.optimize.CommonsChunkPlugin({ name: 'vendor', filename: 'vendor.bundle.js', minChunks: Infinity }),
        new webpack.HotModuleReplacementPlugin()

    ]
};
module.exports = config;
