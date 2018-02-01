const webpack = require('webpack');
const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');
const autoprefixer = require('autoprefixer');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const paths = require('./paths');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const phaserModule = path.join(__dirname, '/node_modules/phaser-ce/')
const phaser = path.join(phaserModule, 'build/custom/phaser-split.js')
const pixi = path.join(phaserModule, 'build/custom/pixi.js')
const p2 = path.join(phaserModule, 'build/custom/p2.js')

const config = {
    entry: {
        vendor: ['pixi.js', 'p2', 'phaser-ce'],
        app: [
            'babel-polyfill',
            path.resolve(__dirname, 'src/index.ts'),
        ]
    },
    output: {
        path: __dirname + '/prod/',
        chunkFilename: 'js/[name].bundle.[hash:8].js',
        filename: 'js/[name].[hash:8].js',
        publicPath: '/'
    },
    resolve: {
        extensions: [".webpack.js", ".web.js", ".ts", ".tsx", ".js", ".css", ".less"],
        alias: {
            '@src': path.resolve(__dirname, './src'),
            'phaser-ce': phaser,
            'pixi.js': pixi,
            'p2': p2,
        }
    },
    devtool: "source-map",
    module: {
        rules: [
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
                test: /\.tsx?$/,
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
                test: /\.css$/,
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: [
                        {
                            loader: 'css-loader',
                            options: {
                                minimize: true
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
                }),
                exclude: /node_modules/,
            },
            {
                test: /\.(jpe?g|png|gif)/,
                loader: 'url-loader?limit=4000&name=images/[name][hash:8].[ext]',
            },
            {
                test: /\.(html)$/,
                loader: 'url-loader?limit=1&name=html/[name].[ext]',
                exclude: /external/
            },
            {
                test: /\.less$/,
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: [
                        {
                            loader: 'css-loader',
                            options: {
                                modules: true,
                                importLoaders: 1,
                                localIdentName: '[name]__[local]_less_[hash:base64:5]',
                                minimize: true
                            }
                        },

                        {
                            loader: 'postcss-loader',
                            options: {
                                plugins: (loader) => [
                                    require('autoprefixer')({ browsers: ['last 3 versions', 'iOS 9'] }),
                                ]
                            }
                        },
                        'less-loader'
                    ]
                }),
                exclude: /node_modules/,
            },


            // All output '.js' files will have any sourcemaps re-processed by 'source-map-loader'.
            {
                test: /\.js$/, loader: "source-map-loader", enforce: 'pre'
            }
        ]
    },
    plugins: [
        new CaseSensitivePathsPlugin(),

        new webpack.DefinePlugin({
            "process.env": {
                "NODE_ENV": JSON.stringify("production")
            }
        }),
        new webpack.optimize.CommonsChunkPlugin({ name: 'vendor', filename: 'js/vendor.bundle.[hash:8].js' }),
        new webpack.optimize.UglifyJsPlugin({
            drop_console: true,
            minimize: true,
            sourceMap:true,
            output: {
                comments: false
            }
        }),


        new ExtractTextPlugin({ filename: "style/style.[hash:8].css" }),
        new HtmlWebpackPlugin({
            inject: true,
            template: paths.appHtml
        }),
        new CopyWebpackPlugin(
            [
                { from: './external', to: './' }
            ],
            {
                ignore: [
                    // Doesn't copy any files with a txt extension
                    'index.html',
                    '*.md'
                ],

                // By default, we only copy modified files during
                // a watch or webpack-dev-server build. Setting this
                // to `true` copies all files.
                copyUnmodified: true
            }
        )
    ]
};

module.exports=config
