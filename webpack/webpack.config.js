const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
   mode: "production",
   entry: {
      background: path.resolve(__dirname, "..", "src", "background.ts"),
      translator: path.resolve(__dirname, "..", "src", "translator.ts"),
      teambuilderContentScript: path.resolve(__dirname, "..", "src/teambuilder", "teambuilderContentScript.ts"),
      teambuilderTranslate: path.resolve(__dirname, "..", "src/teambuilder", "teambuilderTranslate.ts"),
      battleContentScript: path.resolve(__dirname, "..", "src/battle", "battleContentScript.ts"),
      battleTranslate: path.resolve(__dirname, "..", "src/battle", "battleTranslate.ts"),
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