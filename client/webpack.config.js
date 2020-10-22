/* eslint-disable prop-types */
const HtmlWebPackPlugin = require("html-webpack-plugin");

module.exports = {
  entry: ["babel-polyfill", "./src/index.js"],
  output: {
    publicPath: "/",
    filename: "bundle.js",
  },
  devServer: {
    contentBase: "./src/assets",
    // host: "192.168.84.160",
    // port: 8081,
  },
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
        },
      },
      {
        test: /\.html$/,
        use: [
          {
            loader: "html-loader",
          },
        ],
      },
      {
        test: /\.css$/,
        include: /node_modules/,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.(png|jpg|gif|ttf|woff2|woff|eot|svg)$/,
        use: ["file-loader"],
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: ["babel-loader"],
      }, {
        test: /\.scss$/,
        use: ["style-loader", "css-loader", "sass-loader"],
      },
    ],
  },
  plugins: [
    new HtmlWebPackPlugin({
      template: "./src/index.html",
      filename: "./index.html",
    }),
  ],
};