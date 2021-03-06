/*jslint node: true */
'use strict';

var gulp        = require('gulp'),
    cleanCSS    = require('gulp-clean-css'),
    browserSync = require('browser-sync').create(),
    imagemin    = require('gulp-imagemin'),
    sass        = require('gulp-sass'),
    cache       = require('gulp-cache'),
    uglify      = require('gulp-uglify'),
    concat      = require('gulp-concat'),
    postcss     = require('gulp-postcss'),
    uncss       = require('postcss-uncss'),
    rename      = require('gulp-rename'),
    pngquant    = require('imagemin-pngquant');

// HTML build
gulp.task('html', function () {
  return gulp.src('app/index.html')
    .pipe(gulp.dest('dist'))
    .pipe(browserSync.reload({
      stream: true
    }));
})

// SCSS build
gulp.task('scss', function () {
  return gulp.src('app/scss/main.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(cleanCSS())
    .pipe(gulp.dest('dist'))
    .pipe(browserSync.reload({
      stream: true
    }));
})

// UNCSS build
gulp.task('clean:css', function () {
    return gulp.src('dist/main.css')
        .pipe(postcss(
          [require('postcss-uncss')
            ({
	            html: ['dist/index.html', 'dist/ajax/*.html'],
              ignore: ['#ribbon', '.breadcrumb']
            })]
        ))
        .pipe(rename('main.clean.css'))
        .pipe(cleanCSS())
        .pipe(gulp.dest('dist'));
});

// CSS build
gulp.task('css', function () {
    return gulp.src('app/css/*.css')
      .pipe(gulp.dest('dist/css'));
});

// JS build
gulp.task('js', function () {
    return gulp.src('app/js/**/*.js')
      .pipe(gulp.dest('dist/js'))
      .pipe(browserSync.reload({
        stream: true
      }));
});

// Font build
gulp.task('font', function () {
    return gulp.src('app/fonts/**/*.*')
      .pipe(gulp.dest('dist/fonts'));
});

// Sound build
gulp.task('sound', function () {
    return gulp.src('app/sound/**/*.*')
      .pipe(gulp.dest('dist/sound'));
});

// Other HTML pages build
gulp.task('html:other', function () {
    return gulp.src(['!app/index.html', 'app/*.html'])
      .pipe(gulp.dest('dist'));
});

// AJAX pages build
gulp.task('ajax', function () {
  return gulp.src('app/ajax/*.html')
    .pipe(gulp.dest('dist/ajax'))
    .pipe(browserSync.reload({
      stream: true
    }));
});

// Image build
gulp.task('image', function () {
    gulp.src('app/img/**/*')
        .pipe(cache(imagemin({
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant()],
            interlaced: true
        })))
        .pipe(gulp.dest('dist/img'))
});

// WATCH
gulp.task('watch', ['serve', 'html', 'ajax', 'scss'], function () {
  gulp.watch('app/scss/**/*.scss', ['scss']);
  gulp.watch('app/index.html', ['html']);
  gulp.watch('app/ajax/**/*.html', ['ajax']);
  gulp.watch('app/js/**/*.js', ['js']);
})

// Run browser sync
gulp.task('serve', function() {
    browserSync.init({
      server: {
        baseDir: "dist"
      },
      tunnel: false,
      host: 'localhost',
      port: 8081
    });
});

gulp.task('default', ['html', 'html:other', 'ajax', 'scss', 'clean:css', 'css', 'js', 'font', 'image', 'sound', 'watch']);
gulp.task('test', ['']);
