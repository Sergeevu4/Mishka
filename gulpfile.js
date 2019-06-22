"use strict";

const gulp = require('gulp');
const del = require('del');
const sourcemaps = require('gulp-sourcemaps');
const gulpIf = require('gulp-if');
const plumber = require('gulp-plumber');
const rename = require('gulp-rename');
const sass = require('gulp-sass');
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const csso = require('gulp-csso');
const htmlmin = require('gulp-htmlmin');
const uglify = require('gulp-uglify');
const webp = require('gulp-webp');
const svgstore = require('gulp-svgstore');
const imagemin = require('gulp-imagemin');
const imageminJpegRecompress = require('imagemin-jpeg-recompress');
const posthtml = require('gulp-posthtml');
const include = require('posthtml-include');
const server = require('browser-sync').create();

const isDevelopment = !process.env.NODE_ENV || process.env.NODE_ENV === 'development';

/*
  const debug = require('gulp-debug');
  .pipe(debug({ title: `svg-min` })) для дебаггинга проходящих через поток файлов

  { since: gulp.lastRun('images-min') }) для того чтобы применять только для новых файлов
  (Работает на этапе поиска файлов, он просто отфильтровывает) - сверяет дату модификацию сверяет,
  но работает без чтения файлов, быстрее чем gulp-cached

  gulp-newer или gulp-changed - Он не противоречит since, он сверяет дату модификацию;

  gulp-remember и gulp-cached (содержимое которое не поменялось не будет снова добавлено, НЕ использует дату модификации, смотрит только на содержимое файла)
  Для возможной оптимизации scss, но тут понадобиться следить за всеми файлами scss + объединять их через gulp-concat
  При удалении файлов (стилей) необходимо удалить из cached:
    gulp.task('watch', function() {
      gulp.watch('путь',
      gulp.series('styles')).on('unlink', function(filepath) {
        remember.forget('styles', path.resolve(filepath));
        delete cached.caches.styles[path.resolve(filepath)];
    });
*/

// # Работа с SCSS
gulp.task("css", function () {
  return gulp.src("source/sass/style.scss")
    .pipe(plumber())
    .pipe(gulpIf(isDevelopment, sourcemaps.init()))
    .pipe(sass())
    .pipe(postcss([
      autoprefixer()
    ]))
    .pipe(gulp.dest("build/css"))
    .pipe(csso())
    .pipe(rename({ suffix: '-min' }))
    .pipe(gulpIf(isDevelopment, sourcemaps.write()))
    .pipe(gulp.dest("build/css"))
    .on('end', server.reload);
});

// # Сборка SVG спрайта + сжатие
gulp.task("sprite", function () {
  return gulp.src("source/img/svg/svg-sprite/*.svg")
  .pipe(plumber())
  .pipe(imagemin([
    imagemin.svgo ({
      plugins: [
          {removeViewBox: false},
          {removeDimensions: true}
        ]
      })
    ]))
  .pipe(svgstore ({
        inlineSvg: true
      })
    )
    .pipe(rename('sprite.svg'))
    .pipe(gulp.dest('build/img/svg/svg-sprite/'));
})

// # Минимизация HTML
gulp.task("html", function () {
  return gulp.src('source/*.html', { since: gulp.lastRun('html') })
  .pipe(plumber())
  .pipe(posthtml([include()]))
  .pipe(htmlmin({collapseWhitespace: true}))
  .pipe(rename({ suffix: '-min' }))
  .pipe(gulp.dest("build/"));
});

// # Минимизация JS
gulp.task("uglify", function () {
  return gulp.src("source/js/*.js")
  .pipe(plumber())
  .pipe(uglify())
  .pipe(rename(
    {suffix: "-min"}
    ))
  .pipe(gulp.dest("build/js/"))
  .pipe(server.stream());
});

// # Сжатие растровых картинок
gulp.task("images-min", function () {
return gulp.src("source/img/*.{png,jpg,jpeg}", { since: gulp.lastRun('images-min') })
  .pipe(imagemin([
    imagemin.optipng({optimizationLevel: 3}),
    imageminJpegRecompress({
      progressive: true,
      max: 80,
      min: 70
    })
  ]))
  .pipe(gulp.dest("build/img"));
});

// # Сжатие векторных картинок
gulp.task("svg-min", function () {
return gulp.src('source/img/svg/*.svg', { since: gulp.lastRun('svg-min') })
  .pipe(imagemin([
    imagemin.svgo ({
      plugins: [
        {removeViewBox: false},
      ]
    })
  ]))
  .pipe(gulp.dest('build/img/svg/'));
});

// # Переформатирования в webp
gulp.task("webp", function () {
  return gulp.src('source/img/**/*.{png,jpg,jpeg}', { since: gulp.lastRun('webp') })
  .pipe(webp({quality: 80}))
  .pipe(gulp.dest('build/img/'));
});

// # Копирование шрифтов
gulp.task("fonts", function () {
  return gulp.src(['source/fonts/**/*.{woff,woff2}'], {
      base: "source"
    })
  .pipe(gulp.dest("build"));
});

// # Удаление папки
gulp.task("clean", function () {
  return del("build");
});

// # Обновление страницы
gulp.task("refresh", function (done) {
  server.reload();
  done();
});

// # BUILD
gulp.task(
  'build',
  gulp.series(
    'clean',
    'sprite',
    gulp.parallel('fonts', 'css', 'html', 'uglify', 'images-min', 'svg-min', 'webp')
  )
);

// # SERVER
gulp.task("server", function () {
  server.init({
    server: {
      baseDir: "build/",
      index: "index-min.html"
    },
    notify: false,
    open: true,
    cors: true,
    ui: false
  });

  gulp.watch('source/sass/**/*.{scss,sass}', gulp.series('css'));
  gulp.watch('source/img/*.{png,jpg,jpeg}', gulp.series(gulp.parallel('webp', 'images-min'), 'refresh'));
  gulp.watch('source/img/svg/svg-sprite/*.svg', gulp.series('sprite', 'html', 'refresh'));
  gulp.watch('source/img/svg/*.svg', gulp.series('svg-min', 'refresh'));
  gulp.watch('source/*.html', gulp.series('html', 'refresh'));
  gulp.watch('source/js/*.js', gulp.series('uglify', 'refresh'));
});

gulp.task("start", gulp.series("build", "server"));
