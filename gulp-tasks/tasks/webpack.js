/* global G __dirname */ 
// Hello users which use my gulp. I have problem, my js files no cached but i did cache plugins
// webpack-stream + gulp inject  
// gulp-rev + gulp-rev-rewrite or gulp-rev-collector
// And all would be well but i must after saving js  going change and save pug or html file.Its very long
// I know how  solve problem in webpack but no this how it's doing in gulp or gulp + webpack.
// Until the next rebuild
module.exports = () => {
  console.log(G.path.resolve(__dirname))
  const PATH = {
    js: G.path.resolve(__dirname, './../../app/static/js'),
    static: G.path.resolve(__dirname, './../../app/static')
  }
  const webConfig = {
    mode: 'none',
    entry: {
      main: `${PATH.js}/main.js`
    },
    output: {
      filename: '[name].min.js'
    },
    devtool: G.isDevelopment ? 'eval-cheap-module-source-map' : ' ',
    module: {
      rules: [
        {
          test: /\.js$/,
          loader: 'babel-loader',
          exclude: '/node_modules/'
        }
      ]
    },
    optimization: {
      minimize: G.isDevelopment ? false : true,
      minimizer: [new G.terserPlugin({
        extractComments: true,
      })],
      splitChunks: {
        cacheGroups: {
          vendor: {
            test: /node_modules/,
            name: 'vendors',
            chunks: 'all',
            enforce: true
          }
        }
      }
    },
  }

  G.gulp.task('webpackJs', function () {
    return G.gulp.src('app/static/js/*.js')
      .pipe(G.webpack(webConfig))
      .pipe(G.gulp.dest('dist/js'))
      .pipe(G.browserSync.reload({ stream: true }))
  })
}
