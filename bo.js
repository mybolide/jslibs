(function(){
	var _modules={},
	scripts = document.getElementsByTagName('script'),
	len = scripts.length,
	currentScript = scripts[len-1];

	function define(id,fn,update){
		if(id==="")
			return;
		if(_modules[id]&&!update)
			throw"Module "+id+" already exist!";
		if(typeof fn === "function"){
			_modules[id] = {id:id,fn:fn,exports:{}}
		}else{
			_modules[id]={exports:fn}}
	}
	window.bo = window.bo || {};
	bo.require = function(id){
		var mod=_modules[id],fn,ret;
		if(mod){
			fn=mod.fn;
			if(fn){
				ret=typeof fn==="function"?fn(bo.require,mod.exports,mod):fn;
				if(ret)
					mod.exports=ret;
				delete mod.fn
			}
			return mod.exports
		}else{
			throw"Module "+id+" not exist!"
		}
	} 
	bo.module =function(){
		if(arguments.length>=2){
			return define.apply(define,arguments)
		}else{
			return require.apply(require,arguments)
		}
	}
})()