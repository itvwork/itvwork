var gulp = require("gulp"); //本地安装gulp所用到的地方
var gutil = require("gulp-util");
var del = require("del"); //删除文件
var less = require('gulp-less'); //less语法
var concat = require("gulp-concat"); //合并
var minifycss = require('gulp-minify-css'); //压缩css
var autoprefixer = require('gulp-autoprefixer'); //自动补全浏览器兼容后缀
var cached = require('gulp-cached'); // 搭配 gulp-remember 可增量编译
var remember = require('gulp-remember'); //搭配 gulp-cached 可增量编译
var plumber = require('gulp-plumber'); //校正报错
var replace = require('gulp-replace'); //替换
var webpack = require('webpack');
var config= require('./webpack.config.js');
var connect = require('gulp-connect'); //本地服务
var rest = require('connect-rest');
var uglify = require('gulp-uglify');

var src={
  html:'./app/index.html',
  other:'./app/other/*.js',
  less:'./app/style/styles.less',
  css:'./app/style/*.less',
  editor:'./app/editor/fonts/**/*',
  file:'./app/style/file/**/*'
}

var dist = {
    root: "./dist/",
    js:'./dist/static/js',
    css:'./dist/style',
    file:'./dist/style/file',
    other:'/dist/js'

};

function clean(done) {
    del.sync(['dist/**/*']);
    done();
}


function devWebpack(done){
  webpack(config(), function(err, stats) {
    //  compileLogger(err, stats);

       done();
  });
}




function html(done) {
    return gulp.src(src.html)
        .pipe(plumber())
        .pipe(cached('html')) // 只传递更改过的文件
        .pipe(replace(/\~\/(\S.*.(js|css|png|jpg|gif))/g, function(match, p1) {
             return '192.168.26.144:9090/' + p1;
        }))
        .pipe(remember('html')) // 把所有的文件放回 stream
        .pipe(gulp.dest(dist.root));
        done();
}

function editor(done){
    return gulp.src(src.editor)
    .pipe(gulp.dest('./dist/fonts'));
    done();
}
function connectServer(done) {
    connect.server({
        root: dist.root,
        port:  9090,
        livereload: true,
        middleware: function(connect, opt) {
            return [rest.rester({
                context: "/"
            })]
        }
    });
    done();
}


function watch() {
    var wHtml = gulp.watch(src.html, gulp.series(html, reload));

    wHtml.on('change', function(event) {        // console.log(event);
        if (event.type === 'deleted') {
            delete cached.caches.html[event.path];
            remember.forget('html', event.path);
        }
    });
    gulp.watch([
        './app/commpents/**/*.vue',
        './app/view/**/*.vue',
        './app/**/*.js',
        './app/*html',
        './app/commpents/editor/**/*',
        './app/common/**/*',
        './app/validator/**/*'
    ], gulp.series(devWebpack, reload));
      gulp.watch(src.css, gulp.parallel('css'));
      gulp.watch(src.file, gulp.parallel('file'));
      gulp.watch(src.other, gulp.parallel('other'));
}


gulp.task('css', function(done) {
    gulp.src(src.less) //该任务针对的文件
        .pipe(less())
        // .pipe(minify()) //该任务调用的模块
        .pipe(gulp.dest(dist.css))
        .pipe(connect.reload());
    done();
});

gulp.task('file', function(done) {
    gulp.src(src.file) //该任务针对的文件
        .pipe(gulp.dest(dist.file))
        .pipe(connect.reload());
        done();
});
gulp.task('other', function(done) {
    gulp.src(src.other) //该任务针对的文件
        .pipe(uglify())
        .pipe(gulp.dest('./dist/js'))
        .pipe(connect.reload());
        done();
});

/**
 * 刷新
 */

 function cssreload(){
   return gulp.src('dist/style/')
      .pipe(connect.reload()); //自动刷新
 }
function reload() {
     return gulp.src('dist/')
        .pipe(connect.reload()); //自动刷新
}

gulp.task("default", gulp.series(clean,devWebpack,html,editor,'css','file','other',connectServer,watch));


// gulp.task("default", gulp.series(
//     clean,
//     webpackDevelopment,
//     gulp.parallel(html, img, vendor, data, icon),
//     connectServer,
//     watch
// ));
