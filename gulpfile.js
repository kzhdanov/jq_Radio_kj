var gulp = require('gulp'),
    uglify = require('gulp-uglify');

gulp.task('minify', function () {
    gulp.src(
      ['js/jquery.radio.js',
      'js/knobKnob.jquery.js'])
        .pipe(uglify())
        .pipe(gulp.dest('build'));
});
