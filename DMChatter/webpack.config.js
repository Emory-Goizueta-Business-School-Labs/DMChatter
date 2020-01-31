const path = require("path");
const webpack = require("webpack");

module.exports = {
  entry: "./ChatJs/index.js",
  mode: "development",
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /(node_modules|bower_components)/,
        loader: "babel-loader",
        options: { presets: ["@babel/env"] }
      },
    ]
  },
  resolve: { extensions: ["*", ".js", ".jsx"] },
  output: {
    path: path.resolve(__dirname, "wwwroot/js"),
    publicPath: "/js/",
    filename: "bundle.js"
  },
};