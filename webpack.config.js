import path from 'path';
import webpack from 'webpack';

export default {
  entry: './public/materialesNexus/archivos/js/app.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve('./public/dist')  // `path.join` es innecesario con `path.resolve`
  },
  module: {
    rules: [
      {
        test: /\.m?js$/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      }
    ]
  }
};
