const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
   mode: "production",
   entry: {
      content: path.resolve(__dirname, "..", "src", "content.ts"),
      inject: path.resolve(__dirname, "..", "src", "inject.ts"),
      translator: path.resolve(__dirname, "..", "src", "translator.ts"),
   },
   output: {
      path: path.join(__dirname, "../dist"),
      filename: "[name].js",
   },
   resolve: {
      extensions: [".ts", ".js"],
   },
   module: {
      rules: [
         {
            test: /\.tsx?$/,
            loader: "ts-loader",
            exclude: /node_modules/,
         },
      ],
   },
   plugins: [
      new CopyWebpackPlugin({
         patterns: [{from: ".", to: ".", context: "public"}]
      }),
   ]
};