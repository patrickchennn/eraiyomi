const path = require('path');
const config = require("./webpack.config");
const {merge} = require('webpack-merge');
const CleanTerminalPlugin = require('clean-terminal-webpack-plugin');

module.exports = merge(config, {
  mode: "development",
  devServer: {
    static: {
      directory: path.join(__dirname, "public"),
    },
    port: 3000,
    historyApiFallback: true
  },
  plugins:[
    new CleanTerminalPlugin(),
  ],
  // devtool:"inline-source-map",
  devtool: "source-map"
});