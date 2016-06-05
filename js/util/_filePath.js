/**
 * Created by zhangjinbao on 2016/6/5.
 * 获取js文件的据对路径
 */

var doc = window.document,
    a = {},
    expose = +new Date(),
    rExtractUri = /((?:http|https|file):\/\/.*?\/[^:]+)(?::\d+)?:\d+/,
    isLtIE8 = ('' + doc.querySelector).indexOf('[native code]') === -1;
exports.getFilePath = function(){
// FF,Chrome
    if (doc.currentScript){
        return doc.currentScript.src;
    }

    var stack;
    try{
        a.b();
    }
    catch(e){
        stack = e.fileName || e.sourceURL || e.stack || e.stacktrace;
    }
    // IE10
    if (stack){
        var absPath = rExtractUri.exec(stack)[1];
        if (absPath){
            return absPath;
        }
    }

    // IE5-9
    for(var scripts = doc.scripts,
            i = scripts.length - 1,
            script; script = scripts[i--];){
        if (script.className !== expose && script.readyState === 'interactive'){
            script.className = expose;
            // if less than ie 8, must get abs path by getAttribute(src, 4)
            return isLtIE8 ? script.getAttribute('src', 4) : script.src;
        }
    }
}();