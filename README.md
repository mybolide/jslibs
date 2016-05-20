# jslibs
v1.0版本目前是基于jquery框架，使用时请引入jquery，js版本大于等于1.7.3即可  
后续版本添加纯js版本  
1.添加form表单验证  

使用方法：  
<script src="js/form.min.js"></script>  
//添加此属性则表示使用ajax方式提交函数  
role="ajaxform"  
//验证类型  
data-vilidate="number"  
//错误提示
data-verrormsg="不是数字" 
//自定义验证正则
data-vtype=""
注意： 这三个参数可以是多个值，中间用"|"隔开，但是三个参数的值的顺序要对应，即使中间有某一项为空
html：
<form action="data/test.json" method="get" role="ajaxform">
	<input type="text" name="name" id="name" value="" data-vilidate="number" data-verrormsg="不是数字" data-vtype=""/>
	<input type="submit" value="submit"/>
</form>
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