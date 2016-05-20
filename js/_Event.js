
/**
 *BOSPACE为全局命名空间 
 *@param {Object} root
 * @author 张金保
 */
var BOSPACE = window.$$ = BOSPACE || {};

/**
 *主函数 事件监听函数 使用观察者模式 
 */
BOSPACE.eventCenter = {
	space:{},
	addEventListener: function(name, fn){
		var _space = this.space;
		if(!fn) return;
		_space[name] ? _space[name].push(fn) : _space[name] = [fn];
	},
	fire:function(name){
		var _space = this.space,
			_args = Array.prototype.slice.call(arguments, 1),
			_fns = _space[name];
		if(_fns && _fns.length){
			for(var i = 0, l = _fns.length; i < l; i++){
				_fns[i].apply(_fns[i], _args);
			}	
		}
	}
};