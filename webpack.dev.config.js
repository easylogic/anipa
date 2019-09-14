const HtmlWebPackPlugin = require("html-webpack-plugin");

module.exports = {
  // Entry files for our popup and background pages
  entry: {
    main: "./src/index.js"
  },
  output: {
    library: "anipa",
    libraryTarget: "umd",
    umdNamedDefine: true,    
    path: __dirname + "/dist"
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader"
        }
      },
      {
        test: /\.html$/,
        use: [
          {
            loader: "html-loader",
            options: { minimize: true }
          }
        ]
      }
    ]
  },
  plugins: [
    new HtmlWebPackPlugin({
      inject: 'head',
      minify: false,
      minifyCSS: false,
      chunks: ["main"],
      template: "./src/index.html",
      filename: "./index.html"
    })
  ]
};
