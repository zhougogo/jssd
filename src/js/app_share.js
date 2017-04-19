requirejs.config({
    "baseUrl": "src/js",
    "paths": {
        "a": "app",
    },
    "shim": {
        "lib/hammer.min": ["lib/jquery"],
        "lib/velocity.min": ["lib/jquery"],
        "lib/jquery.qrcode.min":["lib/jquery"],
        "app/common": ["lib/jquery"],
        "app/view": ["lib/jquery"],
    },
    waitSeconds: 0
});
var Hammer;

requirejs(["lib/create","app/common",
    /*, "app/app.min",*/], function (a, b, c, d, e) {
    Hammer = c;

    weChat_shareId = getUrlParameter('sid') || "";
    weChat_openid = getUrlParameter('openid');

    var queue = new createjs.LoadQueue(false);
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

        $(".main-wrap").show();
        $(".loading").hide();
    }

    function handleFileProgress(event) {
        //ajax preload
        $(".loading-percent").html((queue.progress * 100 | 0) + " %");
    }

    var filesArray = [
        {id: 'flip', src: "src/img/flip.png"},
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
