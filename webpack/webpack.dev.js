const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { merge } = require('webpack-merge');
const commonConfig = require('./webpack.common');

const devConfig = {
	mode: "development",
	entry: path.resolve(__dirname, "../src/index.jsx"),
	devtool: "inline-source-map",
	devServer: {
		static: path.resolve(__dirname, "../public"),
		port: 3000,
		historyApiFallback: true,
		open: true,
		hot: true,
		proxy: [
			{
				context: ['/api/devtest'],
				target: 'https://devtest.teskalabs.com',
				changeOrigin: true,
				pathRewrite: { '^/api/devtest': '' },
			},
			{
				context: ['/api/dogapi'],
				target: 'https://api.thedogapi.com',
				changeOrigin: true,
				pathRewrite: { '^/api/dogapi': '/v1' },
				headers: { 'x-api-key': process.env.DOGAPI_KEY },
			}
		]
	},
	resolve: {
		extensions: [".js", ".jsx"]
	},
	plugins: [
		new HtmlWebpackPlugin({
			template: path.resolve(__dirname, "../public/index.html")
		})
	]
};

// Merge common and dev configs
module.exports = merge(commonConfig, devConfig);
