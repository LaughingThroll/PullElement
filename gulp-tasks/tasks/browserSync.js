/*global G */
module.exports = () => {
  G.gulp.task('browser-sync', function () {
    G.browserSync.init({
      server: {
        baseDir: "dist/"
      }
    })
  })
}
