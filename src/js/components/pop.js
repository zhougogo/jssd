var Pop = (function () {
    var _ = {};
    var currentTarget = "";
    
    _.show = function (target) {
        _.hide();
        $("#" + target).show();
        currentTarget = target;
    }

    _.hide = function () {
        $(".pop").hide();
        if (currentTarget == "trade-success") {
            Controler.show(View_trade_index);
        }
    }
    /*
    $(".age-image").click(function () {
    //save cookie 已验证18岁
    Cookie.setCookie("cubeparty_age18", 1);
    _.hide();
    });
    */
    $("#share").click(function () {
        Pop.hide();
    });

    $(".closeBtn").click(function () {
        Pop.hide();
    })

    return _
} ());