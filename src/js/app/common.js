//window.onerror = function (sMsg, sUrl, sLine) {
//    alert("An error was thrown and caught.Error: " + sMsg + " ; Line: " + sLine + " ; URL: " + sUrl);
//}

/* 获取url parameter*/
function getUrlParameter(name) {
    //var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    //var r = window.location.hash.substr(1).match(reg);
    //if (r != null) return unescape(r[2]);
    //return null;

    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)","i");
    var r = window.location.search.substr(1).match(reg);
    if (r!=null)
        return unescape(r[2]);
    return null;
}
function getHashValue(key) {
    var reg = new RegExp(key+'=([^&][^#]*)');
    var match = decodeURIComponent(location.hash).match(reg);
    if(match && match.length>=2){
        return match[1];
    }
    return null;
}
function g(n) {
    return ((new Number(n).toFixed(2)));
}

/* 验证 */
var Validate = {
    isPhone: function (v) {
        var patrnPhone = /^\d{11}$/;
        return patrnPhone.test(v)
    },
    isEmpty: function (v) {
        if (v && v.length!=0 || v === 0) {
            return false;
        } else {
            return true;
        }
    },
    isEmail: function (v) {
        var reg = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;
        if (reg.test(v)) {
            return true;
        } else {
            return false;
        }
    }
}

//写cookies
var Cookie = {
    setCookie: function (name, value) {
        var Days = 30;
        var exp = new Date();
        exp.setTime(exp.getTime() + Days * 24 * 60 * 60 * 1000);
        document.cookie = name + "=" + escape(value) + ";expires=" + exp.toGMTString();
    },
    getCookie: function (name) {
        var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
        if (arr = document.cookie.match(reg))
            return unescape(arr[2]);
        else
            return null;
    },
    delCookie: function (name) {
        var exp = new Date();
        exp.setTime(exp.getTime() - 1);
        var cval = Cookie.getCookie(name);
        if (cval != null)
            document.cookie = name + "=" + cval + ";expires=" + exp.toGMTString();
    }
}

function isWechat(){
    var ua = navigator.userAgent.toLowerCase();
    if(ua.match(/MicroMessenger/i)=="micromessenger") {
        return true;
    } else {
        return false;
    }
}



/*
 * 智能机浏览器版本信息:
 *
 */
var browser={
    versions:function(){
        var u = navigator.userAgent, app = navigator.appVersion;
        return {//移动终端浏览器版本信息
            trident: u.indexOf('Trident') > -1, //IE内核
            presto: u.indexOf('Presto') > -1, //opera内核
            webKit: u.indexOf('AppleWebKit') > -1, //苹果、谷歌内核
            gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1, //火狐内核
            mobile: !!u.match(/AppleWebKit.*Mobile.*/), //是否为移动终端
            ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端
            android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1, //android终端或者uc浏览器
            iPhone: u.indexOf('iPhone') > -1 || u.indexOf('Mac') > -1, //是否为iPhone或者QQHD浏览器
            iPad: u.indexOf('iPad') > -1, //是否iPad
            webApp: u.indexOf('Safari') == -1 //是否web应该程序，没有头部与底部
        };
    }(),
    language:(navigator.browserLanguage || navigator.language).toLowerCase()
}

/* 屏幕翻滚监控 */
var viewport = $("meta[name='viewport']");
if(viewport){
    if (browser.versions.android && Math.abs(window.orientation) === 90) {
        viewport.attr('content', 'width=1000, initial-scale=0.5, minimum-scale=0.5, maximum-scale=0.5, user-scalable=yes');
    }
    $(window).on('orientationchange', function () {
        if (browser.versions.iPhone) {
            if (Math.abs(window.orientation) === 90) {
                $('.mobile-orientation').show();
            }
            else {
                $('.mobile-orientation').hide();
            }
        }
        else if (browser.versions.android) {
            if (Math.abs(window.orientation) === 90) {
                viewport.attr('content', 'width=1000, initial-scale=0.5, minimum-scale=0.5, maximum-scale=0.5, user-scalable=yes');
                $('.mobile-orientation').show();
            }
            else {
                viewport.attr('content', 'width=640, initial-scale=0.5, minimum-scale=0.5, maximum-scale=0.5, user-scalable=yes');
                $('.mobile-orientation').hide();
            }
        }
    });
}

//获取随机数
function randomString() {
    var chars = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
    function generateMixed(n) {
        var res = "";
        for (var i = 0; i < n; i++) {
            var id = Math.ceil(Math.random() * 35);
            res += chars[id];
        }
        return res;
    }
    return generateMixed(8);
}
