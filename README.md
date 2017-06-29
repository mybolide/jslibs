# jslibs
========================================================================

v1.0版本目前是基于jquery框架，使用时请引入jquery，js版本大于等于1.7.3即可
后续版本添加纯js版本

全局命名空间：bo

关于编译的问题
新添加了deploy.js文件，用于编译js使用方法如下
```
  基于Nodejs的模块化js压缩合并脚本
  使用uglify-js压缩
  脚本示例: node deploy.js -f test.js -o test.min.js
  传入参数：
    -d debug模式不压缩代码
    -f 或者无参数: 表示直接压缩文件
	-m 模块压缩：会分析模块依赖，并导入这些依赖，合并进行压缩
	-p 文件夹压缩
	-c 合并压缩
	-fm 压缩文件并自动添加模块化代码
	-pm 压缩文件夹并自动添加模块化代码
	-pcm|-pmc 合并目录并给每个文件添加模块化代码
	...
  本libs里 browserStorage.js使用了此方式压缩

  以browserStorage.js为例
  1.使用bo为命名空间
  2.bo.js为初始化函数
  3.函数中可使用bo.require("./util/_type");引入依赖函数
  4.打包发布，根目录下使用  node deploy.js -m js/browserStorage.js -o dist/js/browserStorage.min.js
  5.使用api参考下面 第2个浏览器缓存 browserStorage.js
```

## 1.添加form表单验证  form.js

使用方法：
```html
<script src="dist/js/form.min.js"></script>
```
//添加此属性则表示使用ajax方式提交函数  
role="ajaxform"  
//验证类型  
data-vilidate="number"  
//错误提示  
data-verrormsg="不是数字"  
//自定义验证正则  
data-vtype=""  
注意： 这三个参数可以是多个值，中间用"|"隔开，但是三个参数的值的顺序要对应，即使中间有某一项为空  
2016-8-1  
1.修改js/_Util.js 方法 此文件已废弃，不在更新  
2.修改form.js 已知bug 
2017-3-1  
1.添加jsform方法  
submitError提交验证错误  
submitSuccess提交验证成功  
submit提交  

html：
```html
<form action="data/test.json" method="get" role="ajaxform">
	<input type="text" name="name" id="name" value="" data-vilidate="number" data-verrormsg="不是数字" data-vtype=""/>
	<input type="submit" value="submit"/>
</form>
```
```javascript
js:
/**
 * @param string form 需要监听form表单的action
 * @param {Object} option 回调函数 回调函数可为空
 */
BOSPACE.formMod.listener("data/test.json", {
    success: function(data){
        //成功回调
        console.info(data);
    },
    error: function(data){
        //失败回调
        console.info(data);
    },
    vilidateBlurSuccess: function(item){
        //需要验证字段失去焦点时验证正确
        console.info("blur success");
    },
    vilidateBlurError: function(item, msg){
        //需要验证字段失去焦点时验证错误
        console.info(item)
        console.info(msg)
        console.info("blur error");
    },
    vilidateInputSuccess: function(item){
        //需要验证字段输入时验证正确
        console.info("input success");
    },
    vilidateInputError: function(item, msg){
        //需要验证字段输入时验证错误
        console.info(item)
        console.info(msg)
        console.info("input error");
    }
});
```
## 2.浏览器缓存 browserStorage.js
此工具会优先使用localStorage存储，如果不支持则使用cookie
页面引入
```html
<script src="dist/js/browserStorage.min.js"></script>
```

使用api
```javascript
var vallue = {
	t:12,
	dsad:13,
	admin:"adfadf"
}
/**
 * 设置存储
 * @param {Object} obj
 * @p-config {String} key             存储数据key
 * @p-config {String} value           存储数据内容
 * @p-config {String} path            cookie专用，默认为：根目录："/"
 * @p-config {String} domain          cookie专用，默认为：当前域名
 * @p-config {Number/Date} expires    数据的过期时间，可以是数字，单位是毫秒；也可以是日期对象，表示过期时间，
 *                                    如果未设置expires，或设置不合法时，组件会默认将其设置为30天
 */
bo.browserStorage.set({
	key:"test",
	value:vallue,
	path:"/jslibs",
	domain:"127.0.0.1",
	expires:10 * 100000
});
/**
 *获取存储
 */
var storageData = bo.browserStorage.get("test");
/**
 *删除存储
 */
bo.browserStorage.remove("test");
```

## 3.获取当前js文件路径 getFilePath.js
此方法用来获取当前js文件的绝对路径
该方法为内部方法，单某些情况下有此需求故暴露到主命名空间内，此函数源码:js/util/_filePath.js
页面引入
```html
<script src="dist/js/getFilePath.min.js"></script>
```

使用api
```javascript
var filePath =  bo.filePath;
```


## 4.图片懒加载
当图片出现在当前屏幕中进行加载图片，保证首屏加载速度  
页面引入
```html
<script src="dist/js/lazyLoadImg.min.js"></script>
```

使用api
```javascript
bo.lazyLoad.init($('#imgListContainer'));
```