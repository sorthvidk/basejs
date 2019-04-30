'use strict';
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const webpack = require('webpack');
const path = require('path');

var config = {
	mode: process.env.NODE_ENV === 'production' ? 'production' : 'development',
	entry: {
		app: './src/js/index.js'
	},
	output: {
		filename: '[name].js',
		path: __dirname + '/dist/base.js',
		sourceMapFilename: 'maps/[name].js.map',
		libraryTarget: 'umd',
	},
	module: {
		rules: [
			{
				test: /.js?$/,
				exclude: /node_modules/,
				use: {
					loader: 'babel-loader', // .babelrc for babel config
				},
			},
		],
	},
	optimization: {
		minimizer: [
			new UglifyJsPlugin({
				cache: true,
				parallel: true,
				sourceMap: true, // set to true if you want JS source maps
			}),
			//new OptimizeCSSAssetsPlugin({})
		],
	},
	devtool: 'source-map',
};

module.exports = config;
