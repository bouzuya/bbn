coffee = require 'gulp-coffee'
gulp = require 'gulp'
uglify = require 'gulp-uglify'

gulp.task 'build', (done) ->
  gulp.src './src/**/*.coffee'
  .pipe coffee()
  .pipe uglify()
  .pipe gulp.dest './lib/'
