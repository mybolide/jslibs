/**
 * Created by zhangjinbao on 2016/6/5.
 * 获取当前js文件的绝对路径
 */
(function(root){
    var filePath = bo.require("./util/_filePath");
    bo.filePath = filePath.getFilePath;
})(window.bo ? window.bo :  window.bo = {});