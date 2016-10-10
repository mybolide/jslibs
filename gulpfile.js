var gulp = require('gulp');

var jshint = require('gulp-jshint'),//js检测
uglify = require('gulp-uglify'),//js压缩
concat = require('gulp-concat'),//文件合并
rename = require('gulp-rename'),//文件更名
notify = require('gulp-notify');//提示信息
var rev = require('gulp-rev');//- 对文件名加MD5后缀
var revCollector = require('gulp-rev-collector');//- 路径替换,
var replace = require('gulp-replace');

// 检查js
gulp.task('lint', function() {
  return gulp.src('src/js/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter('default'))
    .pipe(notify({ message: 'lint task ok' }));
});

// 合并、压缩js文件
gulp.task('formjs', function() {
  return gulp.src(['js/_Event.js','js/_Util.js','js/form.js'])
    .pipe(concat('form.js'))
    .pipe(gulp.dest('dist/js'))
    .pipe(rename({ suffix: '.min' }))
    .pipe(uglify())
    .pipe(gulp.dest('dist/js'))
    .pipe(notify({ message: 'form.js task ok' }));
});

//合并、压缩js文件
gulp.task('storagejs', function() {
return gulp.src(['js/_Util.js','js/browserStorage.js'])
    .pipe(concat('browserStorage.js'))
    .pipe(gulp.dest('dist/js'))
    .pipe(rename({ suffix: '.min' }))
    .pipe(uglify({
     mangle: true,
     preserveComments: all
    }))
    .pipe(gulp.dest('dist/js'))
    .pipe(notify({ message: 'browserStorage.js task ok' }));
});

//替换文件路径
gulp.task('formHtml', function(){
	gulp.src(['form.html'])
		.pipe(replace(/<script src="js\/_Event.js"><\/script>[\r\s\n]*<script src="js\/_Util.js"><\/script>[\r\s\n]*<script src="js\/form.js"><\/script>/,'<script src="js/form.min.js"></script>'))
		.pipe(gulp.dest('dist/'))
		.pipe(notify({ message: 'form.html task ok' }));
});

//替换文件路径
gulp.task('browserStorageHtml', function(){
	gulp.src(['browserStorage.html'])
		.pipe(replace(/<script src="js\/_Util.js"><\/script>[\r\s\n]*<script src="js\/browserStorage.js"><\/script>/,'<script src="js/browserStorage.min.js"></script>'))
		.pipe(gulp.dest('dist/'))
		.pipe(notify({ message: 'browserStorage.html task ok' }));
});

// 默认任务
gulp.task('default', function(){
gulp.run('lint','formjs','formHtml');
});