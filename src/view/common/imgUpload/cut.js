var httpHelper = require('js/utils/httpHelper');

(function($) {
    $.fn.extend({
        cut: function(options, btn_file, btn_upload) {
            return this.each(function() {
                return new Cut(this, options, btn_file, btn_upload);
            });
        }
    });

    var default_options = {
        width: 300,
        height: 300
    };

    var Cut = function(ele, user_options, $btn_file, $btn_upload) {
        var self = this;

        // cut options
        var options = self.options = $.extend(true, {}, default_options, user_options);

        // img dom
        var $ele = self.ele = $(ele);
        // style
        $ele.parent().css({
            'position': 'relative'
        });
        $ele.css({
            'position': 'absolute',
            'top': 20,
            'left': 340,
            'z-index': 2,
            'width': 200,
            'height': 200 * options.height / options.width
        });
        // $ele.hide();

        self.origin_url = $ele.attr('src') || '';
        self.data = {};

        var $wrap = $('<div class="cut"></div>').insertAfter($ele);
        var $wrap_display = $('<div class="cut-display"><img src="" /><div class="img"></div></div>').appendTo($wrap);
        var $wrap_preview = $('<div class="cut-preview"><div class="cut-box"><div class="img"></div></div><div class="size-msg mt10">图片大小：' + options.width + '*' + options.height + '</div></div>').appendTo($wrap);
        var $wrap_btn = $('<div class="btn-wrap"></div>').appendTo($wrap);
        // var $input_file = $('<input class="input-file" type="file" />').appendTo($wrap_btn).wrap('<div class="btn btn-primary btn-choose">选择图片</div>');
        //var $btn_file = $('<div class="btn btn-primary btn-choose">选择图片</div>').appendTo($wrap_btn);
        //var $btn_upload = $('<div class="btn btn-primary btn-upload" disabled="disabled">上传图片</div>').appendTo($wrap_btn);
        $wrap_btn.append('<span class="msg msg-warning">上传中，请稍后...</span><span class="msg msg-success">上传成功</span><span class="msg msg-danger">上传失败！</span>');

        var original = {}; //原图
        var display = {}; //显示框
        var scale = {}; //缩放图
        var cut = {}; //截取图(默认虚框)
        var request = {};
        var jDisplay = null;
        var jBox = null; //预览窗口(多组, 大, 中, 小)

        var src = "";
        var background = "";
        var filter_image = "";
        var filter_scale = "";

        self.h5 = new H5Uploader({
            placeholder: $btn_file,
            uploadUrl: httpHelper.url('/common/upload'),  // _api + '/common/upload',
            filePostName: 'file',
            limitFilesLen: 999999,
            fileSizeLimit: 10240,
            isSingleMode: true,
            async: true,
            accept: 'image/*',
            uploadPreview: function(files) {
                $wrap.find('.msg').hide();
                // self.ele.attr({
                //   'src': '',
                //   'data-img': ''
                // });
                change(files[0]);
            },
            uploadStart: function() {
                $wrap.find('.msg').hide();
                $wrap.find('.msg-warning').show();
            },
            uploadSuccess: function(idx, data) {
                $wrap.find('.msg').hide();
                $wrap.find('.msg-success').show();
                data = JSON.parse(data);
                $ele.attr({
                    'data-img': data.fileStoreId,
                    'src': data.filepath
                });
                //上传成功按钮disabled
                $btn_upload.attr("disabled", "disabled"); // 禁用
                //$btn_upload.removeClass("btn-primary").addClass("btn-default");
            },
            uploadError: function(idx, data) {
                $wrap.find('.msg').hide();
                $wrap.find('.msg-danger').show();
            },
            // 上传全部完成
            uploadComplete: function() {
                // console.log('上传全部完成');
            },
            typeError: function() {
                alert("上传图片格式有误");
            },
            sizeError: function() {
                alert("上传图片大小不能超过10M");
            },
            nullError: function() {

            }
        });

        $btn_upload.on('click', function() {
            if (self.h5) {
                self.h5.addPostParam(request);
                self.h5.upload();
            }
        });


        // size
        var $box = $wrap_preview.find('.cut-box');
        $box.css({
            height: options.height / options.width * $box.width()
        });

        var change = function(file) {
            $ele.hide();
            //上传成功按钮enabled
            $btn_upload.removeAttr("disabled"); // 启用
            //$btn_upload.removeClass("btn-default").addClass("btn-primary");

            if (window.FileReader) {
                var reader = new FileReader();
                reader.onload = function() {
                    src = reader.result;
                    load(src);
                };
                reader.readAsDataURL(file);
            } else { //IE8,IE9
                //  $(file).select();
                //  $(file).blur();
                // debugger;
                if (file.src != undefined) {
                    src = file.src;
                } else {
                    var obj = $("form[action='../../api/common/upload']>input[type='file']");
                    obj.select();
                    obj.blur();
                    src = document.selection.createRange().text;
                }
                load();
            }
        };

        function load() {
            jDisplay = $wrap.find(".cut-display");
            jBox = $wrap.find('.cut-box'); //预览窗口(多组, 大, 中, 小)
            background = "url('" + src + "')";
            filter_image = "progid:DXImageTransform.Microsoft.AlphaImageLoader(src='" + src + "',sizingMethod='image')";
            filter_scale = "progid:DXImageTransform.Microsoft.AlphaImageLoader(src='" + src + "',sizingMethod='scale')";
            jDisplay.html('<img src=""/><div class="img"></div>');

            setTimeout(function() {
                setFixed(); //设置固定值
                setOriginal(); //设置原始图大小
                //setScale(); //设置缩略图大小
                //setCut(); //设置截取
            }, 30);
        }


        function setFixed() {
            display.w = jDisplay.width();
            display.h = jDisplay.height();
            cut.w = jBox.first().width();
            cut.h = jBox.first().height();
        }

        function setOriginal() {
            //ie
            if (navigator.appName == "Microsoft Internet Explorer") {
                jDisplay.find("img").attr("src", src).css({
                    filter: filter_image //IE10-特殊需要, 用来计算原图宽高
                });
                jDisplay.add(jBox).find(".img").css({
                    backgroundImage: background,
                    filter: filter_scale
                });

                var img = jDisplay.find("img")[0];
                if (src != undefined && src.indexOf != undefined && src.indexOf('data:') === 0) {
                    original.w = img.naturalWidth;
                    original.h = img.naturalHeight;
                } else {
                    //IE10 -
                    original.w = img.offsetWidth;
                    original.h = img.offsetHeight;
                }
                //ie 8 正常
                setScale(); //设置缩略图大小
                setCut(); //设置截取

            } else { //非 ie8
                var imgObj = jDisplay.find("img")[0];
                imgObj.src = src;
                if (imgObj.complete) { //图片加载完成 completeImage
                    var imgHeight = imgObj.height;
                    var imgWidth = imgObj.width;
                    jDisplay.find("img").css({
                        filter: filter_image //IE10-特殊需要, 用来计算原图宽高
                    });
                    jDisplay.add(jBox).find(".img").css({
                        backgroundImage: background,
                        filter: filter_scale
                    });
                    // original.w=imgWidth;
                    // original.h=imgHeight;
                    //console.log("img html"+img);
                    if (src != undefined && src.indexOf != undefined && src.indexOf('data:') === 0) {
                        original.w = imgObj.naturalWidth;
                        original.h = imgObj.naturalHeight;
                    } else {
                        //IE10 -
                        original.w = imgObj.offsetWidth;
                        original.h = imgObj.offsetHeight;
                    }
                    setScale(); //设置缩略图大小
                    setCut(); //设置截取
                } else {
                    imgObj.onload = function() {
                        var imgHeight = imgObj.height;
                        var imgWidth = imgObj.width;
                        jDisplay.find("img").css({
                            filter: filter_image //IE10-特殊需要, 用来计算原图宽高
                        });
                        jDisplay.add(jBox).find(".img").css({
                            backgroundImage: background,
                            filter: filter_scale
                        });
                        //original.w=imgWidth;
                        //original.h=imgHeight;

                        //console.log("img html"+img);
                        if (src != undefined && src.indexOf != undefined && src.indexOf('data:') === 0) {
                            original.w = imgObj.naturalWidth;
                            original.h = imgObj.naturalHeight;
                        } else {
                            //IE10 -
                            original.w = imgObj.offsetWidth;
                            original.h = imgObj.offsetHeight;
                        }
                        setScale(); //设置缩略图大小
                        setCut(); //设置截取
                    }
                }
            }

        }

        function setScale() {
            var jOriginal = jDisplay.find("img"), //原图
                jScale = jDisplay.find(".img"), //缩放图(初始化jcrop插件会把缩放图重置位置)
                dScale = display.w / display.h,
                oScale = original.w / original.h;
            if (dScale < oScale) {
                //高<宽
                var height = original.h * (display.w / original.w), //高度(缩放)
                    top = (display.h - height) / 2;
                jScale.add(jOriginal).css({
                    "width": display.w, //display.w -1
                    "height": height,
                    "margin-left": 0, //1
                    "margin-top": top
                });
                if (height < cut.h) {
                    alert("建议换一张图片, 宽度和高度比例不协调.");
                }
            } else {
                //宽<高
                var width = original.w * (display.h / original.h), //宽度(缩放)
                    left = (display.w - width) / 2;
                jScale.add(jOriginal).css({
                    "height": display.h, //display.h-1
                    "width": width,
                    "margin-top": 0, //1
                    "margin-left": left
                });
                if (width < cut.w) {
                    alert("建议换一张图片, 宽度和高度比例不协调.");
                }
            }
            scale.w = jScale.width(); //缩放图
            scale.h = jScale.height();
            request.ratio = original.w / scale.w;
        }

        function setCut() {
            var jBg = jDisplay.find(".img");
            var x = (scale.w - cut.w) / 2, //起始点
                y = (scale.h - cut.h) / 2
            jBg.Jcrop({
                bgFade: true,
                //allowSelect: false,//左上角直接拖出, 选框消失
                //minSize: [10, 10],
                //trackDocument: false,//性能不好
                setSelect: [x, y, x + cut.w, y + cut.h],
                aspectRatio: cut.w / cut.h,
                onchange: getCoords,
                onSelect: getCoords
            }, function() {
                var jcrop_api = this;
                //jcrop_api.setSelect([x, y, x2, y2]); //setSelect 或 animateTo
                var jImg = jDisplay.find("img");
                var top = jImg.css("margin-top"),
                    left = jImg.css("margin-left");
                $wrap.find(".jcrop-holder").css({
                    "margin-left": left,
                    "margin-top": top
                });
                if (jBg.width() < cut.w || jBg.height() < cut.h) {
                    jcrop_api.release();
                }
            });
        }

        function getCoords(c) {
            //console.log(JSON.stringify(c));
            $.extend(true, request, c);
            for (var key in request) {
                request[key] = parseFloat(request[key]).toFixed(2);
            }
            updatePreview(c);
        }

        function updatePreview(c) {
            if (parseInt(c.w) > 0) {
                for (var i = 0, len = jBox.length; i < len; i++) {
                    var jTemp = jBox.eq(i),
                        ratioW = jTemp.width() / c.w,
                        ratioH = jTemp.height() / c.h;
                    jTemp.find(".img").css({
                        width: Math.round(ratioW * scale.w) + 'px',
                        height: Math.round(ratioH * scale.h) + 'px',
                        marginLeft: '-' + Math.round(ratioW * c.x) + 'px',
                        marginTop: '-' + Math.round(ratioH * c.y) + 'px'
                    });
                }
            }
        };
    };

    Cut.prototype.upload = function(callback) {}
    Cut.prototype.get = function(callback) {}
})(jQuery);
