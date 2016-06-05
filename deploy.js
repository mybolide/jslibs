/*
* 基于Nodejs的模块化js压缩合并脚本
* 使用uglify-js压缩
* 脚本示例: node deploy.js -f test.js -o test.min.js
* 传入参数：
	-f 或者无参数: 表示直接压缩文件
	-m 模块压缩：会分析模块依赖，并导入这些依赖，合并进行压缩
	-p 文件夹压缩
	-c 合并压缩
	-fm 压缩文件并自动添加模块化代码
	-pm 压缩文件夹并自动添加模块化代码
	-pcm|-pmc 合并目录并给每个文件添加模块化代码
	...
*/
//engine
var uglifyJs = require('uglify-js');
var fs = require('fs');

//发布js
function deploy(file,output,type){
	if(!file){
		deploy.error();
		return false;
	}

	var jsReg = /\.js\??.*$/,
		orgout = file.replace(jsReg,''),
		combine = false,
		debug = false,
		isMod = false;
	
	//debug模块，不压缩代码
	if(type.indexOf('d') != -1){
		debug = true;
		type = type.replace('d','');
	}

	//需要合并
	if(type.indexOf('c') != -1){
		combine = true;
		type = type.replace('c','');
	}
	
	//直接输出结果，不以文件方式输出
	if(type.indexOf('g') != -1){
		output = 'fetch_code';
		type = type.replace('g','');
	}

	//需要添加模块化代码
	if(type.indexOf('m') != -1 && type !='-m'){
		isMod = true;
		type = type.replace('m','');
	}


	if(type !='-p'){
		if(!output)
			output = orgout+'.min.js';

		if(!jsReg.test(output))
			output += '.js';

		if(!jsReg.test(file))
			file += '.js';
	}else{
		if(!output)
			output = 'min';
	}

	if(!deploy.instance)
		deploy.instance = new _Deploy({
			combine:combine,
			isMod:isMod,
			debug:debug
		});

	if(deploy.lastFile)
		deploy.instance.lastFile = deploy.lastFile

	if(deploy.deployPath)
		deploy.instance.deployPath = deploy.deployPath;

	if(deploy.output)
		deploy.instance.output = deploy.output;

	switch(type){
		case'-m':
			deploy.instance.module(file,output);
			break;
		case'-p':
			deploy.instance.path(file,output);
			break;
		case'-f':
			deploy.instance.file(file,output);
			break;
		default:
			console.log('参数无效, 请检查您输入的参数.');
			break;
	}
}

deploy.error = function(){
	console.error('\n出错了: 请至少传入需要压缩的文件名.\n');
	deploy.help();
}

deploy.help = function(){
	console.log('使用方法:');
	console.log("\tnode deploy.js -fc file1.js file2.js file3.js -o output.js");
	console.log('参数说明:');
	console.log("\t-f 表示直接压缩文件");
	console.log("\t-m 模块压缩：会分析模块依赖，并导入这些依赖，合并进行压缩");
	console.log("\t-p 文件夹压缩");
	console.log("\t-c 合并压缩，配合f,p使用");
	console.log("\t-h help");
	console.log("\t----------------------------------------------------------");
	console.log("\t-fm 压缩文件并自动添加模块化代码");
	console.log("\t-pm 压缩文件夹并自动添加模块化代码");
	console.log("\t-pcm|-pmc 合并目录并给每个文件添加模块化代码\n");
}

/*压缩js类*/
function _Deploy(config){
	this.config = config || {};
	this.codeArr = [];
	this.includes = {};
	this.baseDir = "./";
	// this.debug = config.debug;
};
_Deploy.prototype = {
	file:function(file,output){
		if(this.config.combine){
			this.codeArr.push(this._compress.apply(this,[file,output,true]));
			//最近一个文件
			if(this.lastFile){

				this.config.fromString = true;
				
				if(!/\.js$/.test(this.output))
					this.output +='.js';

				this._compress(this.codeArr.join(';'),this.output);
			}
		}else{
			this._compress.apply(this,arguments);
		}
	},
	module:function(mod,output){
		var self = this,
		mtjs = (this.deployPath?this.deployPath:'./')+'bo.js';

		if(this.deployPath!=''){
			mod = mod.replace(this.deployPath,'./');
		}
		//define __modeule app
		var moduleCode = fs.readFileSync(mtjs);
		//修改，只配置require引入的模块
		var baseId = (this.deployPath?this.deployPath:'./')+ mod,
			baseCode = fs.readFileSync(baseId,"utf8");
		/*
		* mod engine
		*/
		var loadMod = (function(){

			var require_reg = /\/\/.*|\/\*[\s\S]*?\*\/|"(?:\\[\s\S]|[^"\\])*"|'(?:\\[\s\S]|[^'\\])*'|[;=(,:!^]\s*\/(?:\\.|[^\/\\])+\/|(?:^|\W)\s*require\s*\(\s*("[^"\\]*"|'[^'\\]*')\s*\)/g,
				modCache = {},
				_this = this;

			/*
			* 加载模块
			* 会自动加载依赖
			* @params{String}id 模块id(path)
			*/
			function loadMod(id, code){

				var ret,
				prevId = id;

				if(!/\.js\??.*$/.test(id))
					id+='.js';

				id = resolve(id,this.deployPath);

				if(modCache[id])
					return;

				//获取文件
				if(!!code){
					var res = code;
				}else{
					if(self.deployPath)
						var res = fs.readFileSync(self.deployPath+'./'+id,'utf8');
					else
						var res = fs.readFileSync(id,'utf8');
				}


				if(res && res !='' && typeof res === 'string'){
					var dep =[],
						resTxt = res,
						i,
						path = dir(id),
						trueId;

					this.__path = path;

					for (require_reg.lastIndex = 0; m = require_reg.exec(resTxt);){
						if (m[1])
							dep.push(m);
					}

					if(dep.length > 0){
						for(i =0;i<dep.length;i++){
							trueId = resolve(path+ collapse(dep[i][1].replace(/['"]/g,'')));
							
							resTxt = resTxt.replace(dep[i][0],'=require("'+trueId+'")');
							
							//递归获取依赖
							loadMod(trueId);
						}
					}
					if(!code){
						id = id.replace(/\.js\??.*$/,'');
						modCache[id] = resTxt;
					}
				}
				
				return modCache;
			}

			loadMod.destory = function(){
				modCache = null;
			}

			return loadMod;	
		})();

		//loadMod
		var modeCode = loadMod(mod,baseCode),
		codeArr = [moduleCode];

		for(var id in modeCode){
			codeArr.push(self._compressMod(id,modeCode[id]));
		}
		codeArr.push(baseCode);

		this.config.fromString = true;

		if(output == 'fetch_code.js')
			console.log(this._compress(codeArr.join(';'),output,true));
		else
			this._compress(codeArr.join(';'),output);
	},
	path:function(path,suffix){
		var self = this,
			code;

		path = path.replace(/\/+$/,'');

		if(this.config.combine){
			code = [];
			output = suffix;
			suffix = 'min';
		}

		fs.exists(path,function(){
			fs.readdir(path,function(error,files){
				var file,filename;
				for(var i=0;i<files.length;i++){
					file = files[i];
					if(/\.js$/.test(file) ){
						filename = path+'/'+file.replace(/\.js$/,'');
						if(!new RegExp(suffix+'$').test(filename)){
							if(code){
								code.push(self._compress(path+'/'+file,filename+'.'+suffix+'.js',true))
							}else{
								self.module(path+'/'+file,filename+'.'+suffix+'.js');
							}
						}
					}
				}
				//合并输出
				if(code && code.length){

					self.config.fromString = true;

					if(!output)
						output = path+'/'+path+'.min.js';

					if(/^\.js$/.test(output))
						output +='.js';

					self._compress(code.join(';'),output);
				}
			});
		});
	},
	_compress:function(file,output,ret){

		if(this.config.fromString){
			//debug模式不压缩代码
			if(this.config.debug)
				var result = {code:file}
			else
				var result = uglifyJs.minify(file,{fromString:true});
			
			if(ret)
				return result.code;
			else
				fs.writeFileSync(output,result.code,'utf8');
		}else{
			var code = fs.readFileSync(file,'utf8');
			var id = file.replace(/\.js\??.*$/,'');

			if(this.config.isMod)
				code = this._compressMod(id,code);

			//debug模式不压缩代码
			if(this.config.debug)
				var result = {code:code}
			else
				var result = uglifyJs.minify(code,{fromString:true});
			
			if(ret){
				return result.code;
			}else{
				fs.writeFileSync(output,result.code,'utf8');
			}
		}
	},
	_compressMod:function(id,code){
		id = id.replace("js/","./");
		return  'bo.module("'+id+'",function(require,exports,module){'+code+'})';
	}
}

/*Example*/
//deploy('./lib',null,'-p');



if(process.argv.length<4){
	deploy.error();
	return;
}

//处理脚本传参 
var args = process.argv.slice(2),
	len = args.length,
	i =0,

	argParams = {
		input:[],
		output:[]
	},
	index;
/* 获取node执行时的路径，确定baseDir
* @Case 1: 若node 执行路径与deploy js一致，则baseDir 为空或者"./"
* @Case 2: 不相同，则baseDir为两者的相对路径
*/

var deployPath = collapse(dir(process.argv.slice(1,2)[0]));
var modPath = resolve(dir(process.argv.slice(3,4)[0]),deployPath);


for(;i<len;i++){
	if(/^-[fmgdph]/.test(args[i])){
		argParams['method'] = args[i];
	}else{

		if(args[i].trim() === '-o')
			index = i;

		if(!index || i < index){
			argParams.input.push(args[i]);
		}else if(i>index){
			argParams.output.push(args[i])
		}
	}
}




//查看帮助
if(argParams['method'] == '-h')
		return deploy.help();
//参数错误
if(!argParams['method']){
	console.error('\n错误: 参数错误\n');
	return deploy.help();
}

//存在input file时
if(argParams.input.length){
	var inputs = argParams.input,
		i=0,
		len = inputs.length;
	
	for(;i<len;i++){
		//for combine
		if(i==len-1){
			deploy.lastFile = true;
			deploy.output = argParams.output[0] || inputs[0].replace(/\.js$/,'')+'.combine.min.js';
		}

		deploy.deployPath = deployPath;
		deploy.modPath = modPath;

		deploy(inputs[i],argParams.output[i],argParams.method);
	}
}else{
	deploy.error();
}

/*
* path tools: collapse, dir,resolve
*/
//Removes relative segments from a path
function collapse(path) {
	var a = path.split("/"), out = [], i=0, e;

	for (; i < a.length; ++i) {
		e = a[i];

		if (e === ".")
			continue;
		else if (e === ".." && out.length > 0)
			out.pop();
		else
			out.push(e);
	}

	return out.join("/");
}

/** 获取文件path
 * get path dir
 * @param  {String} path js module path
 * @return {String} dir of js module
 */
function dir(path) {
	var i = path.lastIndexOf("/");
	return (i >= 0) ? path.substring(0, i + 1) : "";
}

/**
 * 获取唯一的模块id
 * @param  {String} id 模块路径
 * @param  {String} path 所在的路径
 * @return {String}
 */
function resolve(id, path) {

	if (typeof id !=='string')
		return "";

	// Trim input
	id = id.trim();
	//id = id.replace(/\.js.*$/,'');

	var c = id.charAt(0),
	map,
	term,
	pos,
	pkg;

	if (c === ".") // Relative
	{
		id = (path || "") + id;
	}

	id = collapse(id);
	return id;
}



