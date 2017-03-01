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
            var _that = $(this),
                _role = _that.attr("role"),
                _method = _that.attr("method"),
                _action = _that.attr("action"),
                _isSubmit = true,
                _showMsg = "";
			if(!_that.hasClass("submitLodding")){
				_that.addClass("submitLodding");
			}else{
				BOSPACE.eventCenter.fire(_action + "_submit", _that, "请勿重复提交");
				return false;
			};
            var vDatas = _that.find("[data-vilidate]");
            //获取需要验证的字段
            // _that.find("[data-vilidate]").each(function(key, item){
            //     var _this = $(item), _temp = false;
            //     _vilidate.ready(_this, function(isV, emsg, item){
            //         if(isV){
            //             BOSPACE.eventCenter.fire(_action + "_inputSuccess", _this);
            //             BOSPACE.eventCenter.fire(_action + "_blurSuccess", _this);
            //             BOSPACE.eventCenter.fire(_action + "_submitSuccess", _this);
            //            // _isSubmit = true;
            //            _showMsg = "";
            //             _temp = true;
            //         }else{
			// 			_that.removeClass("submitLodding");
            //             if(!_showMsg)_showMsg = emsg;
            //             BOSPACE.eventCenter.fire(_action + "_inputError", _this, _showMsg);
            //             BOSPACE.eventCenter.fire(_action + "_blurError", _this, _showMsg);
            //             BOSPACE.eventCenter.fire(_action + "_submitError", _this, _showMsg);
            //             _isSubmit = false;
            //             _temp = false;
            //             return false;
            //         }
            //     });
            //     if(!!_temp)return;
            // });
            for(var i = 0, l = vDatas.length; i < l; i++){
                var _this = $(vDatas[i]), _temp = false;
                _vilidate.ready(_this, function(isV, emsg, item){
                    if(isV){
                        BOSPACE.eventCenter.fire(_action + "_inputSuccess", _this);
                        BOSPACE.eventCenter.fire(_action + "_blurSuccess", _this);
                        BOSPACE.eventCenter.fire(_action + "_submitSuccess", _this);
                        _temp = true;
                        _showMsg = "";
                    }else{
                       _that.removeClass("submitLodding"); 
                       if(!_showMsg)_showMsg = emsg;
                       BOSPACE.eventCenter.fire(_action + "_inputError", _this, _showMsg);
                       BOSPACE.eventCenter.fire(_action + "_blurError", _this, _showMsg);
                       BOSPACE.eventCenter.fire(_action + "_submitError", _this, _showMsg);
                       _isSubmit = false;
                       _temp = false;
                       return false;
                    }
                });
                if(!_temp)break;;
            }
            if(!_isSubmit) return false;
            if(_role == "ajaxform"){
                event.preventDefault();
                var _data = _that.serialize();
                $$.util.ajax({
                    url: _action,
                    type: _method,
                    data: _data,
                    success: function(data){
                        BOSPACE.eventCenter.fire(_action + "_success", data);
                    },
                    error: function(data, xhr, e){
						_that.removeClass("submitLodding");
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
                if(opt.submitError){
                    BOSPACE.eventCenter.addEventListener(action + "_submitError", function(item, eMsg){
                        opt.submitError.apply({},[item, eMsg]);
                    });
                }
                if(opt.submitSuccess){
                    BOSPACE.eventCenter.addEventListener(action + "_submitSuccess", function(item, eMsg){
                        opt.submitSuccess.apply({},[item, eMsg]);
                    });
                }
				if(opt.submit){
                    BOSPACE.eventCenter.addEventListener(action + "_submit", function(item, eMsg){
                        opt.submit.apply({},[item, eMsg]);
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
                _same = item.data("vsame"),
                _vType = _vilidate.vType,
                _val = item.val();

            _vField = _vField && _vField.indexOf("|") > -1 ? _vField.split("|") : [_vField];
            _vErrorMsg = _vErrorMsg && _vErrorMsg.indexOf("|") > -1 ? _vErrorMsg.split("|") : [_vErrorMsg];
            _vUType = _vUType && _vUType.indexOf("||") > -1 ? _vUType.split("||") : [_vUType];
           
           if(!!_same){
                var _F = item.parents("form");
               var _sav =  _F.find("input[name=" + _same+"]").val();
                _sav == _val && !!_val ? callback(true, "", item) : callback(false, _vErrorMsg[0], item);
                return;
            }

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