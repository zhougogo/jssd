var CurrentPhotoData;

var View_ugc_index = new View({
    id: 'ugc_index',
    //showStyle: 'slidetop',
    //hideStyle: 'slideleft',
    init: function () {
        var _this = this;
        //取消按钮
        $(".ugc-u-btn1").click(function () {
            Controler.show(View_ugc_index);
            cameraPhoto.removeAllChildren();
        });

        //编辑按钮
        $(".ugc-u-btn2").click(function () {
            Paint.addBg(canvas.toDataURL());
            $(".ugc-part2").show();
            $(".ugc-part1").hide();
        });

        //撤销按钮
        $(".ugc-edit-cancel").click(function () {
            //TODO
        })

        var currentFile = null;
        var canvas = document.getElementById("ugc-clip");
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
                    this.offset = {x: this.x - evt.stageX, y: this.y - evt.stageY};
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
                /*
                var mc = new Hammer(canvas, {touchAction: "pan-y"});
                // mc.get('pan').set({ direction: Hammer.DIRECTION_ALL });
                // mc.get('pinch').set({ enable: true });
                mc.get('rotate').set({enable: true});
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
                */
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
                    var y = (h - 320) / 2;
                    cameraPhoto.y = -1 * y;
                    //cameraPhoto.x = -310;
                } else {
                    var x = (w - 320) / 2;
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

            Controler.show(View_ugc_upload);

            var file = currentFile;
            var mpImg = new MegaPixImage(file);
            var sw = 320, sh = 320;
            var img = new Image();
            img.onload = function () {
                var w = img.width, h = img.height;

                if (rot < 5) {
                    y = sh;
                    x = parseInt(sh / h * w);
                    setTimeout(function () {
                        mpImg.render(resImg, {width: x, height: y, orientation: rot});
                    }, 200)
                } else {
                    y = sw;
                    x = parseInt(sw / h * w);
                    setTimeout(function () {
                        mpImg.render(resImg, {width: x, height: y, orientation: rot});
                    }, 200)
                }
            }
            img.src = imgURL;
        }

        var filePicture = $("#ugc-file");

        filePicture.bind("change", function (e) {
            var files = e.target.files,
                file;

            if (files && files.length > 0) {
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
                            throw(new Error("Neither createObjectURL or FileReader are supported"));
                        }
                    }

                };
                fr.readAsBinaryString(file);
            }
        });

    },
    load: function () {
    },
    show: function () {
        var _this = this;
    },
    hide: function () {
    }
});

var Paint;
var View_ugc_upload = new View({
    id: 'ugc_upload',
    //showStyle: 'slidetop',
    //hideStyle: 'slideleft',
    init: function () {
        var _this = this;


        $(".ugc-model-btn").click(function () {
            $(".ugc-model-btn").removeClass('selected');
            $(this).addClass("selected");
            var model = $(this).attr("model");
            if (model == 1) {
                Paint.changeBgModel(1);
            } else {
                Paint.changeBgModel(0);
            }
        });

        $(".ugc-ele").click(function (e) {
            Paint.addSharp($(this).attr("sid"));
        });

        $(".ugc-edit-cancel").click(function(){
            Paint.cancel();
        })

        //生成按钮
        $(".ugc-edit-generate").click(function () {
            Paint.mergeImage(function (base64data) {
                data = base64data.split(',')[1];
                data = window.atob(data);
                var ia = new Uint8Array(data.length);
                for (var i = 0; i < data.length; i++) {
                    ia[i] = data.charCodeAt(i);
                }
                var blob = new Blob([ia], {type: "image/jpeg"});

                var fd = new FormData();
                fd.append('action', 'uploaduserphoto');
                fd.append('file', blob);
                fd.append('openid', OpenId);



                Pop.show('loader');
                $("#upload-pop").removeClass("hidden");

                $.ajax({
                    //'url': VHost + 'api/index.php',
                    'url': 'http://ugc.ddms.nurunci.com/api/index.php',
                    'type': 'POST',
                    'enctype': 'multipart/form-data',
                    'dataType': 'json',
                    'processData': false,
                    'contentType': false,
                    'data': fd,
                    'success': function (data) {
                        Pop.hide();
                        if (data.haserror) {
                            alert(data.msg);
                        } else {
                            Controler.show(View_ugc_share, {imgUrl: data.url});
                            //after success
                            Paint.clearAll();
                            Request.addUgcUser({
                                success:function(){

                                }
                            });
                        }
                    },
                    complete:function(){
                      Pop.hide();
                    },
                    'error': function (error) {
                        console.log(error);
                        alert("图片上传失败");
                    }
                });

            })
        });


        Paint = (function () {
            var _ = {};

            var canvas = this.__canvas = new fabric.Canvas('edit-canvas');
            var $canvas = $("#edit-canvas"),
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

            _.addSharp = function (tid) {
                var imgSrc = queue.getResult(tid).src;
                var scaleImg = pageWidth / 640 * 1;
                var scaleCorner = pageWidth / 640;
                fabric.Image.fromURL(imgSrc, function (img) {
                    var orleft = canvasWidth / 2;
                    var orTop = canvasHeight / 2;
                    var orscale = scaleImg;
                    img.scale(scaleImg).set({
                        left: orleft,
                        top: orTop,
                        originX: "center",
                        originY: "center",
                        angle: 0
                    }).set({
                        borderColor: 'white',
                        cornerColor: 'white',
                        cornerSize: 20 * scaleCorner,
                        transparentCorners: false
                    });
                    canvas.add(img).setActiveObject(img);
                    sharpList.push(img);
                });

            }

            _.cancel = function(){
                if(sharpList.length){
                    canvas.remove(sharpList.pop())
                }
            }

            _.clearObject = function () {
                canvas.discardActiveObject();
            };
            var cWidth = $(".canvas-wrapper").width() * 0.88;
            var mgw = $(".canvas-wrapper").width() * 0.12;
            _.mergeImage = function (cb) {
                var content = new Image();
                var $border = $(".ugc-u-border-img");

                content.onload = function () {
                    mCtx.drawImage(content, 10, 10, canvas.width, 347);
                    mCtx.drawImage($border[0], 0, 0, 627, 437);
                    cb && cb(canvasMerge.toDataURL());
                }
                canvas.discardActiveObject();
                content.src = canvas.toDataURL()

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
    },
    load: function () {
        $(".ugc-part1").show();
        $(".ugc-part2").hide();

        //$(".ugc-part2").show();
        //$(".ugc-part1").hide();
    },
    show: function () {
        var _this = this;

    },
    hide: function () {
    }
});

var View_ugc_share = new View({
    id: 'ugc_share',
    //showStyle: 'slidetop',
    //hideStyle: 'slideleft',
    init: function () {
        var _this = this;

        $(".ugc-share-btn").click(function () {
            Pop.show("share");
        });

        $(".ugc-again-btn").click(function () {
            Controler.show(View_ugc_index);
        })
    },
    load: function (param) {
        $("#ugc-share-img")[0].src = param.imgUrl;
        location.href = location.href+"#img="+param.imgUrl;
    },
    show: function () {
        var _this = this;

    },
    hide: function () {
    }
});

