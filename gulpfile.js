// Gulp file for task runner
// Automatically watch changes of javascript file, re-build
var gulp = require('gulp');
var sourcemaps = require('gulp-sourcemaps');
var uglify = require('gulp-uglify');
var annotate = require('gulp-ng-annotate');
var plumber = require('gulp-plumber');
var concat = require('gulp-concat');
var gutil = require('gulp-util');
var watch = require('gulp-watch');


gulp.task('building scripts', function() {
  gulp.src(['./client/**/*.js'])
    .pipe(plumber({
      errorHandler: function(err) {
        gutil.beep();
      }
    }))
    .pipe(sourcemaps.init())
    .pipe(concat('./app.min.js'))
    //.pipe(annotate())
/*
        .pipe(uglify({
          mangle: true
        })) */
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('./public'));
});

gulp.task('watching changes', function() {
  watch(['./client/**/*.js', '!./client/app.min.js'], function() {
    //gutil.beep();
    gulp.start('building scripts');
  });
});

gulp.task('default', ['building scripts', 'watching changes']);
