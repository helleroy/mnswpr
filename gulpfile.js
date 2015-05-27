var source = require('vinyl-source-stream');
var gulp = require('gulp');
var gutil = require('gulp-util');
var less = require('gulp-less');
var browserify = require('browserify');
var reactify = require('reactify');
var watchify = require('watchify');
var plumber = require('gulp-plumber');
var notify = require("gulp-notify");

var buildDir = './src/public/assets/js';

function handleErrors() {
    var args = Array.prototype.slice.call(arguments);
    notify.onError({
        title: "Compile Error",
        message: "<%= error %>"
    }).apply(this, args);
    this.emit('end'); // Keep gulp from hanging on this task
}

function createBrowserify() {
    return browserify({
        entries: ['./src/app.js'],
        transform: [reactify],
        debug: false
    });
}

gulp.task('script-build', function () {
    gutil.log('Compiling scripts...');
    createBrowserify().bundle()
        .on('error', handleErrors)
        .pipe(source('app.js'))
        .pipe(gulp.dest(buildDir + '/'));
});

gulp.task('style', function () {
    gutil.log('Compiling LESS...');
    gulp.src('./src/less/main.less')
        .pipe(plumber())
        .pipe(less({paths: ['./src/less']}))
        .pipe(gulp.dest('./src/public/assets/css/'))
});

gulp.task('script-watch', function () {
    var bundler = watchify(createBrowserify())
        .on('update', function () {
            rebundle();
        });

    function rebundle() {
        gutil.log('Recompiling scripts...');
        bundler
            .bundle()
            .on('error', handleErrors)
            .pipe(source('app.js'))
            .pipe(gulp.dest(buildDir + '/'));
    }
});

gulp.task('watch', ['script-watch'], function () {
    gutil.log('Watching for changes...');
    gulp.watch('./src/less/*.less', ['style']);
    gulp.watch('./src/components/**/*.js', ['script-build']);
    gulp.watch('./src/app.js', ['script-build']);
});

gulp.task('build', ['script-build', 'style']);

gulp.task('default', ['build', 'watch']);

