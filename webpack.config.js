const path = require('path');

module.exports = {
  mode: 'development',
  entry: './app.js', // Ajusta la ruta según la ubicación real de app.js
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'] // Aquí especifica el preset correctamente
          }
        }
      }
    ]
  }
};
