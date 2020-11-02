/* global G*/ 
module.exports = () => {
  G.gulp.task('watch', function () {

  global.isWatching = true

  G.gulp.watch('app/**/*.scss', G.gulp.parallel('sass'))
  G.gulp.watch('app/**/*.html', G.gulp.parallel('html'))
  G.gulp.watch(['app/**/*.js', '!app/js/*.min.js'], G.gulp.series('clean:js', 'webpackJs'))
  })
}