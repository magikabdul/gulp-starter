const { src, dest, series } = require("gulp");

const browserSync = require("browser-sync");

const sourcemaps = require("gulp-sourcemaps");
const concat = require("gulp-concat");

const sass = require("gulp-sass");
const autoprefixer = require("gulp-autoprefixer");
const cleanCss = require("gulp-clean-css");

const uglify = require("gulp-uglify");

const imageMin = require("gulp-imagemin");
const changed = require("gulp-changed");

const htmlReplace = require("gulp-html-replace");
const htmlMin = require("gulp-htmlmin");

const del = require("del");

function serve() {
  browserSync.init({
    server: "./dist",
    open: false
  });

  gulp.watch("src/html/**/*.html", gulp.series(html));
  gulp.watch("src/scss/**/*.scss", gulp.series(styles, css));
  gulp.watch("src/css/**/*css", gulp.series(css));
  gulp.watch("src/images/**/*", gulp.series(images));
  gulp.watch("src/js/**/*", gulp.series(js));

  gulp.watch("dist/**/*").on("change", browserSync.reload);
}

function styles() {
  return src("./src/scss/**/*.scss")
    .pipe(sourcemaps.init())
    .pipe(sass().on("error", sass.logError))
    .pipe(autoprefixer())
    .pipe(sourcemaps.write("."))
    .pipe(dest("src/css"))
    .pipe(browserSync.stream());
}

function css() {
  return src("src/css/**/*.css")
    .pipe(concat("styles.min.css"))
    .pipe(cleanCss())
    .pipe(dest("dist/css"));
}

function js() {
  return src("src/js/**/*")
    .pipe(concat("scripts.min.js"))
    .pipe(uglify())
    .pipe(dest("dist/js"));
}

function images() {
  return src("src/images/**/*.{png,jpg,jpeg,gif}")
    .pipe(changed("dist/images"))
    .pipe(imageMin())
    .pipe(dest("dist/images"));
}

function html() {
  return src("src/html/*.html")
    .pipe(
      htmlReplace({
        css: "css/styles.min.css",
        js: "js/scripts.min.js"
      })
    )
    .pipe(
      htmlMin({
        sortAttributes: true,
        sortClassName: true,
        collapseWhitespace: true
      })
    )
    .pipe(dest("dist"));
}

function clean() {
  return del(["dist"]);
}

exports.default = series(clean, styles, css, js, images, html, serve);
exports.build = series(clean, styles, css, js, images, html);
exports.serve = serve;
exports.styles = styles;
exports.css = css;
exports.js = js;
exports.images = images;
exports.html = html;
exports.clean = clean;
