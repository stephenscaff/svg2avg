/**
 * Gulp File for Static projects using HBS partials.
 */
const gulp            = require('gulp'),
      autoprefixer    = require('gulp-autoprefixer'),
      babelify        = require('babelify'),
      browserify      = require('browserify'),
      buffer          = require('vinyl-buffer'),
      del             = require('del'),
      newer           = require('gulp-newer'),
      rename          = require('gulp-rename'),
      sass            = require('gulp-sass'),
      source          = require('vinyl-source-stream'),
      uglify          = require('gulp-uglifyes'),
      gls             = require('gulp-live-server');

// Server Port
const PORT = 9000;

// Error handler
function handleError(err) {
  console.log(err.toString());
  this.emit('end');
}

// Cleanup
function clean() {
  return del(["dist/"]);
}

// CSS
function buildCSS() {
  return gulp.src('src/assets/scss/*.scss')
  .pipe(sass({
    outputStyle: 'compressed',
    imagePath: 'assets/images/',
    precision: 3,
    errLogToConsole: true,
    autoprefixer: {add: true},
  }))
  .on('error', handleError)
  .pipe(autoprefixer())
  .pipe(rename({ suffix: '.min' }))
  .pipe(gulp.dest('dist/assets/css/'))
}

// Build JS
// uses browserify for js modules and babel for transpiling
function buildJS() {
  const bundler = browserify('src/assets/js/app.js').transform(
    'babelify',
    { presets: ['@babel/preset-env'],
      plugins: ["@babel/transform-runtime"]
    }
  )
  return bundler.bundle()
  .on('error', handleError)
  .pipe(source('app.js'))
  .pipe(buffer())
    .pipe(uglify({
      mangle: false,
      compress: false,
      output: {
        beautify: true
      }
    }))
    .pipe(rename({suffix: '.min'}))
  .pipe(gulp.dest('dist/assets/js/'));
}

// Images
function buildImages() {
  return gulp.src('src/assets/images/**/*', { allowEmpty: true })
    .pipe(newer('dist/assets/images/'))
    .pipe(gulp.dest('dist/assets/images/'))
}


// Templates
function buildViews() {
  return gulp.src('src/views/**/*')
    .pipe(newer('dist/'))
    .pipe(gulp.dest('dist/'))
}


// Serve (simple express server)
function serve() {
  var server = gls.static('dist/', PORT);
  server.start();
}


// Watcheraq
function watch() {
  gulp.watch('src/assets/scss/**/*', buildCSS)
  gulp.watch('src/assets/js/**/*', buildJS)
  gulp.watch('src/assets/images/**/*', buildImages)
  gulp.watch('src/views/**/*', buildViews)
  gulp.watch('src/**/*.html', serve, (file) => {
    server.notify.apply(server, [file]);
  });
}

// Build
var build = gulp.parallel(
  buildCSS,
  buildJS,
  buildImages,
  buildViews,
  serve,
  watch,
);

gulp.task(build);
gulp.task('default', build);
