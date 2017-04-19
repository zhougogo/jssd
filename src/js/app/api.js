/**
 * Created by 孙明 on 2015/11/20.
 */
var RedirectVhost = VHost = "http://lftapl.dangdaimingshi.com/cubeparty/";
var UTM_source = "", UTM_medium = "";
var Request = {
    wechat_redirect: function (url) {
        var url = url;
        var lastUrl = 'http://glp.nurunci.com/wc/skip.php?type=userinfo&reurl=' + encodeURIComponent(url);
        location.href = lastUrl;
    },
    //获取验证码
    getValicode: function (mobile, cb) {
        var data = {
            action: "getvalicode",
            mobile: mobile
        }
        $.ajax({
            'url': VHost + 'api/index.php',
            'type': 'GET',
            'dataType': 'json',
            'data': data,
            'success': function (data) {
                cb && cb.success && cb.success(data);
            }
        });
    },
    listDate: function (source, cb) {
        var data = {
            action: "listdatebysource",
            source: source
        }
        $.ajax({
            'url': VHost + 'api/index.php',
            'type': 'GET',
            'dataType': 'json',
            'data': data,
            'success': function (data) {
                cb && cb.success && cb.success(data);
            }
        });
    },
    listTime: function (did, cb) {
        var data = {
            action: "listtimebydid",
            did: did
        }
        $.ajax({
            'url': VHost + 'api/index.php',
            'type': 'GET',
            'dataType': 'json',
            'data': data,
            'success': function (data) {
                cb && cb.success && cb.success(data);
            }
        });
    },
    valimobile: function (mobile, code, cb) {
        Pop.show('loader');
        var data = {
            action: "valimobile",
            mobile: mobile,
            code: code
        }
        $.ajax({
            'url': VHost + 'api/index.php',
            'type': 'GET',
            'dataType': 'json',
            'data': data,
            'success': function (data) {
                Pop.hide();
                cb && cb.success && cb.success(data);
            },
            'error':function(){
                Pop.hide();
            }
        });
    },
    addUser: function (name, mobile, tid, cb) {
        Pop.show('loader');
        var data = {
            action: "adduser",
            username: name,
            mobile: mobile,
            tid: tid
        }
        if (UTM_source) {
            data.source = UTM_source + "_" + UTM_medium;
        }
        if (OpenId) {
            data.openid = OpenId;
        }
        if (tid) {
            data.tid = tid;
        }
        $.ajax({
            'url': VHost + 'api/index.php',
            'type': 'POST',
            'dataType': 'json',
            'data': data,
            'success': function (data) {
                Pop.hide();
                cb && cb.success && cb.success(data);
            },
            'error':function(){
                Pop.hide();
            }
        });
    },
    checkAmount: function (cb) {
        var data = {
            action: "checkamount",
        }
        $.ajax({
            'url': VHost + 'api/index.php',
            'type': 'GET',
            'dataType': 'json',
            'data': data,
            'success': function (data) {
                cb && cb.success && cb.success(data);
            }
        });
    },
    addTradeUser: function (name, mobile, address, cb) {
        Pop.show('loader');
        var data = {
            action: "addtradeuser",
            username: name,
            mobile: mobile,
            address: address
        }
        if (UTM_source) {
            data.source = UTM_source + "_" + UTM_medium;
        }
        if (OpenId) {
            data.openid = OpenId;
        }
        $.ajax({
            'url': VHost + 'api/index.php',
            'type': 'POST',
            'dataType': 'json',
            'data': data,
            'success': function (data) {
                Pop.hide();
                cb && cb.success && cb.success(data);
            },
            'error':function(){
                Pop.hide();
            }
        });
    },
    tradewin: function (uid, cb) {
        Pop.show('loader');
        var data = {
            action: "tradewin",
            uid: uid,
        }
        $.ajax({
            'url': VHost + 'api/index.php',
            'type': 'GET',
            'dataType': 'json',
            'data': data,
            'success': function (data) {
                Pop.hide();
                cb && cb.success && cb.success(data);
            },
            'error':function(){
                Pop.hide();
            }
        });
    },
    //[get drink] addUser
    addDrinkUser: function (openid, source, cb) {
        Pop.show('loader');
        var data = {
            action: "adddrinkuser",
            openid: openid,
            source: source
        }
        if (UTM_source) {
            data.source = UTM_source + "_" + UTM_medium;
        }
        if (OpenId) {
            data.openid = OpenId;
        }
        $.ajax({
            'url': VHost + 'api/index.php',
            'type': 'GET',
            'dataType': 'json',
            'data': data,
            'success': function (data) {
                Pop.hide();
                cb && cb.success && cb.success(data);
            },
            'error':function(){
                Pop.hide();
            }
        });
    },
    addPhotoUser: function (openid, mobile, cb) {
        Pop.show('loader');
        var data = {
            action: "addphotouser",
            openid: openid,
            mobile: mobile
        }
        if (UTM_source) {
            data.source = UTM_source + "_" + UTM_medium;
        }
        if (OpenId) {
            data.openid = OpenId;
        }
        $.ajax({
            'url': VHost + 'api/index.php',
            'type': 'GET',
            'dataType': 'json',
            'data': data,
            'success': function (data) {
                Pop.hide();
                cb && cb.success && cb.success(data);
            },
            'error':function(){
                Pop.hide();
            }
        });
    },
    addUgcUser:function(cb){
        var data = {
            action: "addugcuser",
        }
        if (UTM_source) {
            data.source = UTM_source + "_" + UTM_medium;
        }
        if (OpenId) {
            data.openid = OpenId;
        }
        $.ajax({
            'url': VHost + 'api/index.php',
            'type': 'GET',
            'dataType': 'json',
            'data': data,
            'success': function (data) {
                cb && cb.success && cb.success(data);
            },
            'error':function(){
                Pop.hide();
            }
        });
    },
    getPhoto: function (code, cb) {
        Pop.show('loader')
        var data = {
            action: "getphotobycode",
            code: code,
        }
        $.ajax({
            'url': VHost + 'api/index.php',
            'type': 'GET',
            'dataType': 'json',
            'data': data,
            'success': function (data) {
                Pop.hide();
                cb && cb.success && cb.success(data);
            },
            'error':function(){
                Pop.hide();
            }
        });
    }
}



