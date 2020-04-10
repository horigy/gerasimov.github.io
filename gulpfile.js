var gulp = require('gulp');
var sass = require('gulp-sass');
var rename = require("gulp-rename");
const sourcemaps = require('gulp-sourcemaps');
const autoprefixer = require('gulp-autoprefixer');
const concat = require('gulp-concat')

const del = require('del');

const browserSync = require('browser-sync').create();


const imagemin = require('gulp-imagemin'); // Подключаем библиотеку для работы с изображениями
const cache = require('gulp-cache'); // Подключаем библиотеку кеширования
const pngquant = require('imagemin-pngquant'); // Подключаем библиотеку для работы с png

const paths = {
    root: './build',
    styles: {
        src: 'src/styles/**/*.scss',
        dest: 'build/assets/styles/'
    },    
    images: {
        src: 'src/images/**/*.*',
        dest: 'build/assets/images/'
    },
    scripts: {
        src: 'src/scripts/*.js',
        dest: 'build/assets/scripts/'
    },
    fonts: {
        src: 'src/styles/fonts/*.*',
        dest: 'build/assets/styles/fonts/'
    },
    icons: {
        src: 'src/icons/*.*',
        dest: 'build/assets/images/icons/'
    },
    html: {
        src: 'src/index.html',
        dest: 'build/'
    }
}


function clean() {
    return del(paths.root);
}

function styles() {
    return gulp.src('./src/styles/main.scss')
        .pipe(autoprefixer(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], { cascade: true })) // Создаем префиксы    
        .pipe(sourcemaps.init())
        .pipe(sass({outputStyle: 'compressed'}))
        .pipe(sourcemaps.write())
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest(paths.styles.dest))
}

function fonts() {
    return gulp.src(paths.fonts.src)
        .pipe(gulp.dest(paths.fonts.dest));
}

function images() {
    return gulp.src(paths.images.src)
        .pipe(cache(imagemin({ 
            interlaced: true,
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant()]
        })))
        .pipe(gulp.dest(paths.images.dest));
}

function icons() {
    return gulp.src(paths.icons.src)
    .pipe(gulp.dest(paths.icons.dest));
}

function scripts() {
    return gulp.src(paths.scripts.src)
        .pipe(sourcemaps.init())
        .pipe(concat('main.js'))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(paths.scripts.dest));
}

function html() {
    return gulp.src(paths.html.src)
    .pipe(gulp.dest(paths.html.dest));
}

exports.styles = styles;
exports.fonts = fonts;
exports.images = images;
exports.icons = icons;
exports.scripts = scripts;
exports.html = html;

function server() {
    browserSync.init({
        server: paths.root
    });
    browserSync.watch(paths.root + '/**/*.*', browserSync.reload);
}
function watch() {
    gulp.watch(paths.styles.src, styles);
    gulp.watch(paths.fonts.src, fonts);
    gulp.watch(paths.icons.src, icons);
    gulp.watch(paths.images.src, images);
    gulp.watch(paths.scripts.src, scripts);
    gulp.watch(paths.html.src, html);
}


gulp.task('default', gulp.series(
    clean,
    gulp.parallel(styles, fonts, images, icons, scripts, html),
    gulp.parallel(watch, server)
));

