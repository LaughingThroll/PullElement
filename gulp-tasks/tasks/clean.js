/* global G*/ 
module.exports = () => {
  G.gulp.task('clean', async function () {
    return await G.del.sync(['dist', '!dist/images'])
  });
  G.gulp.task('clean:images', async function () {
    return await G.del.sync('dist/images')
  });

  G.gulp.task('clean:js', async function () {
    return await G.del.sync('dist/js')
  });
  
}