/* global G*/
module.exports = () => {
  G.gulp.task('fonts', function () {
    return G.gulp.src('app/static/fonts/**/*.*')
      .pipe(G.gulp.dest('dist/fonts'))
  })
  G.gulp.task('manifest', function () {
    return G.gulp.src('app/*.json')
      .pipe(G.gulp.dest('dist/'))
  })
  G.gulp.task('images', function () {
    return G.gulp.src('app/images/**/*.*')
      .pipe(G.gulp.dest('dist/images'))
  })
  G.gulp.task('export', G.gulp.parallel('manifest', 'fonts', 'images'))

}