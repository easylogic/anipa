module.exports = {
  // Entry files for our popup and background pages
  entry: {
    main: "./src/index.js"
  },
  output: {
    library: "anipa",
    libraryTarget: "umd",
    path: __dirname + "/dist"
  },
  mode: 'production',
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader"
        }
      }
    ]
  }
};
