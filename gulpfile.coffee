coffee = require 'gulp-coffee'
gulp = require 'gulp'

gulp.task 'build', (done) ->
  gulp.src './src/**/*.coffee'
  .pipe coffee()
  .pipe gulp.dest './lib/'
