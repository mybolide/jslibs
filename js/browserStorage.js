/**
 *浏览器存储 
 *@author 张金保 
 */
(function(root){
	var _localStorage = {
		set: function(obj){
			if(BOSPACE.isObject(obj)){
				var _setStorageInfo = {},
					_expires = obj.expires;
				_setStorageInfo.value = obj.value;
				if(BOSPACE.isDate(_expires)){
					//当过期时间为日期时
					_setStorageInfo.expires = _expires.getTime();
				}else if(BOSPACE.isNumber(_expires)){
					//当过期时间为数字时
					_setStorageInfo.expires = _expires + new Date().getTime();
				}else{
					//30天过期
					_setStorageInfo.expires = new Date().getTime() + (30 * 24 * 60 * 60 * 1000);
				}
				_value = JSON.stringify(_setStorageInfo);
				window.localStorage.setItem(obj.key, _value);
			}else{
				throw "paramer is error";
			}
		},
		get: function(key){
			var _value = window.localStorage.getItem(key);
			if(BOSPACE.isString(_value)){
				var _obj = JSON.parse(_value);
				//获取过期时间判断是否过期
				var _expires = _obj.expires;
				if(_expires > new Date().getTime()){
					return _obj.value;
				}else{
					//如果过期则删除该值
					window.localStorage.removeItem(key);
					return "";
				}
			}else{
				return "";
			}
		},
		remove: function(key){
			window.localStorage.removeItem(key);
		}
		
	};
	
	var _cookie = {
		_isValidKey: function(key) {
	        return (new RegExp("^[^\\x00-\\x20\\x7f\\(\\)<>@,;:\\\\\\\"\\[\\]\\?=\\{\\}\\/\\u0080-\\uffff]+\x24")).test(key);
	    },
		set: function(obj){
			if(BOSPACE.isObject(obj) && _cookie._isValidKey(obj.key)){
				var _expires = obj.expires,
					_thisDate = new Date();
				if(BOSPACE.isNumber(_expires)){
					//当过期时间为数字时
					_thisDate.setTime(_thisDate.getTime() + _expires);
				}else if(BOSPACE.isDate(_expires)){
					//当过期时间为日期时
					_thisDate = _expires;
				}else{
					//30天过期
					_thisDate.setTime(_thisDate.getTime() + (20 *24 * 60 * 60 * 1000));
				}
				var _value = {};
					_value.value = obj.value;
					_value = JSON.stringify(_value);
				document.cookie = obj.key + "=" + _value
		            + ("; path=" + (obj.path ? (obj.path == './' ? '' : obj.path) : "/"))
		            + (_thisDate ? "; expires=" + _thisDate.toGMTString() : "")
		            + (obj.domain ? "; domain=" + obj.domain : "");
			}else{
				throw "paramer is Error Or is error key"
			}
		},
		get: function(key){
			if(_cookie._isValidKey(key)){
				var _reg = new RegExp("(^| )" + key + "=([^;\/]*)([^;\x24]*)(;|\x24)"), 
				_result = _reg.exec(document.cookie);
				if (_result) {
                		_result = _result[2] || null;
                		return JSON.parse(_result).value;
            		}else{
            			return;
            		}
			}else{
				return "";
			}
		},
		remove: function(key){
			var _obj = _cookie.get(key);
			if(!!_obj){
				var _thisDate = new Date();
					_thisDate.setTime(_thisDate.getTime() - 1000);
				document.cookie = key + "=;expires=" + _thisDate.toGMTString();
			}
		}
	};
	
	var _api = {
		/**
		 * 
		 * @param {Object} obj
		 * @p-config {String} key             存储数据key
		 * @p-config {String} value           存储数据内容
		 * @p-config {String} path            cookie专用，默认为：根目录："/"
		 * @p-config {String} domain          cookie专用，默认为：当前域名 
		 * @p-config {Number/Date} expires    数据的过期时间，可以是数字，单位是毫秒；也可以是日期对象，表示过期时间，
         *                                    如果未设置expires，或设置不合法时，组件会默认将其设置为30天
		 */
		set: function(obj){
			if(_util.isSupportLocalStorage){
				_localStorage.set(obj);
			}else{
				_cookie.set(obj);
			}
		},
		get: function(key){
			if(_util.isSupportLocalStorage){
				return _localStorage.get(key);
			}else{
				return _cookie.get(key);
			}
		},
		remove: function(key){
			if(_util.isSupportLocalStorage){
				_localStorage.remove(key);
			}else{
				_cookie.remove(key);
			}
		},
		clear: function(){
			if(_util.isSupportLocalStorage){
				_localStorage.clear();
			}else{
				_cookie.clear();
			}
		}
	};
	
	var _util = {
		//判断是否支持localStorage
		isSupportLocalStorage: function(){
			var isSupport = false;
			try{
				isSupport = 'localStorage' in window;
			}catch(e){
				isSupport = false;
			}
			return isSupport;
		}()
	};
	
	var _init = function(){};
	_init.prototype = {
		constructor: _init,
		set: _api.set,
		get: _api.get,
		remove: _api.remove
	};
	root.browserStorage = new _init();
	
})(window.BOSPACE ? window.BOSPACE :  window.BOSPACE = {});