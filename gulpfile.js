// 导入各种包
var gulp = require('gulp');
var htmlmin = require('gulp-htmlmin');
var uglify = require('gulp-uglify');
var less = require('gulp-less');
var cleanCss = require('gulp-clean-css');
var rename = require('gulp-rename');
var concat = require('gulp-concat');
var browserify = require('browserify');
var source = require('vinyl-source-stream'); // 这个包可以把普通的数据流转为vinyl对象文件格式
var buffer = require('vinyl-buffer'); // 这个是把vinyl对象文件中的数据转为buffer方式存储
var htmlReplace = require('gulp-html-replace');

// html处理
gulp.task('html', function() {
    gulp.src(['src/**/*.html', 'index.html'])
        .pipe(htmlReplace({
            style: gulp.src('src/html/common/style.html'),
            aside: gulp.src('src/html/common/aside.html'),
            header: gulp.src('src/html/common/header.html')
        }))
        .pipe(htmlmin({
            collapseWhitespace: true, // 去掉空白字符
            minifyJS: true, //压缩页面JS
            minifyCSS: true, //压缩页面CSS
            removeComments: true //清除HTML注释
        }))
        .pipe(gulp.dest('dist'));
});

// less处理
gulp.task('less', function() {
    gulp.src('src/less/index.less')
        .pipe(less())
        .pipe(cleanCss())
        .pipe(gulp.dest('dist/css'));
});

// 配置要打包的第三包路径
var jsLibs = [
    'node_modules/art-template/lib/template-web.js',
    'node_modules/jquery/dist/jquery.js',
    'node_modules/bootstrap/dist/js/bootstrap.js',
    'node_modules/jquery-form/dist/jquery.form.min.js'
];
// 合并所有的第三方包为一个js
gulp.task('jsLib', function() {
    gulp.src(jsLibs)
        .pipe(concat('lib.js'))
        .pipe(gulp.dest('dist/js'));
});

/**
 * 打包CommonJS模块：
 * 1、其中src/js/common目录下的文件不需要打包，因为将来那个页面脚本需要它，require它即可，
 * 只要require了，就自动打包到了对应的页面脚本。
 * 2、剩下其他目录的js都要打包，每个js都对应一个html页面，他们是这些页面的入口文件。
 * 但是browserify不支持通配符写法，我们只能一个一个写。
 *    一个一个写比较费力，我们这里采用一个循环结构来处理，搞循环结构，
 * 通常要有一个对象或者数组，我们搞一个存储所有要打包js路径的数组，然后遍历打包。
 * */
var jsModules = [
    // 首页
    'src/js/index.js',
    // 用户
    'src/js/user/login.js',
    'src/js/user/repass.js',
    'src/js/user/profile.js',
    // 讲师
    'src/js/teacher/add.js',
    'src/js/teacher/edit.js',
    'src/js/teacher/list.js',
    // 课程
    'src/js/course/add.js',
    'src/js/course/edit1.js',
    'src/js/course/edit2.js',
    'src/js/course/edit3.js',
    'src/js/course/list.js',
    // // 课程
    // 'src/js/common/aside.js',
    // 'src/js/common/common.js',
    // 'src/js/common/header.js',

    // 学科分类
    'src/js/category/add.js',
    'src/js/category/edit.js',
    'src/js/category/list.js'
];
gulp.task('js', function() {
    jsModules.forEach(function(jsPath) {
        var pathArr = jsPath.split('/'); // jsPath变成['src', 'js', 'user', 'login.js']
        var jsName = pathArr.pop(); // 取出login.js，数组变成['src', 'js', 'user']
        pathArr.shift(); // 取出src，数组变成['js', 'user']
        browserify(jsPath, { debug: true }).bundle() // 打包index.js
            .pipe(source(jsName))
            .pipe(buffer())
            // .pipe(uglify())
            .pipe(gulp.dest('dist/' + pathArr.join('/'))); // 数组变成'js/user'
    });
});

// 添加统一打包的任务
gulp.task('build', function() {
    gulp.run(['html', 'less', 'jsLib', 'js']);
});
// 监听文件变化，自动打包
gulp.task('default', function() {
    gulp.run('build');
    gulp.watch(['src/**/*.html', 'index.html'], function() {
        gulp.run('html');
    });
    gulp.watch(['src/**/*.less'], function() {
        gulp.run('less');
    });
    gulp.watch(['src/**/*.js'], function() {
        gulp.run('js');
    });
});



// // 导入各种包
// var gulp = require('gulp');
// var htmlmin = require('gulp-htmlmin');
// var uglify = require('gulp-uglify');
// var less = require('gulp-less');
// var cleanCss = require('gulp-clean-css');
// var rename = require('gulp-rename');
// var concat = require('gulp-concat');
// var browserify = require('browserify');
// var source = require('vinyl-source-stream');
// var buffer = require('vinyl-buffer');
// var htmlReplace = require('gulp-html-replace');

// // html处理
// gulp.task('html', function() {
//     gulp.src(['src/**/*.html', 'index.html'])
//         .pipe(htmlReplace({
//             style: gulp.src('src/html/common/style.html'),
//             aside: gulp.src('src/html/common/aside.html'),
//             header: gulp.src('src/html/common/header.html')
//         }))
//         .pipe(htmlmin({
//             collapseWhitespace: true, // 去掉空白字符
//             minifyJS: true, //压缩页面JS
//             minifyCSS: true, //压缩页面CSS
//             removeComments: true //清除HTML注释
//         }))
//         .pipe(gulp.dest('dist'));
// });

// // less处理
// gulp.task('less', function() {
//     gulp.src('src/less/index.less')
//         .pipe(less())
//         .pipe(cleanCss())
//         .pipe(gulp.dest('dist/css'));
// });

// // 配置要打包的第三包路径
// var jsLibs = [
//     'node_modules/art-template/lib/template-web.js',
//     'node_modules/jquery/dist/jquery.js',
//     'node_modules/bootstrap/dist/js/bootstrap.js',
//     'node_modules/jquery-form/dist/jquery.form.min.js'

// ];
// // 合并所有的第三方包为一个js
// gulp.task('jsLib', function() {
//     gulp.src(jsLibs)
//         .pipe(concat('lib.js'))
//         .pipe(gulp.dest('dist/js'));
// });

// var jsModules = [
//     //首页
//     'src/js/index.js',
//     //用户
//     'src/js/user/login.js',
//     'src/js/user/repass.js',
//     'src/js/user/profile.js',
//     //讲师
//     'src/js/teacher/add.js',
//     'src/js/teacher/edit.js',
//     'src/js/teacher/list.js',
//     //课程
//     'src/js/course/add.js',
//     'src/js/course/edit1.js',
//     'src/js/course/edit2.js',
//     'src/js/course/edit3.js',
//     'src/js/course/list.js',
//     //学科分类
//     'src/js/category/add.js',
//     'src/js/category/edit.js',
//     'src/js/category/list.js'
// ];


// //打包CommonsJS模块
// gulp.task('js', function() {
//     jsModules.forEach(function(jsPath) {
//         var pathArr = jsPath.split('/');
//         var jsName = pathArr.pop();
//         pathArr.shift();
//         browserify(jsPath).bundle()
//             .pipe(source(jsName))
//             .pipe(buffer())
//             .pipe(uglify())
//             // .pipe(rename({
//             //     //prefix:'pr_',
//             //     suffix: '.min'
//             // }))
//             .pipe(gulp.dest('dist/' + pathArr.join('/')));
//     });
// });





// gulp.task('build', function() {
//     gulp.run(['html', 'less', 'js', 'jsLib']);
// })


// gulp.task('default', function() {
//     gulp.run('build');
//     gulp.watch(['src/**/*.html', 'index.html'], function() {
//         gulp.run('html');
//     });
//     gulp.watch(['src/**/*.less'], function() {
//         gulp.run('less');
//     });
//     gulp.watch(['src/**/*.js'], function() {
//         gulp.run('js');
//         //		gulp.run('jsLib'); //第三方无需再添加监听；
//     });
// });


// gulp.task('default', function() {
//     gulp.run('build');
//     gulp.watch(['src/**/*.html', 'index.html'], function() {
//         gulp.run('html');
//     });
//     gulp.watch(['src/**/*.less'], function() {
//         gulp.run('less');
//     });
//     gulp.watch(['src/**/*.js'], function() {
//         gulp.run('js');
//         //		gulp.run('jsLib'); //第三方无需再添加监听；
//     });
// });

gulp.task('build', ['html', 'less', 'js', 'jsLib']);
gulp.task('default', ['build'], function() {
    gulp.watch(['src/**/*.html', 'index.html'], ['html']);
    gulp.watch(['src/**/*.less'], ['less']);
    gulp.watch(['src/**/*.js'], ['js']);
});
// gulp.task('default', ['html', 'less', 'js', 'jsLib', 'watch']);

// gulp.run() has been deprecated. Use task dependencies or gulp.watch task triggering instead.
// 可以根据gulp.task(name[, deps], fn)特性写法替代之。deps：(Array)一个包含任务列表的数组，这些任务会在你当前任务运行之前完成。

//创建Default Task:注册缺省任务
// gulp.task('default', function() {
//     gulp.run('jshint', 'scripts');

//     gulp.watch(workSpace, function() {
//         gulp.run('jshint', 'scripts');
//     })
// });

//创建Default Task:注册缺省任务
// gulp.task('default', ['jshint', 'scripts', 'watch']);



////导入各种包
//var gulp = require('gulp');
//var htmlmin = require('gulp-htmlmin');
//var uglify = require('gulp-uglify');
//var less = require('gulp-less');
//var cleanCss = require('gulp-clean-css');
//var rename = require('gulp-rename');
//var concat = require('gulp-concat');
//var browserify = require('browserify');
//
////html处理
//gulp.task('html',function(){
//	gulp.src(['src/**/*.html','index.html'])
//		.pipe(htmlmin({
//			collapseWhitespace:true,
//			minifyJS:true,
//			minifyCSS:true,
//			removeComments:true
//		}))
//		.pipe(gulp.dest('dist'));
//});
//
////less处理
//gulp.task('less',function(){
//	gulp.src('src/less/index.less')
//		.pipe(less())
//		.pipe(cleanCss())
//		.pipe(rename({
//			prefix:'pr_',
//			suffix:'.min'
//		}))
//		.pipe(gulp.dest('dist/css'));
//});
//
////配置要打包的第三方包路径
//var jsLibs = [
//	'node_modules/art-template/lib/template-web.js',
//	'node_modules/jquery/dist/jquery.js',
//	'node_modules/bootstrap/dist/js/bootsrtap.js'
//];
//
////合并所有的第三方包为js
//gulp.task('jsLib',function(){
//	gulp.src(jsLibs)
//		.pipe(concat('lib.js'))
//		.pipe(gulp.dest('dist/js'))
//});