﻿const dotenv = require("dotenv");
const fs = require("fs");
const path = require("path");
const webpack = require("webpack");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const regeneratorRuntime = require("regenerator-runtime");
module.exports = env => {
  // Get the root path (assuming your webpack config is in the root of your project!)
  const currentPath = path.join(__dirname);

  // Create the fallback path (the production .env)
  const basePath = currentPath + "/.env";

  // We're concatenating the environment name to our filename to specify the correct env file!
  const envPath = basePath + "." + env;

  // Check if the file exists, otherwise fall back to the production .env
  const finalPath = fs.existsSync(envPath) ? envPath : basePath;

  // Set the path parameter in the dotenv config
  const fileEnv = dotenv.config({ path: finalPath }).parsed;
  console.log(finalPath)
  // reduce it to a nice object, the same as before (but with the variables from the file)
  const envKeys = Object.keys(fileEnv).reduce((prev, next) => {

    prev[`process.env.${next}`] = JSON.stringify(fileEnv[next]);
    return prev;
  }, {});

  return {
    context: path.resolve(__dirname),
    entry: {
      vendor: ["react", "react-dom", "react-redux", "react-router", "react-router-dom", "redux", "redux-saga", "babel-polyfill"],
      app: "./src/index.tsx"
    },
    output: {
      publicPath: "/"
    },
    resolve: {
      extensions: [".webpack.js", ".web.js", ".mjs", ".json", ".js", ".jsx", ".ts", ".tsx"],
      modules: [path.resolve(__dirname, "./src"), "./node_modules"]
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          loader: "babel-loader"
        },
        {
          test: /\.css$/,
          use: ["style-loader", "css-loader"]
        },
        {
          test: /\.scss$/,
          use: [{
            loader: 'style-loader'
          },
          {
            loader: 'css-loader',
            options: {
              sourceMap: true,
            }
          },
          {
            loader: 'sass-loader',
            options: {
              sourceMap: true,
            }
          }]
        },
        {
          test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
          use: [
            {
              loader: "file-loader",
              options: {
                name: "[name].[ext]",
                outputPath: "fonts/"
              }
            }
          ]
        },
        {
          test: /\.(png|jpe?g|gif)$/i,
          loader: "file-loader",
          options: {
            name: "[path][name].[ext]"
          }
        }
      ]
    },
    // optimization: {
    //   splitChunks: {
    //     cacheGroups: {
    //       default: false,
    //       vendors: false,
    //       // vendor chunk
    //       vendor: {
    //         // sync + async chunks
    //         chunks: 'all',
    //         // import file path containing node_modules
    //         test: /node_modules/
    //       }
    //     }
    //   }
    // },
    plugins: [
      new CleanWebpackPlugin({ cleanOnceBeforeBuildPatterns: ["./build/*.*"] }),
      new CopyWebpackPlugin([
        {
          from: "./public/index.html"
        },
        {
          from: "./src/assets"
        },
      ]),
      new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
      new HtmlWebpackPlugin({
        template: path.resolve(__dirname, "./public/index.html"),
        chunksSortMode: "dependency",
        title: "panorama",
        favicon: "./src/assets/img/favicon.ico"
      }),
      new webpack.DefinePlugin(envKeys)
    ]
  };
};
