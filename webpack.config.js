const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const Modes = {
  DEVELOPMENT: 'development',
  PRODUCTION: 'production',
};

module.exports = (env, { mode }) => {
  const isProduction = mode === Modes.PRODUCTION;

  return {
    mode,
    entry: path.join(__dirname, 'src', 'index.tsx'),
    resolve: {
      extensions: ['.tsx', '.ts', '.js', '.jsx'],
    },
    output: {
      filename: 'bundle.js',
      path: path.resolve(__dirname, 'build'),
      publicPath: '/',
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: path.join(__dirname, 'src', 'index.html'),
        favicon: path.join(__dirname, 'src', 'assets/images/favicon.ico'),
      }),
      new MiniCssExtractPlugin({
        filename: isProduction ? '[name]-[contenthash].css' : '[name].css',
      }),
    ],

    module: {
      rules: [
        {
          test: /\.(ts|tsx)?$/,
          use: 'ts-loader',
          exclude: /node_modules/,
        },
        {
          test: /\.?js$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
          },
        },
        {
          test: /\.(png|jp(e*)g|gif|webp|avif|mp4)$/,
          use: ['file-loader'],
        },
        {
          test: /\.(woff|woff2)$/,
          use: {
            loader: 'url-loader',
          },
        },
        {
          test: /\.svg$/,
          use: ['@svgr/webpack'],
        },
        {
          test: /\.s?css$/,
          oneOf: [
            {
              test: /\.m\.s?css$/,
              use: [
                MiniCssExtractPlugin.loader,
                {
                  loader: 'css-loader',
                  options: {
                    modules: true,
                  },
                },
                'sass-loader',
              ],
            },
            {
              use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader'],
            },
          ],
        },
      ],
    },

    performance: {
      maxEntrypointSize: Infinity,
      maxAssetSize: 1024 ** 2,
    },

    devtool: isProduction ? 'source-map' : 'inline-source-map',

    devServer: {
      host: '0.0.0.0',
      port: 3000,
      historyApiFallback: true,
    },
  };
};
