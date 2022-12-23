const path = require('path');
const config = require("./webpack.config");
const {merge} = require('webpack-merge');

module.exports = merge(config,{
  mode: "production",
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: 'prod-[contenthash].js',
    clean: true,
  },
  plugins:[
    new webpack.optimize.CommonsChunkPlugin('common.js'),
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.UglifyJsPlugin(),
    new webpack.optimize.AggressiveMergingPlugin()
  ]
});