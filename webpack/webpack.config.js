const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
   mode: "production",
   entry: {
      // Chrome src files
      'chrome/translator': path.resolve(__dirname, "..", "src", "translator.ts"),
      'chrome/homeContentScript': path.resolve(__dirname, "..", "src/home", "homeContentScript.ts"),
      'chrome/homeTranslate': path.resolve(__dirname, "..", "src/home", "homeTranslate.ts"),
      'chrome/teambuilderContentScript': path.resolve(__dirname, "..", "src/teambuilder", "teambuilderContentScript.ts"),
      'chrome/teambuilderTranslate': path.resolve(__dirname, "..", "src/teambuilder", "teambuilderTranslate.ts"),
      'chrome/battleContentScript': path.resolve(__dirname, "..", "src/battle", "battleContentScript.ts"),
      'chrome/battleTranslate': path.resolve(__dirname, "..", "src/battle", "battleTranslate.ts"),

      // Firefox src files
      'firefox/translator': path.resolve(__dirname, "..", "src", "translator.ts"),
      'firefox/homeContentScript': path.resolve(__dirname, "..", "src/home", "homeContentScript.ts"),
      'firefox/homeTranslate': path.resolve(__dirname, "..", "src/home", "homeTranslate.ts"),
      'firefox/teambuilderContentScript': path.resolve(__dirname, "..", "src/teambuilder", "teambuilderContentScript.ts"),
      'firefox/teambuilderTranslate': path.resolve(__dirname, "..", "src/teambuilder", "teambuilderTranslate.ts"),
      'firefox/battleContentScript': path.resolve(__dirname, "..", "src/battle", "battleContentScript.ts"),
      'firefox/battleTranslate': path.resolve(__dirname, "..", "src/battle", "battleTranslate.ts"),
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
   performance: {
      hints: false,
      maxEntrypointSize: 512000,
      maxAssetSize: 512000
   },
   plugins: [
      new CopyWebpackPlugin({
         patterns: [
            // Chrome misc files
            {from: ".", to: "./chrome", context: "public"},
            {from: `./manifest.json`, to: 'chrome/manifest.json'},

            // Firefox misc files
            {from: ".", to: "./firefox", context: "public"},
            {
               from: `./manifest.json`, to: 'firefox/manifest.json',
               transform(content)
               {
                  var manifest = JSON.parse(content.toString());
                  const { resources = [] } = manifest.web_accessible_resources[0];

                  manifest.manifest_version = 2;
                  manifest.web_accessible_resources = resources;

                  return JSON.stringify(manifest, null, 2);
               },
            },
         ]
      }),
   ]
};