const path = require('path');
const fs = require('fs');

const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const RunNodeWebpackPlugin = require('run-node-webpack-plugin');

const nodeModules = {};
fs.readdirSync('node_modules')
  .filter((moduleName) => moduleName !== '.bin')
  .forEach((moduleName) => (nodeModules[moduleName] = 'commonjs ' + moduleName));

module.exports = (env, argv) => {
  const IS_PRODUCTION_BUILD = argv.mode === 'production';

  const webpackPlugins = [new ForkTsCheckerWebpackPlugin()];

  if (!IS_PRODUCTION_BUILD) {
    webpackPlugins.push(new RunNodeWebpackPlugin());
  }

  return {
    target: 'node',
    externals: nodeModules,
    node: {
      __filename: false,
      __dirname: false,
    },
    entry: path.join(__dirname, 'src', 'index.ts'),
    output: {
      path: path.join(__dirname, 'build'),
      filename: 'bundle.js',
    },
    resolve: {
      extensions: ['.ts', '.js'],
    },
    module: {
      rules: [
        {
          test: /\.ts$/,
          loaders: [{ loader: 'ts-loader', options: { transpileOnly: true } }],
        },
      ],
    },
    plugins: webpackPlugins,
  };
};
