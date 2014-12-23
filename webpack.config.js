var webpack = require('webpack');

module.exports = {
  plugins: [
    new webpack.IgnorePlugin(/.*\.md$/),
    new webpack.IgnorePlugin(/easysax/),
    new webpack.IgnorePlugin(/node-xml/)
  ],
  node: {
    fs: "empty"
  }
};
