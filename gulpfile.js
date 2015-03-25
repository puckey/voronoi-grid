var gulp = require('gulp');
var uglify = require('gulp-uglify');
var streamify = require('gulp-streamify');
var rename = require('gulp-rename');
var watchify = require('gulp-watchify');


gulp.task('default', watchify(function (watchify) {
  gulp.src('./VoronoiGrid.js')
    .pipe(watchify({
      watch: false,
      standalone: 'VoronoiGrid'
    }))
    .pipe(gulp.dest('./dist/'))
    .pipe(gulp.dest('./example/lib/'))
    .pipe(streamify(rename({
        suffix: "-min"
    })))
    .pipe(streamify(uglify()))
    .pipe(gulp.dest('./dist/'))
    .pipe(gulp.dest('./example/lib/'));
}));

