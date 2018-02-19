var gulp = require('gulp');
var browserSync = require('browser-sync').create();
var autoprefixer = require('gulp-autoprefixer');
var concat = require('gulp-concat');
var imagemin = require('gulp-imagemin');
var mincss = require('gulp-minify-css');
var minhtml = require('gulp-minify-html');
var pug = require('gulp-pug');
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var uglify = require('gulp-uglify');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var babel = require('gulp-babel');
var svgmin = require('gulp-svgmin');
var svgstore = require('gulp-svgstore');

gulp.task('scripts', function() {
  var b = browserify({
    entries: './source/scripts/main.js',
    debug: true
  });

  var p = browserify({
    entries: './source/scripts/plugin.js',
    debug: true
  });

  b
    .bundle()
    .pipe(source('main.js'))
    .pipe(buffer())
    .pipe(sourcemaps.init({ loadMaps: true }))
    .pipe(babel({ presets: ['es2015'] }))

    .pipe(sourcemaps.write())
    .pipe(gulp.dest('./app/scripts/'))
    .pipe(browserSync.stream());

  p
    .bundle()
    .pipe(source('plugin.js'))
    .pipe(buffer())
    .pipe(sourcemaps.init({ loadMaps: true }))
    .pipe(babel({ presets: ['es2015'] }))
    .pipe(uglify())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('./app/scripts/'))
    .pipe(browserSync.stream());
});

gulp.task('images', function() {
  gulp
    .src('./source/assets/**/*')
    .pipe(imagemin())
    .pipe(gulp.dest('./app/assets/'));
});

gulp.task('styles', function() {
  gulp
    .src('./source/styles/*.scss')
    .pipe(sourcemaps.init())
    .pipe(sass())
    .pipe(autoprefixer())
    .pipe(concat('main.css'))
    .pipe(mincss())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('./app/styles/'))
    .pipe(browserSync.stream());
});

gulp.task('pug', function() {
  gulp
    .src('./source/pages/*.pug')
    .pipe(pug())
    .pipe(minhtml())
    .pipe(gulp.dest('./app/'))
    .pipe(browserSync.stream());
});

gulp.task('spritesvg', function() {
  gulp
    .src('./source/assets/icons/**/*.svg')
    .pipe(svgmin())
    .pipe(svgstore())
    .pipe(gulp.dest('./app/assets/'));
});

gulp.task('default', ['scripts', 'styles', 'pug', 'images', 'spritesvg'], function() {
  browserSync.init({
    server: './app/',
    browser: 'chrome'
  });

  gulp.watch('./source/scripts/*.js', ['scripts'], browserSync.reload());
  gulp.watch('./source/**/*.js', ['scripts'], browserSync.reload());

  gulp.watch('./source/styles/*.scss', ['styles'], browserSync.reload());
  gulp.watch('./source/**/*.scss', ['styles'], browserSync.reload());


  gulp.watch('./source/pages/*.pug', ['pug'], browserSync.reload());
  gulp.watch('./source/**/*.pug', ['pug'], browserSync.reload());
  
  gulp.watch('./source/assets/**/*.*', ['images'], browserSync.reload());
  gulp.watch('./source/assets/icons/**/*.svg', ['spritesvg'], browserSync.reload());
  
  
});
