'use strict';

var gulp = require('gulp');
var del = require('del');
var svgmin = require('gulp-svgmin');
var htmlmin = require('gulp-htmlmin');
//var gulpStylelint = require('gulp-stylelint');
var postcss = require('gulp-postcss');
var atImport = require('postcss-import');
var autoprefixer = require('autoprefixer');
var gcmq = require('gulp-group-css-media-queries');
var cssmin = require('gulp-csso');
var pump = require('pump');
var rename = require("gulp-rename");
var browserSync = require("browser-sync").create();

gulp.task('clean', function () {
  return del('docs');
});

gulp.task('copy', function () {
  return gulp.src('assets/**/*.{woff,woff2,png,jpg}', {base: './assets/'})
    .pipe(gulp.dest('docs'));
});

gulp.task('svgmin', function () {
    return gulp.src('assets/**/*.svg', {base: './assets/'})
        .pipe(svgmin())
        .pipe(gulp.dest('docs'));
});

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
    .pipe(gcmq())
    .pipe(cssmin())
    .pipe(gulp.dest('docs'));
});

gulp.task('dev', function() {
  browserSync.init({
    server: 'docs'
  });
  gulp.watch('assets/**/*.css', gulp.series('style'));
  gulp.watch('assets/*.html', gulp.series('html'));
  gulp.watch('assets/**/*.svg', gulp.series('svgmin'));
  browserSync.watch('./**/*.*').on('change', browserSync.reload);
});

gulp.task('build',
  gulp.series('clean',
  gulp.parallel('copy', 'svgmin', 'html', 'style')
  )
);

gulp.task('default',
  gulp.series('clean',
  gulp.parallel('copy', 'svgmin', 'html', 'style'),
  'dev')
);
