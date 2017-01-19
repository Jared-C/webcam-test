'use strict';

const gulp = require('gulp');
const sourcemaps = require('gulp-sourcemaps');
const eslint = require('gulp-eslint');
const babel = require('gulp-babel');
const sass = require('gulp-sass');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const imagemin = require('gulp-imagemin');

const reportError = function (error) {
	if(error.cause) {
		console.log([
			`${error.plugin} error\n`,
			`${error.cause.message}\n`,
			`${error.cause.filename}: ${error.cause.line}`
		].join(''));
	} else if (error.stack) {
		console.log(error.stack);
	} else {
		console.log(error);
	}

	this.emit('end');
};

gulp.task('sass', function () {
	return gulp.src('./source/scss/**/*.scss')
		.pipe(sourcemaps.init())
		.pipe(sass({ outputStyle: 'compressed' }).on('error', sass.logError))
		.pipe(sourcemaps.write('./'))
		.pipe(gulp.dest('./public/css'));
});

gulp.task('js', function () {
	return gulp.src('./source/js/**/*.js')
		.pipe(eslint())
		.pipe(eslint.format())
		.pipe(sourcemaps.init())
		.pipe(babel({ presets: ['es2015'] }).on('error', reportError))
		.pipe(concat('scripts.js'))
		.pipe(uglify().on('error', reportError))
		.pipe(sourcemaps.write('./'))
		.pipe(gulp.dest('./public/js'));
});

gulp.task('img', function () {
	return gulp.src('source/img/**')
		.pipe(imagemin())
		.pipe(gulp.dest('./public/img'));
});

gulp.task('default', ['sass', 'js', 'img', 'copy-assets']);

gulp.task('watch', function () {
	const scss_watcher = gulp.watch('./source/scss/**/*.scss', ['sass']);
	scss_watcher.on('change', function (event) {
		console.log(`File ${event.path} was ${event.type}, running tasks...`);
	});

	const js_watcher = gulp.watch('./source/js/**/*.js', ['js']);
	js_watcher.on('change', function (event) {
		console.log(`File ${event.path} was ${event.type}, running tasks...`);
	});

	const img_watcher = gulp.watch('source/img/**', ['img']);
	img_watcher.on('change', function (event) {
		console.log(`File ${event.path} was ${event.type}, running tasks...`);
	});
});