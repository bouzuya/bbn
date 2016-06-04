coffee = require 'gulp-coffee'
espower = require 'gulp-espower'
gulp = require 'gulp'
gutil = require 'gulp-util'
mocha = require 'gulp-mocha'
sourcemaps = require 'gulp-sourcemaps'
uglify = require 'gulp-uglify'

ignoreError = (stream) ->
  stream.on 'error', (e) ->
    gutil.log e
    @emit 'end'

gulp.task 'build', (done) ->
  gulp.src './src/**/*.coffee'
  .pipe coffee()
  .pipe uglify()
  .pipe gulp.dest './lib/'

gulp.task 'build-test', ->
  gulp.src './test/**/*.coffee'
  .pipe sourcemaps.init()
  .pipe coffee()
  .pipe espower()
  .pipe sourcemaps.write()
  .pipe gulp.dest './.tmp/'

gulp.task 'build-test-dev', ->
  gulp.src './test/**/*.coffee'
  .pipe sourcemaps.init()
  .pipe ignoreError coffee()
  .pipe ignoreError espower()
  .pipe sourcemaps.write()
  .pipe gulp.dest './.tmp/'

gulp.task 'test', ['build-test'], ->
  gulp.src './.tmp/**/*.js'
  .pipe mocha()
