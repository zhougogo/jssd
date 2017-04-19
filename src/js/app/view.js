var Controler = (function () {
    var _ = {};
    var ViewList = [];

    _.push = function (view) {
        ViewList.push(view);
    }


    _.show = function (view,param) {
        var currentView = getCurrentView();
        if (!view.equals(currentView)) {
            currentView && currentView.hide();
            view.show(param);
        }
    }

    function getCurrentView() {
        for (var i = 0; i < ViewList.length; i++) {
            var v = ViewList[i];
            if (v.visible) {
                return v;
            }
        }
        return null;
    }

    return _;
}());

var View = function (options) {
    var _ = {}
    _.id = options.id;
    _.visible = false;
    var inited = false;
    var $wrap = $("#" + _.id);


    if(!($wrap && $wrap.length)){
        var template = Temp[_.id];
        $wrap = $(template);
        $("#view-container").append($wrap);
    }

    options.showStyle && $wrap.addClass(options.showStyle);
    $wrap.addClass("animal");
    _.init = function (cb,param) {
        if (!inited) {
            inited = true;
            options.init && options.init();
            cb && cb(param);
        }
    }

    _.show = function (param) {
        if (inited) {
            _.visible = true;
            $wrap.attr("style","");
            $wrap.show();
            options.load && options.load(param);
            switch (options.showStyle) {
                case "slideleft":
                    $wrap.css({'z-index': 9});
                    $wrap.velocity({
                        translateX: ["0%",'100%'],
                        translateY: ["0%",'0%'],
                        opacity:[1,0]
                    }, {
                        duration: 800,
                        complete: function () {
                            options.show && options.show(param);
                        }
                    })
                    break;
                case "slidetop":
                    $wrap.css({
                        'z-index': 9,
                    });
                    $wrap.velocity({
                        translateY: ["0","100%"],
                        translateX: ["0%",'0%'],
                        opacity:[1,0],
                    }, {
                        duration: 800,
                        complete: function () {
                            options.show && options.show(param);
                        }
                    })
                    break;
                case "scaleup":
                    $wrap.css({'z-index': 9,translateX:'0%'});
                    $wrap.show().velocity({
                        opacity: [1,.8],
                        scale:[1,.8],

                    }, {
                        duration: 300,
                        complete: function () {
                            options.show && options.show(param);
                        }
                    })
                    break;
                default:
                    $wrap.velocity({
                        opacity:[1,0]
                    },{
                        duration:300,
                        complete:function(){
                            options.show && options.show(param);
                        }
                    })
                    $wrap.css({'z-index': 9});
                    options.fontshow && options.fontshow();
            }

        } else {
            _.init(_.show,param);
        }
    };

    _.hide = function (param) {
        switch (options.hideStyle) {
            case "slideleft":
                $wrap.css({'z-index': 1});
                $wrap.velocity({
                    translateX: ['-100%', '0%'],
                    translateY: ["0%",'0%'],
                    opacity:[0,1]
                }, {
                    duration: 800,
                    complete: function () {
                        hideDone();
                    }
                })
                break;
            case "slidetop":
                $wrap.css({'z-index': 1});
                $wrap.velocity({
                    translateY: ["-100%","0"],
                    translateX: ["0%",'0%'],
                    opacity:[0,1]
                }, {
                    duration: 800,
                    complete: function () {
                        hideDone();
                    }
                })
                break;

            default:
                $wrap.css({'z-index': 1});
                $wrap.fadeOut(100, function () {
                    hideDone();
                });
        }

        function hideDone() {
            _.visible = false;
            options.hide && options.hide(param);
            options.showStyle && $wrap.addClass(options.showStyle);
        }

    }

    _.equals = function (v) {
        if (v && _.id == v.id) {
            return true;
        } else {
            return false;
        }
    }

    //add view into controler;
    Controler.push(_);

    _.param = options;
    return _;
}
