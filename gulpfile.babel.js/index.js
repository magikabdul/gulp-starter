const { src, dest, series, watch } = require("gulp");

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

  watch("src/html/**/*.html", series(html));
  watch("src/scss/**/*.scss", series(styles, css));
  watch("src/css/**/*css", series(css));
  watch("src/images/**/*", series(images));
  watch("src/js/**/*", series(js));

  watch("dist/**/*").on("change", browserSync.reload);
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

function cleanTempFiles() {
  return del(["src/css/styles.css", "src/css/styles.css.map"]);
}

exports.default = series(
  clean,
  styles,
  css,
  cleanTempFiles,
  js,
  images,
  html,
  serve
);
exports.build = series(clean, styles, css, cleanTempFiles, js, images, html);
exports.serve = serve;
exports.styles = styles;
exports.css = seriescss;
exports.js = js;
exports.images = images;
exports.html = html;
exports.clean = clean;
