/**
 * 图片懒加载
 */
(function(root){
    var _timerid = 0;
        $window = $(window),
        $list = null;

    var lazyLoad = {
        init: function($listContainer){
            $list = $listContainer;
            lazyLoad.showOriginImg();
            $window.on("scroll", lazyLoad.showOriginImg);        
        },
        showOriginImg: function(){
            _timerid && clearTimeout(_timerid);
            _timerid = setTimeout(function(){
                var scrollTop = $window.scrollTop(),
                    winH = $window.height();
                var scrollBottom = scrollTop + winH;
                $list && $list.find('img[data-origin]').each(function(i, n){
                    
                    var imgTop = $(n).offset().top,
                        imgH = $(n).height();
                    var imgBottom = imgTop + imgH;

                    if(imgBottom > scrollTop && imgTop < scrollBottom){
                        var dataSrc = $(n).attr("data-origin");
                        dataSrc && $(n).attr("src", dataSrc).removeAttr("data-orign")
                    }
                });
            }, 500);
        }
    }


    root.lazyLoad = lazyLoad;

})(window.bo ? window.bo :  window.bo = {});