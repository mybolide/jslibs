/**
 * 	url,
 *  async 是否异步 默认 true
 *  type 请求方式POST 或  GET(默认)
 *  data 请求参数(对象或者键值字符串)
 *  before 请求前执行的方法 多使用loadding状态
 *  success 请求成功后的回调函数
 *  error 请求失败的回掉函数
 * @param {Object} option
 */
exports.ajax = function(option){
	if(!BOSPACE.isObject(option)){
		throw "Ajax arguments is not object!";
	}
	$.ajax({
		type:option.type || "GET",
		url: option.url,
		async:option.async || true,
		data: option.data || {},
		beforeSend: option.before || function(){},
		success: option.success || function(){},
		error: option.error || function(){}
	});
}