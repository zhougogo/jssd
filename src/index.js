var canvas_clip = document.getElementById("ugc-clip-m");

function clip_init(wid, hei) {
    var _this = this;

    var currentFile = null;
    var canvas = canvas_clip;
    var stage = new createjs.Stage(canvas);
    createjs.Touch.enable(stage);
    stage.enableMouseOver(10);
    stage.mouseMoveOutside = true;
    createjs.Ticker.setFPS(24);
    createjs.Ticker.on("tick", function () {
        stage.update();
    });

    var cameraPhoto = new createjs.Container();
    stage.addChild(cameraPhoto);

    var cancelCanvas = function () {
        cameraPhoto.removeAllChildren();
    }

    var addScaleAction = function (bmp) {
        var scale = 0.5;
        var defscale = 0.5;
        var isgesture = 0;

        cameraPhoto.on("mousedown", function (evt) {
            // this.parent.addChild(this);
            if (isgesture == 0) {
                this.offset = { x: this.x - evt.stageX, y: this.y - evt.stageY };
            }
            scale = cameraPhoto.scaleY;
        });

        cameraPhoto.on("pressmove", function (evt) {
            if (isgesture == 0) {
                this.x = evt.stageX + this.offset.x;
                this.y = evt.stageY + this.offset.y;
                update = true;
            }
        });

        if (!browser.iPhone) {

            var mc = new Hammer(canvas, { touchAction: "pan-y" });
            // mc.get('pan').set({ direction: Hammer.DIRECTION_ALL });
            // mc.get('pinch').set({ enable: true });
            mc.get('rotate').set({ enable: true });
            mc.on("pan swipe rotate pinch", function (ev) {
                // el.textContent = ev.type +" "+ el.textContent;
                //$("#numberText").html(ev.scale);
                isgesture = 1;
                if (ev.scale != 1) {
                    s = ev.scale - 1;
                    cameraPhoto.scaleX = cameraPhoto.scaleY = scale + s;
                } else {
                    isgesture = 0;
                }
            });

        } else {
            var gesturestart = function (event) {
                isgesture = 1;
            }
            var gesturechange = function (event) {
                s = event.scale - 1;
                defscale = cameraPhoto.scaleX = cameraPhoto.scaleY = scale + s;
            }
            var gestureend = function (event) {
                setTimeout(function () {
                    scale = defscale;
                    isgesture = 0;
                }, 10)
            }
        }

        canvas.addEventListener("gesturestart", gesturestart, true);
        canvas.addEventListener("gesturechange", gesturechange, true);
        canvas.addEventListener("gestureend", gestureend, true);
    }

    window.addImg = function (bigUrl) {
        var bmp = new createjs.Bitmap(bigUrl);
        var img = new Image();
        img.onload = function () {
            var w = img.width;
            var h = img.height;
            if (w < h) {
                var y = (h - hei) / 2;
                cameraPhoto.y = -1 * y;
                //cameraPhoto.x = -310;
            } else {
                var x = (w - wid) / 2;
                cameraPhoto.x = -x;
                //cameraPhoto.y = -310;
            }
            cameraPhoto.regX = cameraPhoto.regY = 0;
            // bmp.scaleX = bmp.scaleY = 0.5;

        }
        img.src = bigUrl;
        cameraPhoto.addChild(bmp);

        var URL = window.URL || window.webkitURL;
        URL.revokeObjectURL(bigUrl);

        addScaleAction(bmp);

    }

    var createImg = function (imgURL, rot) {

        //Controler.show(View_ugc_upload);

        var file = currentFile;
        var mpImg = new MegaPixImage(file);
        var sw = wid, sh = hei;
        var img = new Image();
        img.onload = function () {
            var w = img.width, h = img.height;

            if (rot < 5) {
                y = sh;
                x = parseInt(sh / h * w);
                setTimeout(function () {
                    mpImg.render(resImg, { width: x, height: y, orientation: rot });
                }, 200)
            } else {
                y = sw;
                x = parseInt(sw / h * w);
                setTimeout(function () {
                    mpImg.render(resImg, { width: x, height: y, orientation: rot });
                }, 200)
            }
        }
        img.src = imgURL;
    }

    var filePicture = $("#ugc_file2");

    filePicture.bind("change", function (e) {
        var files = e.target.files,
                file;

        if (files && files.length > 0) {
            cameraPhoto.removeAllChildren();
            file = files[0];
            currentFile = file;
            fr = new FileReader;
            fr.onloadend = function () {
                var exif = EXIF.readFromBinaryFile(new BinaryFile(this.result));
                var rot = exif.Orientation;
                try {
                    var URL = window.URL || window.webkitURL;
                    var imgURL = URL.createObjectURL(file);
                    createImg(imgURL, rot);

                }
                catch (e) {
                    try {
                        fr.onload = function (e) {
                            createImg(event.target.result, rot);
                        };
                        fr.readAsDataURL(file);
                    }
                    catch (e) {
                        alert(e);
                        throw (new Error("Neither createObjectURL or FileReader are supported"));
                    }
                }

            };
            fr.readAsBinaryString(file);
            $showorhide($get('cv-clip'), true);
            Doo.Utils.ListAction.singlecheck($get('ugc_choseimg'));

        }
    });

}

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
}());

var queue;
var OpenId = "";
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
    return;
    if (startApp) {
        OpenId = getUrlParameter("openid");
        ImageUrl = getUrlParameter("img") || getHashValue("img");
        UTM_source = getUrlParameter("utm_source");
        UTM_medium = getUrlParameter("utm_medium");
        if (ImageUrl) {
            startApp({
                first_view: View_photo_back,
                param: { imgUrl: ImageUrl }
            });
        } else {
            startApp({
                first_view: View_ugc_index
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

//新的
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

};

window.onerror = function (err, b, c) {
    alert(JSON.stringify(err));
    alert('url:' + b + ",line:" + c);
};

Doo.Page.prototype.onChildsReady = function () {
    /// <summary>页面加载完成事件</summary>
    /// <returns type="" />
    //filesArray
    //设置btn-sure的高度
    $('.btnarea-sure').height($('#view-container').width() * 400 / 1080);
    var wid = $('#view-container').width();
    var hei = document.documentElement.offsetHeight;
    window.Paint = (function () {
        var _ = {};
        $('#edit-canvas2,#merge-canvas,#ugc-clip-m').attr('height', hei);
        $('#edit-canvas2,#merge-canvas,#ugc-clip-m').attr('width', wid);

        var canvas = this.__canvas = new fabric.Canvas('edit-canvas2');
        var $canvas = $("#edit-canvas2"),
                    bgIndex = 0,
                    pageWidth = 640,
                    canvasWidth = $canvas.width(),
                    canvasHeight = $canvas.height()

        var canvasMerge = $("#merge-canvas")[0];
        var mCtx = canvasMerge.getContext("2d");

        canvas.on({
            'mouse:down': function (e) {
                if (e.target) {
                    var corner = e.target['__corner'];
                    if (corner == 'br') {
                        e.target.remove();
                    }
                }
                var activeObject = canvas.getActiveObject();
                if (activeObject) {
                    canvas.bringToFront(activeObject);
                }
            }
        });

        var sharpList = []

        _.addSharp = function (src, pos) {
            var imgSrc = src;
            var scaleImg = pageWidth / 640 * 0.6;
            var scaleCorner = pageWidth / 640;
            fabric.Image.fromURL(imgSrc, function (img) {
                var orleft = pos.left || (canvasWidth / 2);
                var orTop = pos.top || (canvasHeight / 2);
                var orscale = scaleImg;
                img.scale(scaleImg).set({
                    left: orleft,
                    top: orTop,
                    originX: "center",
                    originY: "center",
                    angle: 0
                }).set({
                    borderColor: '#FEDD5A',
                    cornerColor: '#FEDD5A',
                    cornerSize: 20 * scaleCorner,
                    transparentCorners: true
                }).setControlsVisibility({ 'mt': false, 'mr': false, 'br': false, 'mb': false, 'bl': false, 'ml': false, 'tl': false });
                canvas.add(img).setActiveObject(img);
                sharpList.push(img);
            });

        }

        _.cancel = function () {
            if (sharpList.length) {
                canvas.remove(sharpList.pop())
            }
        }

        _.clearObject = function () {
            canvas.discardActiveObject();
        };
        var cWidth = $(".canvas-wrapper").width() * 0.88;
        var mgw = $(".canvas-wrapper").width() * 0.12;
        _.mergeImage = function (cb) {
            //canvas.discardActiveObject();
            //cb && cb(canvas.toDataURL());

            var content = new Image();
            var tbg = $("#t-bg");
            var tra = $("#t-rand");

            content.onload = function () {
                mCtx.drawImage(content, 0, 0, canvas.width, canvas.height);
                mCtx.drawImage(tbg[0], 0, 0, tbg.width(), tbg.height());
                mCtx.drawImage(tra[0], 0, 0, tra.width(), tra.height());
                cb && cb(canvasMerge.toDataURL());
            };
            canvas.discardActiveObject();
            content.src = canvas.toDataURL();

            function drawing() {
                mCtx.beginPath();
                //mCtx.arc(cWidth + mgw, cWidth + mgw, cWidth, 0, 2 * Math.PI); //创建圆形剪裁路径
                mCtx.closePath();
                mCtx.clip();
                mCtx.drawImage(circle, mgw, mgw, cWidth * 2, cWidth * 2);
                imageData = canvasMerge.toDataURL();
                cb && cb();
            }

            //function drawbg() {
            //    //                        mCtx.drawImage(bg, 0, 0, cWidth* 2/0.88 , cWidth* 2/0.88 );
            //    //drawImageIOSFix(mCtx, bg, 0, 0, cWidth * 2 / 0.88, cWidth * 2 / 0.88)
            //    mCtx.drawImage(bg, 0, 0);
            //    var data = canvas.toDataURL();
            //    circle.src = data;
            //
            //    if (circle.complete) { // 如果图片已经存在于浏览器缓存，直接调用回调函数
            //        drawing();
            //        return; // 直接返回，不用再处理onload事件
            //    }
            //
            //    circle.onload = function () { //图片下载完毕时异步调用callback函数。
            //        drawing();
            //    };
            //}

        }

        _.addBg = function (data) {
            fabric.Image.fromURL(data, function (img) {
                canvas.backgroundImage = img;
                canvas.backgroundImage.width = canvasWidth;
                canvas.backgroundImage.height = canvasHeight;
                console.log(canvasHeight);
                canvas.renderAll()
            });
        }

        _.changeBgModel = function (type) {
            if (type) {
                var obj = canvas.backgroundImage;
                obj.filters[0] = new fabric.Image.filters.Grayscale()
                obj.applyFilters(canvas.renderAll.bind(canvas));
            } else {
                var obj = canvas.backgroundImage;
                obj.filters = [];
                obj.applyFilters(canvas.renderAll.bind(canvas));
            }
        }

        _.getImageData = function () {
            if (!canvas._objects.length) {
                return null;
            }
            return 1;
        }
        _.clearAll = function () {
            canvas.clear();
            canvas.dispose();
        }

        return _;
    }());

    clip_init(wid, hei);
    hide_loading();
    $ajaxjson("/editor/config/jsapi.php", function (shareinfo) {
        if (shareinfo) {
            wx.config({
                debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
                appId: shareinfo.appid, // 必填，公众号的唯一标识
                timestamp: shareinfo.timestamp, // 必填，生成签名的时间戳
                nonceStr: shareinfo.noncestr, // 必填，生成签名的随机串
                signature: shareinfo.signature, // 必填，签名，见附录1
                jsApiList: ["onMenuShareTimeline", "onMenuShareAppMessage", "chooseImage", "uploadImage"] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
            });
            var shareobj = {
                title: document.title, // 分享标题
                desc: document.title,
                link: location.origin + location.pathname, // 分享链接
                imgUrl: location.origin + '/res/css/photocat/shareicon.png', // 分享图标
                success: function () {
                    // 用户确认分享后执行的回调函数

                },
                cancel: function () {
                    // 用户取消分享后执行的回调函数
                }
            };
            wx.ready(function () {
                wx.onMenuShareTimeline(shareobj);
                wx.onMenuShareAppMessage(shareobj);
            });
        };

    });

    var _t = this;
    var share = Doo.Utils.QueryString.get_para('share');
    if (share) {
        Doo.Utils.ListAction.singlecheck($get('ugc_invite'));
        _t.findChild('img_invite').src = decodeURI(share);
    }
    else {
        Doo.Utils.ListAction.singlecheck($get('ugc_begin'));
    };
    //this.nextgender_click();
};
Doo.Page.prototype.image = '/res/vote/bg-1.png';
Doo.Page.prototype.titleimage = '';
Doo.Page.prototype.shareimage = null;
Doo.Page.prototype.finish_click = function () {
    /// <summary>点击完成并分享按钮触发的事件</summary>
    //1.上传图片并得到分享图片地址
    var _t = this;
    show_loading();
    Paint.mergeImage(function (base64data) {
        hide_loading();
        data = base64data.split(',')[1];
        data = window.atob(data);
        var ia = new Uint8Array(data.length);
        for (var i = 0; i < data.length; i++) {
            ia[i] = data.charCodeAt(i);
        }
        //alert(ia.length);
        var blob;
        try {
            blob = new Blob([ia], { type: "image/jpeg" });
            //alert('b');
        }
        catch (e) {
            // TypeError old chrome and FF
            window.BlobBuilder = window.BlobBuilder ||
                         window.WebKitBlobBuilder ||
                         window.MozBlobBuilder ||
                         window.MSBlobBuilder;
            if (e.name == 'TypeError' && window.BlobBuilder) {
                var bb = new BlobBuilder();
                bb.append(ia.buffer);
                blob = bb.getBlob("image/jpeg");
                //alert('BlobBuilder');
            }
            else if (e.name == "InvalidStateError") {
                // InvalidStateError (tested on FF13 WinXP)
                blob = new Blob([ia.buffer], { type: "image/jpeg" });
                //alert('ia.buffer');
            }
            else {
                // We're screwed, blob constructor unsupported entirely   
                alert('Error');
                return;
            }
        }

        var fd = new FormData();
        fd.append('action', 'uploaduserphoto');
        fd.append('file', blob);
        fd.append('openid', OpenId);

        Pop.show('loader');
        $("#upload-pop").removeClass("hidden");

        $.ajax({
            //'url': VHost + 'api/index.php',
            'url': 'upload.php',
            'type': 'POST',
            'enctype': 'multipart/form-data',
            'dataType': 'json',
            'processData': false,
            'contentType': false,
            'data': fd,
            'success': function (data) {
                _t.shareimage = data.url;
                Pop.hide();
                _t.findChild('img_final').src = data.url;
                Doo.Utils.ListAction.singlecheck($get('ugc_final'));
                Pop.show('share');
                //初始化分享者
                var shareobj = {
                    title: document.title, // 分享标题
                    desc: document.title,
                    link: location.origin + location.pathname + '?share=' + encodeURI(data.url), // 分享链接
                    imgUrl: location.origin + '/res/css/photocat/shareicon.png', // 分享图标
                    success: function () {
                        // 用户确认分享后执行的回调函数
                        Doo.Utils.ListAction.singlecheck($get('ugc_shareok'));
                        Pop.hide();
                        //alert("分享成功");
                    },
                    cancel: function () {
                        // 用户取消分享后执行的回调函数
                    }
                };
                wx.ready(function () {
                    wx.onMenuShareTimeline(shareobj);
                    wx.onMenuShareAppMessage(shareobj);
                });
            },
            'error': function (error) {
                Pop.hide();
                console.log(error);
                alert("图片上传失败");
            }
        });

    });
};
Doo.Page.prototype.pop_click = function () {
    //alert('此处应该弹出参加活动的引导图');
    //Doo.Utils.ListAction.singlecheck($get('ugc_join'));
    //4-19改为直接参加活动
    Doo.Utils.ListAction.singlecheck($get('ugc_begin'));
}
Doo.Page.prototype.nextgender_click = function () {
    //进入选择性别界面
    Doo.Utils.ListAction.singlecheck($get('ugc_chosegender'));
    //闪光效果
    var whitecover = $('.whitecover');
    whitecover.css('display', 'block');
    whitecover.css('opacity', 1);
    setTimeout(function () {
        whitecover.css('opacity', 0.3);
    }, 1000);
    Paint.addBg(canvas_clip.toDataURL());
    $showorhide($get('cv-clip'), false);
    $showorhide($get('cv'), true);

}
var material = {
    male: [1, 2, 3, 4, 6, 7, 8, 12, 15, 16, 17, 20, 201, 202, 203, 204, 205, 206],
    female: [18, 22, 23, 24, 31, 32, 33, 34, 35, 101, 102, 103, 104, 105, 106, 201, 202, 203, 204, 205, 206]
};
var theme = {
    male: [1, 3, 4, 7, 8, 9, 10],
    female: [1, 2, 3, 5, 6, 7]
};
var material_num = 5;
Doo.Page.prototype.gender_click = function (s) {
    var gender = s.getAttribute('ctlid') == 'img_male' ? 'male' : 'female';
    Doo.Utils.ListAction.singlecheck($get('ugc_pretty'));
    //播放音效
    audio_succ = $('#audio_succ')[0];
    if (audio_succ) audio_succ.play();
    //返回全透明
    var whitecover = $('.whitecover');
    whitecover.css('opacity', 0);
    setTimeout(function () {
        whitecover.css('display', 'none');
    }, 800);

    //随机添加五个数字
    var randfrom = material[gender].slice(0);
    var randnum = 0;
    var randto = [];
    while (randnum < material_num) {
        var ri = parseInt(Math.random() * randfrom.length);
        randto.push('src/img/' + gender + '/' + randfrom[ri] + '.png');
        randnum++;
        randfrom.splice(ri, 1);
    };

    Paint.addSharp(randto[0], { left: 130, top: 400 });
    Paint.addSharp(randto[1], { left: 330, top: 500 });
    Paint.addSharp(randto[2], { left: 130, top: 500 });
    Paint.addSharp(randto[3], { left: 330, top: 600 });
    Paint.addSharp(randto[4], { left: 430, top: 310 });

    //随机主题
    var themefor = theme[gender];
    var themeindex = themefor[parseInt(Math.random() * themefor.length)];
    $('#t-rand').attr('src', '/res/css/photocat/theme/t-' + themeindex + '.png');
    //alert(gender);
}
Doo.Page.prototype.start_click = function () {
    //返回开始
    Doo.Utils.ListAction.singlecheck($get('ugc_begin'));

    return;
};
//document.ontouchstart = function (e) { e.preventDefault(); }
document.ontouchmove = function (e) { e.preventDefault(); }