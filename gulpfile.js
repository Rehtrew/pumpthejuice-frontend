'use strict';

// Include Gulp & Tools We'll Use
var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var del = require('del');
var browserSync = require('browser-sync');
var reload = browserSync.reload;
var rename = require('gulp-rename');
var sourcemaps = require('gulp-sourcemaps');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var runSequence = require('run-sequence');
var concat = require('gulp-concat');
var plumber = require('gulp-plumber');

var paths = {
	src: 'app',
	dist: 'dist',
	vendor : 'bower_components'
};

browserSync.use({
	plugin: function () { /* noop */},
	hooks: {
		'client:js': require("fs").readFileSync("./reloader.js", "utf-8") // Link to your file
	}
});

gulp.task('jshint', function () {
	return gulp.src(['app/scripts/**/*.js', '!app/scripts/vendor.js'])
		.pipe(reload({stream: true, once: true}))
		.pipe($.jshint())
		.pipe($.jshint.reporter('jshint-stylish'))
		.pipe($.if(!browserSync.active, $.jshint.reporter('fail')));
});

gulp.task('styles', function () {
	return gulp.src(
		[
			paths.src + '/styles/*.scss'
		], { dot: true }
	)
	.pipe(plumber())
	.pipe($.changed('styles', {extension: '.scss'}))
	.pipe(sourcemaps.init())
	.pipe(sass({
			includePaths: require('node-bourbon').includePaths
	}))
	.pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
	.pipe(rename({
		suffix: '.min'
	}))
	.pipe(sourcemaps.write())
	.pipe(gulp.dest('.tmp/styles'))
	.pipe(gulp.dest(paths.dist + '/styles'))
	.pipe($.size({title: 'styles'}));
});

gulp.task('images', function () {
	return gulp.src( paths.src + '/media/**/*')
		.pipe(gulp.dest('dist/media'))
		.pipe($.size({title: 'media'}));
});

gulp.task('fonts', function () {
	return gulp.src(['app/fonts/**'])
		.pipe(gulp.dest('dist/fonts'))
		.pipe($.size({title: 'fonts'}));
});

gulp.task('html', function () {
	return gulp.src( paths.src + '/**/*.html')
		// Minify Any HTML
		//.pipe($.if('*.html', $.minifyHtml()))
		// Output Files
		.pipe(gulp.dest('dist'))
		.pipe($.size({title: 'html'}));
});

gulp.task('vendor', function() {
	gulp.src([
		paths.vendor  +'/modernizr/modernizr.js',
		paths.vendor  +'/Snap.svg/dist/snap.svg-min.js',
		paths.vendor  +'/lodash/lodash.js',
		paths.vendor  +'/angular/angular.js',
		paths.vendor  +'/angular-lazy-img/release/angular-lazy-img.min.js',
		paths.vendor  +'/angular-sanitize/angular-sanitize.js',
		paths.vendor  +'/angular-ui-router/release/angular-ui-router.min.js'
	])
	.pipe(concat('vendor.js'))
	.pipe(gulp.dest('.tmp/scripts'))
	.pipe(gulp.dest(paths.dist + '/scripts'));
});

gulp.task('scripts', function() {
	gulp.src( paths.src + '/scripts/**/*.js')
		.pipe($.if(paths.src + '/scripts/**/*.js', $.uglify({preserveComments: 'some'})))
		.pipe(concat('app.js'))
		.pipe(gulp.dest('.tmp/scripts'))
		.pipe(gulp.dest(paths.dist + '/scripts'));
});

gulp.task('clean', del.bind(null, ['.tmp', 'dist']));

gulp.task('copy', function () {
	return gulp.src([
		'app/*',
		'!app/*.html',
		'node_modules/apache-server-configs/dist/.htaccess'
	], {
		dot: true
	}).pipe(gulp.dest('dist'))
		.pipe($.size({title: 'copy'}));
});

/*
*
* Tasks to run
*
* */

gulp.task('serve', ['styles'], function () {
	browserSync({
		notify  : false,
		server  : ['.tmp', 'app'],
		open    : false
	});
	gulp.watch(paths.src + '/**/*.html', ['html', reload]);
	gulp.watch(paths.src + '/styles/**/*.{scss,css}', ['styles', reload]);
	gulp.watch(paths.src + '/scripts/**/*.js', ['jshint', 'scripts']);
});

gulp.task('default', ['clean'], function (cb) {
	runSequence('styles', ['html', 'scripts', 'vendor', 'copy', 'images', 'fonts'], cb);
});
