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