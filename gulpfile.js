'use strict';

var gulp = require('gulp');
var del = require('del');
var htmlmin = require('gulp-htmlmin');
var gulpStylelint = require('gulp-stylelint');
var postcss = require('gulp-postcss');
var atImport = require("postcss-import");
var autoprefixer = require('autoprefixer');
var cssmin = require('gulp-csso');
var pump = require('pump');
var imagemin = require('gulp-imagemin');
//var svgstore = require("gulp-svgstore");
var rename = require("gulp-rename");
var browserSync = require("browser-sync").create();

gulp.task('clean', function () {
  return del('docs');
});

gulp.task('copy', function () {
  return gulp.src('assets/fonts/*.{woff,woff2}', {base: './assets/'})
    .pipe(gulp.dest('docs'));
});

gulp.task('image', function () {
  return gulp.src('assets/**/*.{png,jpg,svg}', {base: './assets/'})
    .pipe(imagemin([
      imagemin.optipng({optimizationLevel: 3}),
      imagemin.jpegtran({progressive: true}),
      imagemin.svgo()
      ]))
    .pipe(gulp.dest('docs'));
});

// gulp.task('sprite', function () {
//   return gulp.src('assets/**/icon-*.svg')
//     .pipe(svgstore({
//       inlineSvg: true
//     }))
//     .pipe(rename('sprite.svg'))
//     .pipe(gulp.dest('docs'));
// });

gulp.task('html', function() {
  return gulp.src('assets/*.html')
    .pipe(htmlmin({collapseWhitespace: true}))
    .pipe(gulp.dest('docs'));
});

// gulp.task('style-lint', function lintCssTask() {
//   return gulp
//     .src('assets/**/*.css')
//     .pipe(gulpStylelint({
//       reporters: [
//         {formatter: 'string', console: true}
//       ]
//     }));
// });

gulp.task('style', function () {
  return gulp.src('assets/style.css')
    .pipe(postcss([ atImport(), autoprefixer({grid: true}) ]))
    .pipe(cssmin())
    .pipe(gulp.dest('docs'));
});

gulp.task('dev', function() {
  browserSync.init({
    server: 'docs'
  });
  gulp.watch('assets/**/*.css', gulp.series('style'));
  gulp.watch('assets/*.html', gulp.series('html'));
  gulp.watch('assets/**/*.{png,jpg,svg}', gulp.series('image'));
  //gulp.watch('assets/**/*.{svg}', gulp.series('sprite'));
  browserSync.watch('./**/*.*').on('change', browserSync.reload);
});

gulp.task('build',
  gulp.series('clean',
  gulp.parallel('copy', 'image', 'html', 'style')
  )
);

gulp.task('default',
  gulp.series('clean',
  gulp.parallel('copy', 'image', 'html', 'style'),
  'dev')
);
