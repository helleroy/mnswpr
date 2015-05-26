var source = require('vinyl-source-stream');
var gulp = require('gulp');
var browserify = require('browserify');
var reactify = require('reactify');
var watchify = require('watchify');
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

// Based on: http://blog.avisi.nl/2014/04/25/how-to-keep-a-fast-build-with-browserify-and-reactjs/
function buildScript(file, watch) {
    var props = {
        entries: ['./src/' + file],
        transform: [reactify],
        debug: false
    };
    var bundler = watch ? watchify(browserify(props)) : browserify(props);

    function rebundle() {
        bundler.bundle()
            .on('error', handleErrors)
            .pipe(source(file))
            .pipe(gulp.dest(buildDir + '/'));
    }

    bundler.on('update', function () {
        rebundle();
        console.log('Rebundle...');
    });

    return rebundle();
}


gulp.task('build', function () {
    return buildScript('app.js', false);
});


gulp.task('default', ['build'], function () {
    return buildScript('app.js', true);
});