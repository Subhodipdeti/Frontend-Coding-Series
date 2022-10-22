const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
    mode: 'development',
    entry: {
        bundle: path.resolve(__dirname, 'src/js/index.js')
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name][contenthash].js',
        clean: true
    },
    devServer: {
        static: {
          directory: path.resolve(__dirname, 'dist'),
        },
        devMiddleware: {
          publicPath: '/dist/',
          writeToDisk: true,
        },
        port: 1313,
        open: true,
        hot: true,
        compress: true,
        historyApiFallback: true,
    },
    module: {
        rules: [
          {
            test: /\.js$/,
            exclude: /node_modules/,
            use: {
              loader: 'babel-loader',
              options: {
                presets: ['@babel/preset-env'],
              },
            },
          },
          {
            test: /\.css$/i,
            include: path.resolve(__dirname, "src"),
            use: ["style-loader", "css-loader", "postcss-loader"],
          },
        ],
    },
    plugins: [
        new HtmlWebpackPlugin({
          title: 'Google Calendar',
          filename: 'index.html',
          template: 'src/index.html',
        }),
    ],
}