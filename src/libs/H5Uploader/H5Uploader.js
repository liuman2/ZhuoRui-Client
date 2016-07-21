(function() {
    var H5Uploader = (function() {
        // html5 image uploader
        var h5Uploader = function(cfg) {
            if (!(this instanceof h5Uploader)) {
                return new h5Uploader(cfg);
            }
            return this.init(cfg);
        };

        var HTTP_STATUS_MSG = {
            '0': '网络连接超时，请重新再试',
            '403': '您没有相应权限',
            '404': '出错啦，联系管理员试试'
        };

        // 默认参数
        var config = {
            // 容器id
            placeholder: '#upload_btn',
            // cgi field
            filePostName: 'file',
            // 上传其他参数
            postParams: {

            },
            // 一次性上传最大文件数
            limitFilesLen: 10000,
            // 上传图片最大尺寸
            fileSizeLimit: 5120000,
            // title
            title: '',
            // 是否单文件上传
            isSingleMode: false,
            // 文件类型支持
            accept: '*/*',
            // 是否支持异步上传
            async: false,
            // 上传之前
            beforeUpload: function() {

            },
            // 开始上传某一张图片
            uploadStart: function() {

            },
            // 成功上传某一张图片
            uploadSuccess: function() {

            },
            // 失败上传某一张图片
            uploadError: function() {

            },
            // 上传全部完成
            uploadComplete: function() {

            },
            // 数量超出限额
            numError: function() {
                // alert('数量超出限额');
            },
            // 文件大小有误
            sizeError: function(idx) {
                // alert('第' + (idx + 1) + '张图片大小上限为' + this.config.fileSizeLimit / 1024 + 'MB');
            },
            // 文件内容空
            nullError: function(idx) {
                // alert('第' + (idx + 1) + '张图片为空');
            }
        };

        // 支持事件
        var supportEvents = ['beforeUpload', 'uploadPreview', 'uploadStart', 'uploadSuccess', 'uploadError', 'uploadComplete', 'numError', 'sizeError', 'nullError', 'typeError'];

        // 支持文件类型
        var supportAcceptMap = {
            'image/*': ['jpg', 'jpeg', 'gif', 'png'],
            'video/*': ['asf', 'mov', 'wmv', 'rm', 'rmvb', 'mpeg', 'mpe', '3gp', 'mp4', 'm4v', 'avi', 'flv' ],
            'audio/*': ['mp3', 'aac', 'wav', 'wma', 'flac', 'mka', 'mp2', 'mpa', 'ofr', 'ogg', 'ra', 'wv', 'tta', 'ac3', 'dts'],
            'doc/*': ['vsd', 'rtf', 'pdf', 'doc', 'docx', 'ppt', 'pptx', 'xls', 'xlsx'],
            'excel/*': ['xls', 'xlsx'],
            'application/zip': ['zip'],
            'courseware/*': ['jpg', 'jpeg', 'gif', 'png', 'asf', 'mov', 'wmv', 'rm', 'rmvb', 'mpeg', 'mpe',
                '3gp', 'mp4', 'm4v', 'avi', 'flv', 'mp3', 'wav', 'wma', 'vsd', 'rtf',
                'pdf', 'doc', 'docx', 'ppt', 'pptx', 'xls', 'xlsx', 'H5'
            ]
        };

        // 初始化
        h5Uploader.prototype.init = function(cfg) {
            // 修改配置
            this.cfg(cfg);
            if (!this.config.placeholder.length) {
                return this;
            }
            this.fileQueue = [];
            this.xhrs = [];
            this.index = 0;
            // 设置内容
            this.reset();
            // 用户自定义事件绑定
            for (var o in supportEvents) {
                var name = supportEvents[o];
                this.bind(name, this.config[name]);
            }
            if (this.config.placeholder.attr('disabled')) {
                this.disable();
            }
            return this;
        };

        // 修改配置
        h5Uploader.prototype.cfg = function(cfg) {
            this.config = $.extend(true, {}, config, this.config, cfg);
            this.config.myAccept = cfg.myAccept ? cfg.myAccept : this.config.accept;
            if (this.config.placeholder) {
                this.config.placeholder = $(this.config.placeholder);
                this.config.placeholder.find('input[type=file]').attr('accept', this.config.accept);
                this.config.placeholder.find('form').attr('action', this.config.uploadUrl);
            }
            this.config.dlimitFilesLen = this.config.limitFilesLen;
        };


        // checkType
        h5Uploader.prototype.checkType = function(filename) {
            var fileType = filename.substr(filename.lastIndexOf('.') + 1).toLowerCase();
            var accept = this.config.myAccept;
            for (var o in supportAcceptMap) {
                var isSupport = accept.indexOf(o) > -1;
                if (isSupport && $.inArray(fileType, supportAcceptMap[o]) > -1) {
                    return true;
                }
            }
            return accept == '*/*';
        };

        h5Uploader.prototype.getType = function(filename) {
            var fileType = filename.substr(filename.lastIndexOf('.') + 1).toLowerCase();
            var accept = this.config.myAccept;
            for (var o in supportAcceptMap) {
                var isSupport = accept.indexOf(o) > -1;
                if (isSupport && $.inArray(fileType, supportAcceptMap[o]) > -1) {
                    return o;
                }
            }
            return 'unknown';
        };

        // 检查文件大小、文件类型、文件是否为空
        h5Uploader.prototype.check = function(files) {

            var that = this;
            var len = files.length;
            // 一次性上传文件数量限制
            if (that.config.dlimitFilesLen < len) {
                that.execHandler('numError');
            } else if (that.execHandler('beforeUpload', files) !== false) {
                // 加载files，做检查
                for (var i = 0; i < len; i++) {
                    var file = files[i];
                    // 过滤不合格的文件
                    var filename = file.name;
                    if (!that.checkType(filename)) {
                        that.execHandler('typeError', i);
                        that.fileQueue.push(null);
                    } else if (file.size > that.config.fileSizeLimit * 1000) {
                        that.execHandler('sizeError', i);
                        that.fileQueue.push(null);
                    } else if (file.size == 0) {
                        that.execHandler('nullError', i);
                        that.fileQueue.push(null);
                    } else {
                        that.fileQueue.push(file);
                        // 执行完毕之后开始上传，且beforeUpload执行回调返回true
                        that.config.dlimitFilesLen -= 1;
                    }
                }
                // 检查好了之后分配给上传或者预览
                that.assign();
            }
        };

        // 增加
        h5Uploader.prototype.append = function() {
            var $placeholder = $(this.config.placeholder);
            var iframeId = 'target' + Math.random();

            var w = '82px'; //'300px'; //$placeholder.css('width') || '300px';
            var h = '32px';//'150px'; //$placeholder.css('height') || '150px';

            var $content = $('<form  method="post"\
          enctype="multipart/form-data" target="' + iframeId + '" action="' + this.config.uploadUrl + '" style="width: ' + w + ';height: ' + h + ';overflow: hidden;opacity: 0;filter: alpha(opacity=0);z-index: 2; position: absolute; top: 0; left: 0;"><input type="file" name="' + this.config.filePostName + '" title="' + this.config.title + '" ' + (!this.config.isSingleMode ? 'multiple="multiple"' : '') + ' accept="' + this.config.accept + '" style="position: absolute; top: 0px; left: -7430px; z-index: 99; font-size: 600px; cursor: pointer; opacity: 0.01;" data-value="" /></form><iframe width="0" height="0" frameborder="0" style="width:0;height:0;border: 0;display: none;"\
           src="about:blank;" id="' + iframeId + '" name="' + iframeId + '"></iframe>').appendTo($placeholder);

            var that = this;
            var $file = $placeholder.find('input[type=file]'),
                inputWidth = $file.width();
            if (inputWidth > 0) {
                $file.css('left', Math.max($placeholder.width(), 100) - inputWidth + 'px');
            }
            $file.bind('change', function(e) {
                // 防止drop和paste导致触发两次
                if (that.changeByOther) {
                    return;
                }
                that.changeByOther = false;
                // 清空数据
                that.clearData();
                // for <=IE9
                if (this.files) {
                    that.check(this.files);
                } else {
                    if (that.config.dlimitFilesLen < 1) {
                        that.execHandler('numError');
                    } else {

                        var filename = $(this).val();
                        var file = {};
                        // 为了IE8、9截图
                        // 发现在弹窗情况下会出错，待查
                        try {
                            $(this).select();
                            if (/MSIE 9/.test(window.navigator.userAgent)) {
                                $placeholder.find('input[type=file]').blur();
                            }
                            file.src = document.selection.createRange().text;
                        } catch (e) {}

                        file.name = filename.substr(filename.lastIndexOf('\\') + 1).toLowerCase();
                        file.size = 0;
                        that.fileQueue = [file];

                        if (that.execHandler('beforeUpload', that.fileQueue) !== false) {

                            if (!that.checkType(filename)) {
                                that.execHandler('typeError', 0);
                                that.fileQueue[0] = null;
                            } else {
                                var $form = $placeholder.find('form');
                                var $iframe = $placeholder.find('iframe');
                                that.xhrs.push({
                                    abort: function() {
                                        $iframe.unbind('load').attr('src', 'about:blank;');
                                    }
                                });
                                // 改写upload
                                that.upload = function() {
                                    for (var o in that.config.postParams) {
                                        $form.append('<input type="hidden" name="' + o + '" value="' + that.config.postParams[o] + '">');
                                    }
                                    $form[0].submit();
                                    that.config.dlimitFilesLen--;
                                    that.execHandler('uploadStart', 0, file);
                                };
                                $iframe.bind("load", function() {
                                    $iframe.unbind("load");
                                    try {
                                        var responseText = $iframe[0].contentWindow.document.body.innerText;
                                        var match = responseText.match(/HTTP\s*?STATUS\s*?(\d+)/i);
                                        if (match && match.length > 1) {
                                            var status = match[1];
                                            that.execHandler('uploadError', 0, HTTP_STATUS_MSG[status] ? '{"message":"' + HTTP_STATUS_MSG[status] + '"}' : '{"message":"上传遇到未知错误"}', file);
                                        } else {
                                            that.execHandler('uploadSuccess', 0, responseText, file);
                                        }
                                    } catch (e) {
                                        that.execHandler('uploadError', 0, '{"message":"上传遇到未知错误"}', file);
                                    }
                                    that.execHandler('uploadComplete');
                                });
                            }

                            that.assign();

                        }
                    }
                }
                // 异步处理
                if (!that.config.async) {
                    that.clearForm();
                }
            });

            $placeholder[0].ondrop = $placeholder[0].onpaste = function(e) {
                // 清空数据
                that.clearData();
                that.check(e.dataTransfer.files);
                that.changeByOther = true;
            };
            this.content = $content;
        };

        // 绑定事件
        h5Uploader.prototype.bind = function(eventName, eventHandler) {
            this.eventHandlers = this.eventHandlers || {};
            if (supportEvents.indexOf(eventName) != -1 && typeof eventHandler == 'function') {
                this.eventHandlers[eventName] = eventHandler;
            }
        };

        // 执行事件
        h5Uploader.prototype.execHandler = function() {
            var eventName = Array.prototype.shift.call(arguments);
            if (eventName == 'uploadStart') {
                this.setState(true);
            }
            if (eventName == 'uploadComplete') {
                this.clear();
            }
            if (this.eventHandlers[eventName]) {
                return this.eventHandlers[eventName].apply(this, arguments);
            }
        };

        // 上传某一个，串行
        h5Uploader.prototype.uploadOne = function(idx) {
            var that = this;
            idx = idx || 0;
            that.index = idx;
            var file = that.fileQueue[idx];
            // file不存在则上传下一个
            if (file) {
                // 单一文件开始上传
                that.execHandler('uploadStart', idx, file);

                var xhr = new XMLHttpRequest();
                // 文件上传成功或是失败
                xhr.onreadystatechange = function(e) {
                    if (xhr.readyState == 4) {
                        if (xhr.status == 200) {
                            // 上传成功
                            that.execHandler('uploadSuccess', idx, xhr.responseText, file);
                        } else if (xhr.status == 401) {
                            // 丑陋的实现，也只是为了省事
                            $('#logout').trigger('click');
                        } else {
                            // 上传失败
                            that.execHandler('uploadError', idx, HTTP_STATUS_MSG[xhr.status] ? '{"message":"' + HTTP_STATUS_MSG[xhr.status] + '"}' : xhr.responseText, file);
                        }
                        // 查看是否结束上传
                        if (++idx == that.fileQueue.length) {
                            that.execHandler('uploadComplete');
                            that.clear();
                        } else {
                            that.uploadOne(idx);
                        }
                    }
                };
                // 文件流使用formdata提交，可支持图片处理
                var formdata = new FormData();
                formdata.append("file", file);
                for (var o in that.config.postParams) {
                    formdata.append(o, that.config.postParams[o]);
                }
                xhr.open("POST", that.config.uploadUrl, true);
                xhr.send(formdata);
                // 缓存xhr
                that.xhrs.push(xhr);
            } else if (++idx < that.fileQueue.length) {
                that.uploadOne(idx);
            } else {
                that.execHandler('uploadComplete');
            }
        };

        // 开始上传
        h5Uploader.prototype.upload = function() {
            if (this.fileQueue.length) {
                this.uploadOne();
            }
        };

        // 预览
        h5Uploader.prototype.uploadPreview = function() {
            this.execHandler('uploadPreview', this.fileQueue);
        };

        // 分配
        h5Uploader.prototype.assign = function() {
            // 当只文件队列存在可预览的项目时才显示
            var hasFile = false;
            this.fileQueue.map(function(item) {
                hasFile = hasFile || !!item;
            });
            if (hasFile && !this.config.async) {
                this.upload();
            } else if (hasFile) {
                this.uploadPreview();
            } else {
                this.clear();
            }
        };

        // 新增参数
        h5Uploader.prototype.addPostParam = function(list) {
            if (typeof list != 'object') {
                return false;
            }
            for (var o in list) {
                this.config.postParams[o] = list[o];
            }
        };

        // 清空数据
        h5Uploader.prototype.clearData = function() {
            this.index = 0;
            this.fileQueue.splice(0, this.fileQueue.length);
            this.xhrs.splice(0, this.xhrs.length);

        };

        // 清空数据
        h5Uploader.prototype.clearForm = function() {
            // 可以重新上传相同文件
            var $form = $(this.config.placeholder).find('form');
            if ($form.length) {
                $form.find('input[type=hidden]').remove();
                // $form[0].reset();
            }
        };

        // 清空
        h5Uploader.prototype.clear = function() {
            // 可以重新上传相同文件
            this.clearForm();
            // 清空文件相关数据
            this.clearData();
            // 设置状态
            this.setState(false);
        };

        // 清空，重置
        h5Uploader.prototype.reset = function() {
            this.clear();
            this.append();
        };

        // 取消上传
        h5Uploader.prototype.cancel = function(idx) {
            idx = idx || 0;
            if (this.fileQueue[idx]) {
                this.fileQueue[idx] = null;
            }
            if (this.xhrs[idx]) {
                this.xhrs[idx].onreadystatechange = null;
                this.xhrs[idx].abort();
            }
            this.config.dlimitFilesLen++;
            if (this.index == idx) {
                this.uploadOne(idx + 1);
            }
        };

        // 不允许操作
        h5Uploader.prototype.disable = function() {
            var $inputs = this.config.placeholder.find('input');
            $inputs.map(function(index) {
                $inputs.eq(index).prop('disabled', true).css('cursor', 'default');
            });
        };

        // 允许操作
        h5Uploader.prototype.enable = function() {
            var $inputs = this.config.placeholder.find('input');
            $inputs.map(function(index) {
                $inputs.eq(index).prop('disabled', false).css('cursor', 'pointer');
            });
        };

        // 设置正在上传的状态
        h5Uploader.prototype.setState = function(flag) {
            if (flag) {
                this.config.placeholder.addClass('gLibsUploading');
                this.config.placeholder.find('input[type=file]').attr('disabled', true);
            } else {
                this.config.placeholder.removeClass('gLibsUploading');
                this.config.placeholder.find('input[type=file]').attr('disabled', false);
            }
        };

        // extend jquery
        $.fn.h5Uploader = function(cfg) {
            cfg.placeholder = this;
            return new h5Uploader(cfg);
        };

        return h5Uploader;
    })();
    window.H5Uploader = H5Uploader;
})();
