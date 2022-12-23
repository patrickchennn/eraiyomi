const path = require('path');
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CleanTerminalPlugin = require('clean-terminal-webpack-plugin');

module.exports = {
  entry: path.resolve(__dirname,'src/index.tsx'),
  plugins: [
    new HtmlWebpackPlugin({
      template: path.join(__dirname, "public", "template.html"),
    }),
    new CleanTerminalPlugin(),
  ],
  module:{
    rules:[
      {
        test: /\.(js|tsx)$/,
        exclude: /node_modules/,
        use: 'babel-loader',
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: 'asset/resource',
      },
      {
        test: /\.css$/i,
        include: path.resolve(__dirname, 'src'),
        use: ['style-loader', 'css-loader', 'postcss-loader'],
      },
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: 'ts-loader',
      },
    ]
  },
  resolve: {
    extensions: ['.tsx', '.js', '.ts','json'],
  },
};