var gulp = require('gulp'),
    sass = require('gulp-ruby-sass'),
    less = require('gulp-less'),
    rewriteCSS = require('gulp-rewrite-css'),
    path = require('path'),
    autoprefixer = require('gulp-autoprefixer'),
    cssnano = require('gulp-cssnano'),
    jshint = require('gulp-jshint'),
    uglify = require('gulp-uglify'),
    imagemin = require('gulp-imagemin'),
    rename = require('gulp-rename'),
    concat = require('gulp-concat'),
    notify = require('gulp-notify'),
    cache = require('gulp-cache'),
    livereload = require('gulp-livereload'),
    del = require('del'),
    merge = require('merge-stream');

/*
 |--------------------------------------------------------------------------
 | Default task
 |--------------------------------------------------------------------------
 */

gulp.task('default', ['clean'], function() {
    gulp.start('styles', 'scripts', 'copy', 'images');
});

/*
 |--------------------------------------------------------------------------
 | Watch
 |--------------------------------------------------------------------------
 */

gulp.task('watch', function() {

  // Create LiveReload server
  livereload.listen();

  // Watch .scss files
  gulp.watch('resources/assets/less/**/*.less', ['styles']);

  // Watch .js files
  gulp.watch('resources/assets/js/**/*.js', ['scripts']);

  // Watch image files
  gulp.watch('../assets/images/**/*', ['images']);

});

gulp.task('watch_styles', function() {

  // Create LiveReload server
  livereload.listen();

  // Watch .scss files
  gulp.watch('resources/assets/sass/**/*.scss', ['styles']);

});

gulp.task('watch_scripts', function() {

  // Create LiveReload server
  livereload.listen();

  // Watch .js files
  gulp.watch('resources/assets/js/**/*.js', ['scripts']);

});

/*
 |--------------------------------------------------------------------------
 | Styles
 |--------------------------------------------------------------------------
 */

gulp.task('styles', function() {

  var lessStream = gulp.src([
      'resources/assets/less/*.less'
    ])
  	.pipe(less({
      paths: [
        path.join(
          __dirname, 
        'icons'
        )
      ]
    }))
    .pipe(concat('less-files.less'));

  var scssStream = sass([
    'resources/assets/sass/style.scss',
    'bower_components/ladda/css/ladda.scss'
    ], {
      style: 'expanded',
      loadPath: [
        'resources/assets/sass',
        'bower_components/ladda/css',
        'bower_components/spinthatshit/src',
        'bower_components/spinthatshit/src/loaders'
      ]
    })
    .pipe(concat('scss-files.scss'));

  var cssStream = gulp.src([
      'bower_components/bootstrap/dist/css/bootstrap.css',
      'bower_components/sweetalert/dist/sweetalert.css',
      'bower_components/datatables.net-bs/css/dataTables.bootstrap.css',
      'bower_components/datatables.net-responsive-bs/css/responsive.bootstrap.css',
      'bower_components/select2/dist/css/select2.css',
      'bower_components/dropzone/dist/dropzone.css',
      'bower_components/bootstrap-colorpicker/dist/css/bootstrap-colorpicker.css',
      'bower_components/bootstrap-datepicker/dist/css/bootstrap-datepicker3.css',
      'bower_components/bootstrap-daterangepicker/daterangepicker.css',
      'bower_components/bootstrap-touchspin/dist/jquery.bootstrap-touchspin.css',
      'bower_components/jquery-colorbox/example1/colorbox.css',
/*
      'bower_components/tinymce/skins/lightgray/content.inline.min.css',
      'bower_components/tinymce/skins/lightgray/content.min.css',
      'bower_components/tinymce/skins/lightgray/skin.min.css',
*/
    ])
    .pipe(rewriteCSS({
      debug: false,
      destination: '../assets/css/',
      adaptPath: function(path) {
        var tgt = path.targetFile;
        tgt = tgt.replace('/img/', '/images/');
        return tgt;
      }
    }))
    .pipe(concat('css-files.css'));

  var mergedStream = merge(cssStream, lessStream, scssStream)
      .pipe(concat('styles.css'))
      .pipe(autoprefixer({
        browsers: ['last 2 version'], 
        cascade: false
      }))
      .pipe(gulp.dest('../assets/css'))
      .pipe(rename({suffix: '.min'}))
      .pipe(cssnano())
      .pipe(gulp.dest('../assets/css'))
      .pipe(livereload())
      .pipe(notify({ message: 'Styles task complete' }));

  return mergedStream;
});

/*
 |--------------------------------------------------------------------------
 | Scripts
 |--------------------------------------------------------------------------
 */

gulp.task('scripts', function() {
  return gulp.src([
      'bower_components/jquery/dist/jquery.js',
      'bower_components/jquery-ui/jquery-ui.js',
      'bower_components/director/build/director.js',
      'bower_components/bootstrap/dist/js/bootstrap.js',
      'bower_components/bootstrap-validator/dist/validator.js',
      'bower_components/fastclick/lib/fastclick.js',
      'bower_components/blockUI/jquery.blockUI.js',
      'bower_components/jquery.nicescroll/dist/jquery.nicescroll.min.js',
      'bower_components/jquery-colorbox/jquery.colorbox.js',
      'bower_components/jquery.scrollTo/jquery.scrollTo.js',
      'bower_components/wow/dist/wow.js',
  		'bower_components/jquery-form/jquery.form.js',
      'bower_components/ladda/js/spin.js',
      'bower_components/ladda/js/ladda.js',
      'bower_components/ladda/js/ladda.jquery.js',
      'bower_components/sweetalert/dist/sweetalert.min.js',
      'bower_components/datatables.net/js/jquery.dataTables.js',
      'bower_components/datatables.net-bs/js/dataTables.bootstrap.js',
      'bower_components/datatables.net-responsive/js/dataTables.responsive.js',
      'bower_components/datatables.net-responsive-bs/js/responsive.bootstrap.js',
      'bower_components/select2/dist/js/select2.js',
      'bower_components/moment/moment.js',
      'bower_components/dropzone/dist/dropzone.js',
      'bower_components/bootstrap-colorpicker/dist/js/bootstrap-colorpicker.js',
      'bower_components/bootstrap-datepicker/dist/js/bootstrap-datepicker.js',
      'bower_components/bootstrap-daterangepicker/daterangepicker.js',
      'bower_components/bootstrap-touchspin/dist/jquery.bootstrap-touchspin.js',
      'bower_components/Flot/jquery.flot.js',
/*      'bower_components/Flot/jquery.flot.stack.js',*/
      'bower_components/Flot/jquery.flot.time.js',
      'bower_components/Flot/jquery.flot.pie.js',
      'bower_components/flot.tooltip/js/jquery.flot.tooltip.js',

      'bower_components/tinymce/tinymce.js',
      /*'bower_components/tinymce/plugins/** /*.js',*/
      'bower_components/tinymce/plugins/link/plugin.js',
      'bower_components/tinymce/plugins/paste/plugin.js',
      'bower_components/tinymce/plugins/contextmenu/plugin.js',
      'bower_components/tinymce/plugins/textpattern/plugin.js',
      'bower_components/tinymce/plugins/autolink/plugin.js',
      'bower_components/tinymce/plugins/image/plugin.js',
      'bower_components/tinymce/plugins/code/plugin.js',

      'bower_components/tinymce/themes/inlite/theme.js',
      'bower_components/tinymce/themes/modern/theme.js',

      'resources/assets/js/**/*.js'
    ])
//    .pipe(jshint('.jshintrc'))
//    .pipe(jshint.reporter('default'))
    .pipe(concat('scripts.js'))
    .pipe(gulp.dest('../assets/js'))
    .pipe(rename({suffix: '.min'}))
    .pipe(uglify())
    .pipe(gulp.dest('../assets/js'))
    .pipe(livereload())
    .pipe(notify({ message: 'Scripts task complete' }));
});


gulp.task('scripts_map', function() {
  return gulp.src([
      'bower_components/jvectormap/jquery-jvectormap.js',
      'bower_components/jvectormap/lib/jquery-mousewheel.js',
      'bower_components/jvectormap/src/jvectormap.js',
      'bower_components/jvectormap/src/abstract-element.js',
      'bower_components/jvectormap/src/abstract-canvas-element.js',
      'bower_components/jvectormap/src/abstract-shape-element.js',
      'bower_components/jvectormap/src/svg-element.js',
      'bower_components/jvectormap/src/svg-group-element.js',
      'bower_components/jvectormap/src/svg-canvas-element.js',
      'bower_components/jvectormap/src/svg-shape-element.js',
      'bower_components/jvectormap/src/svg-path-element.js',
      'bower_components/jvectormap/src/svg-circle-element.js',
      'bower_components/jvectormap/src/svg-image-element.js',
      'bower_components/jvectormap/src/svg-text-element.js',
      'bower_components/jvectormap/src/vml-element.js',
      'bower_components/jvectormap/src/vml-group-element.js',
      'bower_components/jvectormap/src/vml-canvas-element.js',
      'bower_components/jvectormap/src/vml-shape-element.js',
      'bower_components/jvectormap/src/vml-path-element.js',
      'bower_components/jvectormap/src/vml-circle-element.js',
      'bower_components/jvectormap/src/vector-canvas.js',
      'bower_components/jvectormap/src/simple-scale.js',
      'bower_components/jvectormap/src/ordinal-scale.js',
      'bower_components/jvectormap/src/numeric-scale.js',
      'bower_components/jvectormap/src/color-scale.js',
      'bower_components/jvectormap/src/legend.js',
      'bower_components/jvectormap/src/data-series.js',
      'bower_components/jvectormap/src/proj.js',
      'bower_components/jvectormap/src/map-object.js',
      'bower_components/jvectormap/src/region.js',
      'bower_components/jvectormap/src/marker.js',
      'bower_components/jvectormap/src/map.js',
      'bower_components/jvectormap/src/multimap.js',
    ])
//    .pipe(jshint('.jshintrc'))
//    .pipe(jshint.reporter('default'))
    .pipe(concat('jvectormap.js'))
    .pipe(gulp.dest('../assets/js'))
    .pipe(rename({suffix: '.min'}))
    .pipe(uglify())
    .pipe(gulp.dest('../assets/js'))
    .pipe(livereload())
    .pipe(notify({ message: 'Scripts task complete' }));
});

/*
 |--------------------------------------------------------------------------
 | Images
 |--------------------------------------------------------------------------
 */

gulp.task('images', function() {
  return gulp.src('../assets/images/**/*')
    .pipe(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true }))
    .pipe(gulp.dest('../assets/images'))
    .pipe(livereload())
    .pipe(notify({ message: 'Images task complete' }));
});

/*
 |--------------------------------------------------------------------------
 | Copy
 |--------------------------------------------------------------------------
 */

gulp.task('copy', function(){
  gulp.src('bower_components/font-awesome/fonts/*.*')
    .pipe(gulp.dest('../assets/fonts/font-awesome'));

  gulp.src('bower_components/bootstrap-colorpicker/dist/img/bootstrap-colorpicker/*.*')
    .pipe(gulp.dest('../assets/images/bootstrap-colorpicker'));

  gulp.src('bower_components/jquery-colorbox/example2/images/*.*')
    .pipe(gulp.dest('../assets/images/colorbox'));
});

/*
 |--------------------------------------------------------------------------
 | Cleanup
 |--------------------------------------------------------------------------
 */

gulp.task('clean', function() {
    return del(['../assets/css', '../assets/js', '../assets/images']);
});

/*
 * Process elFinder styles
 */

gulp.task('elfinder_styles', function() {
  return sass([
     'resources/assets/sass/elfinder/app.scss'
    ], {
      style: 'expanded',
      loadPath: [
        'resources/assets/sass/elfinder'
      ]
   })
  .pipe(concat('elfinder.css'))
  .pipe(autoprefixer())
  .pipe(gulp.dest('../assets/css'))
  .pipe(rename({suffix: '.min'}))
  .pipe(cssnano())
  .pipe(gulp.dest('../assets/css'))
  .pipe(livereload());
});