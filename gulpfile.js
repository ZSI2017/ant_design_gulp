// 引入 gulp工具
var gulp = require('gulp');
// 引入 gulp-webserver 模块
var webserver = require('gulp-webserver');

// 引入 css 预处理 压缩 模块
var minifyCSS = require('gulp-minify-CSS');
// var scss = require('gulp-sass');
var named = require('vinyl-named');
var webpack = require('gulp-webpack');
var uglify = require('gulp-uglify');

// 链接不同的js,css文件分别到同一个文件中
var concat = require('gulp-concat');

//  压缩 html mini
var htmlmin = require('gulp-htmlmin');

// 引入 gulp-sequence 模块
var sequence = require('gulp-sequence');

// 引入 fs url  模块， 对文件的
var fs = require('fs');
var url = require('url');

//引入 兼容浏览器的gulp-autoprefixer
var autoprefixer = require('gulp-autoprefixer');

// 引入 rev revCollector
var rev = require('gulp-rev');  // 对文件名加MD5 后缀
var revCollector = require('gulp-rev-collector')  // 路径替换


  //拷贝   对文件进行操作， 把相应的文件进行拷贝，
  //   把对应的 html 文件移动到后面的
gulp.task('copy-index', function() {
  var options = {
       collapseWhitespace:true,
       collapseBooleanAttributes:true,
       removeComments:true,
       removeEmptyAttributes:true,
       removeScriptTypeAttributes:true,
       removeStyleLinkTypeAttributes:true,
    // minifyJS:true,
    // minifyCSS:true
  }
  gulp.src('./src/*.html')
    .pipe(htmlmin(options))
    .pipe(gulp.dest('./dist'));
});
//    复制图片到到测试环境中去，
gulp.task('copy-images', function() {
  gulp.src('./src/images/**/*')
    .pipe(gulp.dest('./dist/images/'));
});
gulp.task("copy-libs",function(){
     gulp.src('./src/libs/**/*')
         .pipe(gulp.dest('./dist/libs'));
})
// 利用webpack 中的webserver 的方式来起一个服务
//  其中应用到了node  中的中间件

// 这里的中间件 映射到了不同的mock 文件中
// 多人协作时  不同的文件 对应不同的mock
var  one= require("./mock/routers/one.js")

gulp.task('webserver', function() {
  gulp.src('./src')
  .pipe(webserver({
    host:'localhost',
    port:8989,
    directoryListing:{
      enable:true,
      path:'./src'
    },
    livereload:true,
    //mock 数据
    middleware:[one]
  }))
});

//CSS预处理,  对scss  进行编译，可能到近期没用用到
// var cssFiles = [
//   './src/styles/usage/page/*.scss'
// ];
//
// gulp.task('scss', function() {
//   gulp.src(cssFiles)
//   .pipe(autoprefixer({
//      browsers:['>5%'],
//      cascade: true,
//      remove:true
//   }))
//   .pipe(scss().on('error',scss.logError))
//   .pipe(minifyCSS())
//   .pipe(gulp.dest('./bulid/prd/styles/'));
//
// });


var cssFiles = [
  './src/css/*.css'
];

gulp.task('css', function() {
  gulp.src(cssFiles)
//  .pipe(concat('main.min.css'))
  .pipe(minifyCSS())
//  .pipe(rev())
  .pipe(gulp.dest('./dist/css/'))
//  .pipe(rev.manifest())
//  .pipe(gulp.dest('./dist/rev/css'));
});

gulp.task('rev',function(){
      gulp.src(['./dist/rev/**/*','./dist/html/*.html'])
           .pipe(revCollector())
           .pipe(gulp.dest('./dist/html'));
})

//gulp.task('min',sequence('copy-index','css',"rev"));

// 使用数组的形式， 对文件进行批量处理

var jsFiles = [
  './src/js/*.js'
];

gulp.task('packjs', function() {
  gulp.src(jsFiles)
    .pipe(named())
    .pipe(webpack({
      output: {
        filename: '[name].js'
      },
      module: {
        loaders: [{
          test: /\.js$/,
          loader: 'imports?define=>false',
          exclude: './src/libs/*'
        }, {
          test: /\.string$/,
          loader: 'string'
        }]
      }
    }))
    .pipe(uglify().on('error', function(err) {
      console.log('\x07', err.lineNumber, err.message);
      return this.end();
    }))
//    .pipe(rev())
    .pipe(gulp.dest('./dist/js/'))
//    .pipe(rev.manifest())
//  .pipe(gulp.dest('./dist/rev/js'));
});

// 版本号控制



// var cssDisFiles = [
//   './build/prd/styles/app.css'
// ];
//
// var jsDistFiles = [
//   './build/prd/scripts/app.js'
// ];

   // 版本号进行控制
// gulp.task('ver', function() {
//   gulp.src(cssDisFiles)
//     .pipe(rev())
//     .pipe(gulp.dest('./bulid/prd/styles/'))
//     .pipe(rev.manifest())
//     .pipe(gulp.dest('./bulid/ver/style/'));
//   gulp.src(jsDistFiles)
//     .pipe(rev())
//     .pipe(gulp.dest('./bulid/prd/scripts/'))
//     .pipe(rev.manifest())
//     .pipe(gulp.dest('./bulid/ver/scripts/'));
// });
//
// // 修改html文件，对html 的版本号进行控制，后面页面迭代时会有作用
// gulp.task('html', function() {
//   gulp.src(['./bulid/ver/**/*', './bulid/*.html'])
//     .pipe(revCollector())
//     .pipe(gulp.dest("./bulid/"));
// });
// gulp.task('min', sequence('copy-index', 'ver', 'html'));


//侦测 文件变化， 执行相应任务，对相应 的文件进行检测，了解文件一旦改动的话 ，就相应同步到 prd中去，
gulp.task('watch',function () {
  gulp.watch('./src/html/*.html',['copy-index']);
  gulp.watch('./images/**/*',['copy-images']);
  gulp.watch('./src/css/**/*',['css']);
  gulp.watch('./src/js/**/*',['packjs']);
});

//  默认的任务，,
gulp.task('default', [ 'packjs','copy-index','css','copy-images','copy-libs','webserver'], function() {
  console.log('任务队列执行完毕');
});
