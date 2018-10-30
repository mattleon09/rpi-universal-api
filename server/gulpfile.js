const {series} = require('gulp');
var gulp = require('gulp');
var ts = require('gulp-typescript');
var run = require('gulp-run-command').default;


gulp.task('compile', function() {
    return gulp.src(['src/**/*.ts'])
    .pipe(ts({
        noImplicitAny: true,
    }))
    .pipe(gulp.dest('dist/'))
});

gulp.task('copy:preferences',function() {
    return gulp.src('./src/currency_exchange_api/preferences/*.json')
    .pipe(gulp.dest('dist/currency_exchange_api/preferences/'));
});


gulp.task('watch',['watch-ts','watch-node','copy:preferences'])
gulp.task('watch-node', run('npm run watch-node'))
gulp.task('watch-ts', run('npm run watch-ts'))


gulp.task('default', ['watch']);

