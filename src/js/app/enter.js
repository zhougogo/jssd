/**
 * Created by 孙明 on 2015/11/20.
 */

//var winWidth = $(window).width();
//if (winWidth > 767 && winWidth <= 1100) {
//    location.href = "ipad.html";
//} else if (winWidth > 1100) {
//    location.href = "pc.html";
//}

function startApp(param) {
    $(".main-wrap").show();
    $(".loading").hide();
    Controler.show(param.first_view,param && param.param);
    //判断Cookie 是否已18岁
    if (!Cookie.getCookie("cubeparty_age18")) {
        Pop.show("age");
    }

    Debug = true;
    
    if(param.source_tag){
        SourceTag = param.source_tag;
    }
    eventTracking();
}







