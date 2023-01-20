const webpack = require("webpack")
const path = require('path');
const config = require("./webpack.config");
const {merge} = require('webpack-merge');
const TerserPlugin = require("terser-webpack-plugin");

module.exports = merge(config,{
  mode: "production",
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: 'prod-[contenthash].js',
    clean: true,
  },

  plugins:[
    new webpack.optimize.SplitChunksPlugin({filename:'common.js'}),
    new webpack.optimize.AggressiveMergingPlugin()
  ],
  optimization: {
    minimize: true,
    minimizer: [new TerserPlugin()],
  },
});