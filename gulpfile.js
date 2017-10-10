var gulp = require('gulp');
var watch = require('gulp-watch');
var sourcemaps = require('gulp-sourcemaps');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var annotate = require('gulp-ng-annotate');
var plumber = require('gulp-plumber');
var gutil = require('gulp-util');

gulp.task('scripts', function() {
  gulp.src(['./client/**/*.js', '!./client/**/*.test.js'])
    .pipe(plumber({
      errorHandler: function(err) {
        gutil.beep();
        console.log(err);
      }
    }))
    .pipe(sourcemaps.init())
    .pipe(concat('./app.min.js'))
    //.pipe(annotate())
    /*
        .pipe(uglify({
          mangle: true
        }))*/
    .pipe(gulp.dest('./public'))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('./public'));
});

gulp.task('watch', function() {
  watch(['./client/**/*.js', '!./client/**/*.test.js', '!./client/app.min.js'], function() {
    gulp.start('scripts');
  });
});

gulp.task('default', ['scripts', 'watch']);
