const path = require("path");
const HtmlWebPackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
  entry: path.resolve(__dirname, "./client/src/index.jsx"),
  output: {
    path: path.resolve(__dirname, "./public/dist"),
    filename: "main.js"
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        include: [
          path.resolve(__dirname, "./client/src")
        ],
        exclude: [
          path.resolve(__dirname, "./node_modules")
        ],
        loader: "babel-loader",
        options: {
          presets: ["env", "react"]
        }
      },
      {
        test: /\.html$/,
        use: [
            {
                loader: "html-loader",
                options: {minimize: true}
            }
        ]
      },
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, "css-loader"]
      }
    ]
  },
  plugins: [
    new HtmlWebPackPlugin({
      template: "./client/src/index.html",
      filename: './../index.html'
    }),
    new MiniCssExtractPlugin({
        filename: "styles.css"
    })
  ]
}
