requirejs.config({
    "baseUrl": "src/js",
    "paths": {
        "a": "app",
    },
    "shim": {
        "lib/hammer.min": ["lib/jquery"],
        "lib/velocity.min": ["lib/jquery"],
        "app/common": ["lib/jquery"],
        "app/view": ["lib/jquery"],

    },
    waitSeconds: 0
});
var Hammer;
var queue;
var OpenId="";
requirejs(["lib/create", "lib/velocity.min", "lib/hammer.min","lib/fabric",
    "app/common",'src/js/app/api.js'
    /*, "app/app.min",*/], function (a, b, c, d, e) {
    Hammer = c;
    /*
    OpenId = getUrlParameter('openid');
    if(!OpenId){
        location.href = VHost+"share.html";
        return;
    }
    */
    queue = new createjs.LoadQueue(false);
    queue.installPlugin(createjs.Sound);
    queue.on("complete", handleComplete, this);
    queue.on("progress:", handleProgress, this);
    queue.on("fileprogress", handleFileProgress, this);
    queue.on("fileload", handleFileload, this);
    function handleFileload() {
        //not ajax preload
        $(".loading-percent").html((queue.progress * 100 | 0) + " %");
    };
    function handleProgress() {
    };
    function handleComplete() {
        $(".loading-percent").html(100 + " %");
        if (startApp) {
            OpenId = getUrlParameter("openid");
            ImageUrl = getUrlParameter("img") || getHashValue("img");
            UTM_source = getUrlParameter("utm_source");
            UTM_medium = getUrlParameter("utm_medium");
            if(ImageUrl){
                startApp({
                    first_view:View_photo_back,
                    param:{imgUrl:ImageUrl}
                });
            }else{
                startApp({
                    first_view:View_ugc_index
                });
            }
        } else {
            setTimeout(handleComplete, 500);
        }
    }

    function handleFileProgress(event) {
        //ajax preload
        $(".loading-percent").html((queue.progress * 100 | 0) + " %");
    }

    var filesArray = [
        { id: 'js-1', src: "src/js/app/common.js" },
        { id: 'js-2', src: "src/js/app/view.js" },
        { id: 'js-3', src: "src/js/app/tracking.js" },
        { id: 'js-5', src: "src/js/app/enter.js" },
        { id: 'js-pop', src: "src/js/components/pop.js" },

        { id: 'js-ugc', src: "src/js/components/ugc.js" },
        "src/js/lib/megapix-image.js",
        "src/js/lib/binaryajax.js",
        "src/js/lib/exif.js",
        { id: 'js-temp_back', src: "src/js/components/template_photo_back.js" },
        { id: 'js-view_back', src: "src/js/components/view/photo_back.js" },

        { id: 'ele1', src: "src/img/ugc/ele1.png" },
        { id: 'ele2', src: "src/img/ugc/ele2.png" },
        { id: 'ele3', src: "src/img/ugc/ele3.png" },
        { id: 'ele4', src: "src/img/ugc/ele4.png" },
        { id: 'ele5', src: "src/img/ugc/ele5.png" },
        { id: 'ele6', src: "src/img/ugc/ele6.png" },

        //ÐÂµÄ
        { id: 'e1', src: "/res/css/photocat/e1.png" },
        { id: 'e2', src: "/res/css/photocat/e2.png" },
        { id: 'e3', src: "/res/css/photocat/e3.png" },
        { id: 'e4', src: "/res/css/photocat/e4.png" },
        { id: 'e5', src: "/res/css/photocat/e5.png" },
        { id: 'e6', src: "/res/css/photocat/e6.png" },
        { id: 'e7', src: "/res/css/photocat/e7.png" },
        { id: 'e8', src: "/res/css/photocat/e8.png" },
        { id: 'e9', src: "/res/css/photocat/e9.png" }

    ];
    //queue.loadFile({id: "video1", src: "src/music.m4a"});
    queue.loadManifest(filesArray, true);

    PreloadMession = function (list, cus_progress, cus_complete) {
        //Theme1 load mession
        var queue = new createjs.LoadQueue(false);
        queue.on("complete", queueComplete, this);
        queue.on("fileload", queueProgress, this);
        queue.loadManifest(list, true);

        function queueProgress() {
            cus_progress(queue.progress);
        }

        function queueComplete() {
            cus_complete();
        }

    }
})
