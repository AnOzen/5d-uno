import HtmlWebpackPlugin from "html-webpack-plugin";
import path from "node:path";
import { fileURLToPath } from "node:url";
import webpack from "webpack";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const config: webpack.Configuration = {
	entry: "./src/index.ts",
	module: {
		rules: [
			{
				test: /\.tsx?$/,
				use: "ts-loader",
				exclude: /node_modules/,
			},
			{
				test: /\.(woff|woff2|eot|ttf|otf)$/i,
				type: "asset/resource",
			},
		],
	},
	resolve: {
		extensions: [".tsx", ".ts", ".js"],
	},
	plugins: [
		new HtmlWebpackPlugin({
			template: "./src/index.html",
		}),
	],
	output: {
		filename: "bundle.js",
		path: path.resolve(__dirname, "build"),
		clean: true,
	},
	mode: "development",
	devtool: "source-map",
};

export default config;
