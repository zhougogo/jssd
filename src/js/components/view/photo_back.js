var View_photo_back = new View({
    id:"photo_back",
    //showStyle: 'slidetop',
    //hideStyle: 'slideleft',
    init: function () {
        var _this = this;

        $(".ugc-diy-btn").click(function(){
            location.href = VHost+"ugc.html";
        });
    },
    load: function (param) {
        $("#back-image")[0].src = param.imgUrl;

        GW = parseInt(getHashValue("gw"));
        if(GW==2){
            $(".ugc-diy-btn").hide();
        }
    },
    show: function () {
        var _this = this;
    },
    hide: function () {
    }
})