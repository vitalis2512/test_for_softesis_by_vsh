"use strict";

var gulp = require('gulp'),
    watch = require('gulp-watch'),
    htmlhint = require("gulp-htmlhint"),
    prefixer = require('gulp-autoprefixer'),
//concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    sass = require('gulp-sass'),
    sourcemaps = require('gulp-sourcemaps'),
    rigger = require('gulp-rigger'),
    cssmin = require('gulp-minify-css'),
//mmq = require('gulp-merge-media-queries'),
    imagemin = require('gulp-imagemin'),
    pngquant = require('imagemin-pngquant'),
    spritesmith = require('gulp.spritesmith'),
    clean = require('gulp-clean'),
    rimraf = require('rimraf'),
    browserSync = require('browser-sync'),
    reload = browserSync.reload;


gulp.task('default', ['build', 'webserver', 'watch']);

var path = {
    build: {
        html: 'build/',
        js: 'build/js/',
        css: 'build/css/',
        img: 'build/img/',
        sprite: 'build/img/sprite/',
        fonts: 'build/fonts/',
        vendor : 'build/vendor/js/',
        vendorCss : 'build/vendor/css/',
        video : 'build/video/'
    },
    src: {
        html: 'src/*.html',
        js: 'src/js/script.js',
        style: 'src/styles/style.scss',
        img: 'src/img/**/*.*',
        sprite: 'src/img/sprite/*.*',
        fonts: 'src/fonts/**/*.*',
        vendor : 'vendor/js/**/*',
        vendorCss : 'vendor/css/**/*',
        video : 'src/video/**/*'
    },
    watch: {
        html: 'src/**/*.html',
        js: 'src/js/**/*.js',
        style: 'src/styles/**/*.scss',
        img: 'src/img/**/*.*',
        sprite: 'src/img/sprite/*.*',
        fonts: 'src/fonts/**/*.*',
        vendor : 'vendor/js/**/*',
        vendorCss : 'vendor/css/**/*',
        video : 'src/video/**/*'
    },
    clean: './build'
};

var config = {
    server: {
        baseDir: "./build"
    },
    //tunnel: true,
    host: 'localhost',
    port: 9000,
    logPrefix: "frontend_dev"
};




/*gulp.task('mmq', function () {
 gulp.src('src/!**!/!*.scss')
 .pipe(mmq({
 log: true
 }))
 .pipe(gulp.dest('build/styles'));
 });*/

gulp.task('vendor:build', function () {
    gulp.src(path.src.vendor)
        .pipe(gulp.dest(path.build.vendor))
});

gulp.task('vendorCss:build', function () {
    gulp.src(path.src.vendorCss)
        .pipe(gulp.dest(path.build.vendorCss))
});

gulp.task('html:build', function () {
    gulp.src(path.src.html)
        .pipe(htmlhint())
        .pipe(rigger())
        .pipe(gulp.dest(path.build.html))
        .pipe(reload({stream: true}));
});

gulp.task('js:build', function () {
    gulp.src(path.src.js) //Найдем наш main файл
        .pipe(rigger()) //Прогоним через rigger
        .pipe(sourcemaps.init()) //Инициализируем sourcemap
        .pipe(uglify()) //Сожмем наш js
        .pipe(sourcemaps.write()) //Пропишем карты
        .pipe(gulp.dest(path.build.js)) //Выплюнем готовый файл в build
        .pipe(reload({stream: true})); //И перезагрузим сервер
});

gulp.task('style:build', function () {
    gulp.src(path.src.style)
        .pipe(sourcemaps.init())
        .pipe(sass())
        .pipe(prefixer())
        .pipe(cssmin())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(path.build.css))
        .pipe(reload({stream: true}));
});



gulp.task('sprite:build', function () {
    gulp.src(path.src.sprite)
        .pipe(imagemin()).pipe(spritesmith({
            'imgName' : 'sprite.png',
            'cssName' : 'sprite.css'
        }))
        .pipe(gulp.dest(path.build.sprite))
        .pipe(reload({stream: true}));
});

gulp.task('image:build', function () {
    gulp.src(path.src.img)
        .pipe(imagemin({
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant()],
            interlaced: true
        }))
        .pipe(gulp.dest(path.build.img))
        .pipe(reload({stream: true}));
});



gulp.task('fonts:build', function() {
    gulp.src(path.src.fonts)
        .pipe(gulp.dest(path.build.fonts))
});

gulp.task('video:build', function(){
    gulp.src(path.src.video)
        .pipe(gulp.dest(path.build.video))
});

gulp.task('build', [
    'html:build',
    'js:build',
    'style:build',
    'fonts:build',
    'image:build',
    'sprite:build',
    'vendor:build',
    'vendorCss:build',
    'video:build'
]);

gulp.task('watch', function(){
    watch([path.watch.html], function(event, cb) {
        gulp.start('html:build');
    });
    watch([path.watch.style], function(event, cb) {
        gulp.start('style:build');
    });
    watch([path.watch.js], function(event, cb) {
        gulp.start('js:build');
    });
    watch([path.watch.img], function(event, cb) {
        gulp.start('image:build');
    });
    watch([path.watch.sprite], function(event, cb) {
        gulp.start('sprite:build');
    });
    watch([path.watch.fonts], function(event, cb) {
        gulp.start('fonts:build');
    });
    watch([path.watch.vendor], function(event, cb) {
        gulp.start('vendor:build');
    });
    watch([path.watch.vendorCss], function(event, cb) {
        gulp.start('vendorCss:build');
    });
    watch([path.watch.video], function(event, cb) {
        gulp.start('video:build');
    });
});


gulp.task('webserver', function () {
    browserSync(config);
});


gulp.task('clean', function (cb) {
    rimraf(path.clean, cb);
});

