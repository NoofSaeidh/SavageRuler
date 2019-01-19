// const CopyWebpackPlugin = require('copy-webpack-plugin');
module.exports = {
  baseUrl: '/',
  configureWebpack: config => {
    return {
      devtool: 'source-map',
      // plugins: [
      //   new CopyWebpackPlugin([
      //     {
      //       //todo: perhaps should add if use signal r
      //       //       from:'node_modules/@aspnet/signalr/dist/browser/signalr.min.js',
      //       //       to:'dist'
      //       //   },{
      //       //       from:'node_modules/abp-web-resources/Abp/Framework/scripts/libs/abp.signalr-client.js',
      //       //       to:'dist'
      //       //   },{
      //       from: 'src/lib/abp.js',
      //       to: 'dist',
      //     },
      //   ]),
      // ],
    };
  },
};
