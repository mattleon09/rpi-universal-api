//const {series} = require('gulp');
var typescript = require('gulp-tsc');
var gulp = require('gulp');

gulp.task('compile', function() {
    gup.src(['src/**/*.ts'])
    .pipe(typescript())
    .pipe(gulp.dest('dest/'))
});

gulp.task('copy:preferences',function() {
    return gulp.src('./src/preferences/*.json')
    .pipe(gulp.dest('dist/preferences/'));
});


gulp.task('watch',['watch-ts']);
gulp.task('watch.ts', ['ts'], function () {
    return gulp.watch('Scripts/**/*.ts', ['ts']);
});

gulp.task('default', ['watch']);

