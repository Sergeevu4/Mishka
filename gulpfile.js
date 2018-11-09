"use strict";

var gulp = require("gulp");
var del = require("del");
var plumber = require("gulp-plumber");
var rename = require("gulp-rename");
var sass = require("gulp-sass");
var postcss = require("gulp-postcss");
var autoprefixer = require("autoprefixer");
var csso = require("gulp-csso");
var htmlmin = require("gulp-htmlmin");
var uglify = require("gulp-uglify");
var webp = require("gulp-webp");
var svgstore = require("gulp-svgstore");
var imagemin = require("gulp-imagemin");
var imageminJpegRecompress = require("imagemin-jpeg-recompress");
var posthtml = require("gulp-posthtml");
var include = require("posthtml-include");
var server = require("browser-sync").create();


gulp.task("css", function () {
  return gulp.src("source/sass/style.scss")
    .pipe(plumber())
    .pipe(sass())
    .pipe(postcss([
      autoprefixer()
    ]))
    .pipe(gulp.dest("build/css"))
    .pipe(csso())
    .pipe(rename("style-min.css"))
    .pipe(gulp.dest("build/css"))
    .pipe(server.stream());
});


gulp.task("sprite", function () {
  return gulp.src("source/img/svg/svg-sprite/*.svg")
  .pipe (imagemin([
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

  .pipe(rename("sprite.svg"))
  .pipe(gulp.dest("source/img/svg/svg-sprite/"));
})



gulp.task("html", function () {
  return gulp.src("source/*.html")
  .pipe(plumber())
  .pipe(posthtml([
    include()
  ]))
  .pipe(gulp.dest("build/"))
  .pipe(htmlmin({collapseWhitespace: true}))
  .pipe(rename(
    {suffix: "-min"}
    ))
  .pipe(gulp.dest("build/"));
});


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


// gulp.task("images", function () {
// return gulp.src("build/img/**/*.{png,jpg,svg}")
//   .pipe(imagemin([
//     imagemin.optipng({optimizationLevel: 3}),
//     imageminJpegRecompress({
//       progressive: true,
//       max: 80,
//       min: 70
//     }),
//     imagemin.svgo ({
//       plugins: [
//         {removeViewBox: false},
//         {removeDimensions: true}
//       ]
//     })
//   ]))
//   .pipe(gulp.dest("build/img"));
// });


gulp.task("images", function () {
return gulp.src("build/img/**/*.{png,jpg,svg}")
  .pipe(imagemin([
    imagemin.optipng({optimizationLevel: 3}),
    imageminJpegRecompress({
      progressive: true,
      max: 80,
      min: 70
    }),
    imagemin.svgo ({
      plugins: [
        {removeViewBox: false},
        // {removeDimensions: true}
      ]
    })
  ]))
  .pipe(gulp.dest("build/img"));
});


gulp.task("webp", function () {
  return gulp.src("source/img/**/*.{png,jpg}")
  .pipe(webp({quality: 80}))
  .pipe(gulp.dest("source/img"));
});


gulp.task("copy", function () {
  return gulp.src([
    "source/fonts/**/*.{woff,woff2}",
    "source/img/*",
    "source/img/svg/*.svg",
    "source/js/**",
    "source/pixel-glass-js/**"
    ], {
      base: "source"
    })
  .pipe(gulp.dest("build"));
});

gulp.task("copy-icon", function () {
  return gulp.src([
    "source/img/svg/*.svg",
    ], {
      base: "source"
    })
  .pipe(gulp.dest("build"));
});


gulp.task("clean", function () {
  return del("build");
});


gulp.task("refresh", function (done) {
  server.reload();
  done();
});


gulp.task("build", gulp.series(
  "clean",
  "copy",
  "css",
  "sprite",
  "html",
  "uglify",
  "images"
));


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

  gulp.watch("source/sass/**/*.{scss,sass}", gulp.series("css"));

  gulp.watch("source/img/svg/svg-sprite/*.svg", gulp.series("sprite", "html", "refresh"));
  gulp.watch("source/img/svg/*.svg", gulp.series("copy-icon", "images", "refresh"));
  gulp.watch("source/*.html", gulp.series("html", "refresh"));
  gulp.watch("source/js/*.js", gulp.series("uglify", "refresh"));

});

gulp.task("start", gulp.series("build", "server"));
