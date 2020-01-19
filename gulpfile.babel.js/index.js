const { src, dest, series, watch } = require("gulp");

const browserSync = require("browser-sync");

const sourcemaps = require("gulp-sourcemaps");
const concat = require("gulp-concat");

const sass = require("gulp-sass");
const postCss = require("gulp-postcss");
const autoprefixer = require("autoprefixer");
const cleanCss = require("gulp-clean-css");

const babel = require("gulp-babel");
const uglify = require("gulp-uglify");

const imageMin = require("gulp-imagemin");
const changed = require("gulp-changed");

const htmlReplace = require("gulp-html-replace");
const htmlMin = require("gulp-htmlmin");

const del = require("del");
const notify = require("gulp-notify");
const plumber = require("gulp-plumber");
const rename = require("gulp-rename");

const errorHandler = err => {
  notify.onError({
    title: `Gulp error in ${err.plugin}`,
    message: err.toString()
  })(err);
};

function clean() {
  return del(["dist"]);
}

function assets() {
  return src("src/assets/**/*").pipe(dest("dist/assets"));
}

function stylesDev() {
  return src("./src/scss/**/*.scss")
    .pipe(plumber(errorHandler))
    .pipe(sourcemaps.init())
    .pipe(sass().on("error", sass.logError))
    .pipe(postCss([autoprefixer({ grid: true })]))

    .pipe(cleanCss())
    .pipe(rename({ suffix: ".min" }))
    .pipe(sourcemaps.write("."))
    .pipe(dest("dist/css"))
    .pipe(browserSync.stream());
}

function stylesProd() {
  return src("./src/scss/**/*.scss")
    .pipe(plumber(errorHandler))
    .pipe(sass().on("error", sass.logError))
    .pipe(postCss([autoprefixer({ grid: true })]))
    .pipe(cleanCss())
    .pipe(rename({ suffix: ".min" }))
    .pipe(dest("dist/css"));
}

function scriptsDev() {
  return src("src/js/**/*")
    .pipe(plumber(errorHandler))
    .pipe(babel())
    .pipe(sourcemaps.init())
    .pipe(concat("scripts.js"))
    .pipe(rename({ suffix: ".min" }))
    .pipe(uglify())
    .pipe(sourcemaps.write("./"))
    .pipe(dest("dist/js"));
}

function scriptsProd() {
  return src("src/js/**/*")
    .pipe(plumber(errorHandler))
    .pipe(babel())
    .pipe(concat("scripts.js"))
    .pipe(rename({ suffix: ".min" }))
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

function serve() {
  browserSync.init({
    server: "./dist",
    open: false
  });

  watch("src/assets/**/*", series(assets));
  watch("src/scss/**/*.scss", series(stylesDev));
  watch("src/js/**/*", series(scriptsDev));
  watch("src/images/**/*", series(images));
  watch("src/html/**/*.html", series(html));

  watch("dist/**/*").on("change", browserSync.reload);
}

exports.default = series(
  clean,
  assets,
  stylesDev,
  scriptsDev,
  images,
  html,
  serve
);

exports.build = series(clean, assets, stylesProd, scriptsProd, images, html);

exports.clean = clean;
