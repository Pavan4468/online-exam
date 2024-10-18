const path = require('path');

module.exports = {
  // Entry point of your application
  entry: './src/index.js', 

  // Output configuration
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },

  // Disable source maps if you don't need them
  devtool: false,

  module: {
    rules: [
      // Rule for loading workers (e.g., Web Workers)
      {
        test: /\.worker\.js$/, // Target worker files with .worker.js extension
        use: { loader: 'worker-loader' }, // Use worker-loader for those files
      },
      
      // Rule for source-map-loader to handle JavaScript files, with face-api.js excluded
      {
        test: /\.js$/,  // Target all JavaScript files
        enforce: 'pre', // Apply this loader before others
        exclude: /node_modules\/face-api.js/, // Exclude face-api.js from this rule
        use: ['source-map-loader'], // Use source-map-loader to handle source maps
      },

      // You can add more rules here for handling other file types (CSS, images, etc.)
    ],
  },

  // Other Webpack settings can go here (e.g., resolve, optimization, plugins)
  resolve: {
    extensions: ['.js', '.jsx'],  // File extensions Webpack will resolve
  },

  // If needed, you can configure plugins here
  plugins: [
    // Add any plugins like HtmlWebpackPlugin, MiniCssExtractPlugin, etc.
  ],
};
