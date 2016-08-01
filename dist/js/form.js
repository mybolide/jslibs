
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
/**
 *工具类 
 */
var BOSPACE = window.$$ = BOSPACE || {};
BOSPACE.util = {
	_init: function(){
		/**
		 * ECMAScript 3
		 * Object.prototype.toString()
		 * 在toString方法被调用时,会执行下面的操作步骤:
		 * 1. 获取this对象的[[Class]]属性的值.
		 * 2. 计算出三个字符串"[object ", 第一步的操作结果Result(1), 以及 "]"连接后的新字符串.
		 * 3. 返回第二步的操作结果Result(2).
		 * [[Class]]是一个内部属性,所有的对象(原生对象和宿主对象)都拥有该属性.在规范中,[[Class]]是这么定义的
		 * 内部属性	描述
		 * [[Class]]	一个字符串值,表明了该对象的类型.
		 * 然后给了一段解释:
		 * 所有内置对象的[[Class]]属性的值是由本规范定义的.所有宿主对象的[[Class]]属性的值可以是任意值,甚至可以是内置对象使用过的[[Class]]属性的值.
		 * [[Class]]属性的值可以用来判断一个原生对象属于哪种内置类型.需要注意的是,除了通过Object.prototype.toString方法之外,
		 * 本规范没有提供任何其他方式来让程序访问该属性的值(查看 15.2.4.2).
		 * 也就是说,把Object.prototype.toString方法返回的字符串,去掉前面固定的"[object "和后面固定的"]",
		 * 就是内部属性[[class]]的值,也就达到了判断对象类型的目的.jQuery中的工具方法$.type(),就是干这个的.
		 * 
		 * ECMAScript 5
		 * Object.prototype.toString ()
		 * 1.如果this的值为undefined,则返回"[object Undefined]".
		 * 2.如果this的值为null,则返回"[object Null]".
		 * 3.让O成为调用ToObject(this)的结果.
		 * 4.让class成为O的内部属性[[Class]]的值.
		 * 5.返回三个字符串"[object ", class, 以及 "]"连接后的新字符串
		 * 可以看出,比ES3多了1,2,3步.第1,2步属于新规则,比较特殊,因为"Undefined"和"Null"并不属于[[class]]属性的值,需要注意的是,
		 * 这里和严格模式无关(大部分函数在严格模式下,this的值才会保持undefined或null,非严格模式下会自动成为全局对象).
		 * 第3步并不算是新规则,因为在ES3的引擎中,也都会在这一步将三种原始值类型转换成对应的包装对象,只是规范中没写出来.ES5中,[[Class]]属性的解释更加详细:
		 * 所有内置对象的[[Class]]属性的值是由本规范定义的.所有宿主对象的[[Class]]属性的值可以是除了
		 * "Arguments", "Array", "Boolean", "Date", "Error", "Function", "JSON", "Math", "Number", "Object", "RegExp", "String"
		 * 之外的的任何字符串.[[Class]]内部属性是引擎内部用来判断一个对象属于哪种类型的值的.需要注意的是,除了通过Object.prototype.toString方法之外,
		 * 本规范没有提供任何其他方式来让程序访问该属性的值(查看 15.2.4.2).
		 * 和ES3对比一下,第一个差别就是[[class]]内部属性的值多了两种,成了12种,
		 * 一种是arguments对象的[[class]]成了"Arguments",而不是以前的"Object",还有就是多个了全局对象JSON,
		 * 它的[[class]]值为"JSON".第二个差别就是,宿主对象的[[class]]内部属性的值,不能和这12种值冲突,不过在支持ES3的浏览器中,貌似也没有发现哪些宿主对象故意使用那10个值.
		 * 
		 * 详细说明：http://www.cnblogs.com/ziyunfei/archive/2012/11/05/2754156.html
		 */
		var _arry = ["Arguments", "Array", "Boolean", "Date", "Error", "Function", "JSON", "Math", "Number", "Object", "RegExp", "String"];
		for(var i = 0, l = _arry.length; i < l; i++){
			var _functionName = "is" + _arry[i];
            eval("BOSPACE['"+_functionName+"'] = function(data){return Object.prototype.toString.call(data) == '[object " + _arry[i] + "]'}");
		}
	}(),
	
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
	ajax: function(option){
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
};

/**
 *form表单提交
 * 支持ajax提交 直接提交
 * eg：
 BOSPACE.formMod.listener("data/test.json", {
		success: function(data){
			console.info(data);
		}
   });
 * @param {Object} root
 * @author 张金保
 */
(function(root){
    var _formEventCenter = {
        addEventListener: function(form){
            form.on("submit", _event.formSubmit);
            form.on("input blur", "[data-vilidate]", _event.input);
        }
    };
    var _event = {
        input: function(e){
            var _form = $(this).parents("form"),
                _action = _form.attr("action"),
                _eType = e.type,
                _this = $(this);
            _vilidate.ready(_this, function(isV, emsg){
                if(isV){
                    if(_eType == "input")
                        BOSPACE.eventCenter.fire(_action + "_inputSuccess", _this);
                    if(_eType == "blur" || _eType == "focusout")
                        BOSPACE.eventCenter.fire(_action + "_blurSuccess", _this);
                }else{
                    if(_eType == "input")
                        BOSPACE.eventCenter.fire(_action + "_inputError", _this, emsg);
                    if(_eType == "blur" || _eType == "focusout")
                        BOSPACE.eventCenter.fire(_action + "_blurError", _this, emsg);
                }
            });
        },
        formSubmit: function(event){
            var _this = $(this),
                _role = _this.attr("role"),
                _method = _this.attr("method"),
                _action = _this.attr("action"),
                _isSubmit = false;
            //获取需要验证的字段
            $("[data-vilidate]").each(function(key, item){
                var _this = $(item), _temp = false;
                _vilidate.ready(_this, function(isV, emsg, item){
                    if(isV){
                        BOSPACE.eventCenter.fire(_action + "_inputSuccess", _this);
                        BOSPACE.eventCenter.fire(_action + "_blurSuccess", _this);
                        _isSubmit = true;
                        _temp = true;
                    }else{
                        BOSPACE.eventCenter.fire(_action + "_inputError", _this, emsg);
                        BOSPACE.eventCenter.fire(_action + "_blurError", _this, emsg);
                        _isSubmit = false;
                        _temp = false;
                        return;
                    }
                });
                if(!!_temp)return;
            });
            if(!_isSubmit) return false;
            if(_role == "ajaxform"){
                event.preventDefault();
                var _data = _this.serialize();
                $$.util.ajax({
                    url: _action,
                    type: _method,
                    data: _data,
                    success: function(data){
                        BOSPACE.eventCenter.fire(_action + "_success", data);
                    },
                    error: function(data, xhr, e){
                        BOSPACE.eventCenter.fire(_action + "_error", data, xhr, e);
                    }
                });
            }else{
                return true;
            }
        }
    };
    var _formMod = {
        listener: function(action, opt){
            var _form = $("[action=\"" + action + "\"]");
            if(!!_form && _form.length){
                _formEventCenter.addEventListener(_form);
                if(opt.success){
                    BOSPACE.eventCenter.addEventListener(action+"_success", function(data, form){
                        opt.success.apply(form, [data]);
                    });
                }
                if(opt.error){
                    BOSPACE.eventCenter.addEventListener(action + "_error", function(data, form){
                        opt.error.apply(form, [data]);
                    });
                }
                if(opt.vilidateBlurSuccess){
                    BOSPACE.eventCenter.addEventListener(action + "_blurSuccess", function(item){
                        opt.vilidateBlurSuccess.apply({},[item]);
                    });
                }
                if(opt.vilidateBlurError){
                    BOSPACE.eventCenter.addEventListener(action + "_blurError", function(item, eMsg){
                        opt.vilidateBlurError.apply({},[item, eMsg]);
                    });
                }
                if(opt.vilidateInputSuccess){
                    BOSPACE.eventCenter.addEventListener(action + "_inputSuccess", function(item){
                        opt.vilidateInputSuccess.apply({},[item]);
                    });
                }
                if(opt.vilidateInputError){
                    BOSPACE.eventCenter.addEventListener(action + "_inputError", function(item, eMsg){
                        opt.vilidateInputError.apply({},[item, eMsg]);
                    });
                }
            }
        }
    };

    var _vilidate = {
        ready: function(item, callback){
            var _vField = item.data("vilidate"),
                _vErrorMsg = item.data("verrormsg"),
                _vUType = item.data("vtype"),
                _vType = _vilidate.vType,
                _val = item.val();

            _vField = _vField && _vField.indexOf("|") > -1 ? _vField.split("|") : [_vField];
            _vErrorMsg = _vErrorMsg && _vErrorMsg.indexOf("|") > -1 ? _vErrorMsg.split("|") : [_vErrorMsg];
            _vUType = _vUType && _vUType.indexOf("|") > -1 ? _vUType.split("|") : [_vUType];
            _vField && _vField.forEach(function(value, key){
                _vUType = _vUType && _vUType.length >= _vField.length ? _vUType[key] : "";
                _vUType = _vUType ||  _vType[value] || "";
                var reg = new RegExp(_vUType);
                reg.test(_val) ? callback(true, "", item) : callback(false, _vErrorMsg[key], item);
            });
        },
        vType:{
            number:/^\d*$/,
            phone:/^0?(13|14|15|17|18)[0-9]{9}$/,
            zh:/^[\u4e00-\u9fa5]$/,
            email:/^\w[-\w.+]*@([A-Za-z0-9][-A-Za-z0-9]+\.)+[A-Za-z]{2,14}$/,
            url:/^((https|http|ftp|rtsp|mms)?:\/\/)[^\s]+$/
        }
    };
    var _init = function(){};
    _init.prototype.listener = function(action, opt){
        return new _formMod.listener(action, opt);
    };
    root.formMod = new _init();

})(window.BOSPACE ? window.BOSPACE :  window.BOSPACE = {});