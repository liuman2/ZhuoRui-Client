define([
  'jquery',
  'dbApp',
  'common',
  'h5Upload',
  'wysiwyg',
  'hotkeys'], function($, db, common, H5Uploader) {

  var template_toolbar = '<div class="editor-toolbar btn-toolbar" id="exercise-content-toolbar" data-role="editor-toolbar" data-target="#exercise-content">' +
    // font family
    '<div class="btn-group dropdown">' +
    '<a class="btn btn-default dropdown-toggle" data-toggle="dropdown" title="Font Family"><i class="fa fa-font"></i>&nbsp;<span class="caret"></span ></a>' +
    '<ul class="dropdown-menu">' +
    '<li><a data-edit="fontName SimSun"><font face="SimSun">宋体</font></a></li>' +
    '<li><a data-edit="fontName SimHei"><font face="SimHei">黑体</font></a></li>' +
    '</ul>' +
    '</div>' +
    // font size
    '<div class="btn-group dropdown">' +
    '<a class="btn btn-default dropdown-toggle" data-toggle="dropdown" title="Font Size"><i class="fa fa-text-height"></i>&nbsp;<span class="caret"></span ></a>' +
    '<ul class="dropdown-menu">' +
    '<li><a data-edit="fontSize 3"><font size="3">正文</font></a></li>' +
    '<li role="presentation" class="divider"></li>' +
    '<li><a data-edit="fontSize 6"><font size="6">一级标题</font></a></li>' +
    '<li><a data-edit="fontSize 5"><font size="5">二级标题</font></a></li>' +
    '<li><a data-edit="fontSize 4"><font size="4">三级标题</font></a></li>' +
    /*'<li><a data-edit="fontSize 2"><font size="2">2</font></a></li>' +
    '<li><a data-edit="fontSize 1"><font size="1">1</font></a></li>' +*/
    '</ul>' +
    '</div>' +
    // font color
    '<div class="btn-group dropdown font-color">' +
    '<a class="btn btn-default dropdown-toggle" data-toggle="dropdown" title="Font Color"><i class="fa fa-font"></i>&nbsp;<span class="caret"></span ></a>' +
    '<ul class="dropdown-menu">' +
    '<li><a data-edit="foreColor #E33737"><div class="bgc-E33737"></div></a></li>' +
    '<li><a data-edit="foreColor #e28b41"><div class="bgc-e28b41"></div></a></li>' +
    '<li><a data-edit="foreColor #c8a732"><div class="bgc-c8a732"></div></a></li>' +
    '<li><a data-edit="foreColor #209361"><div class="bgc-209361"></div></a></li>' +
    '<li><a data-edit="foreColor #418caf"><div class="bgc-418caf"></div></a></li>' +
    '<li><a data-edit="foreColor #aa8773"><div class="bgc-aa8773"></div></a></li>' +
    '<li><a data-edit="foreColor #999999"><div class="bgc-999999"></div></a></li>' +
    '<li><a data-edit="foreColor #333333"><div class="bgc-333333"></div></a></li>' +
    '</ul>' +
    '</div>' +
    // font style
    '<div class="btn-group">' +
    '<a class="btn btn-default" data-edit="bold" title="Bold (Ctrl/Cmd+B)"><i class="fa fa-bold"></i></a>' +
    '<a class="btn btn-default" data-edit="italic" title="Italic (Ctrl/Cmd+I)"><i class="fa fa-italic"></i></a>' +
    '<a class="btn btn-default" data-edit="strikethrough" title="Strikethrough"><i class="fa fa-strikethrough"></i></a>' +
    '<a class="btn btn-default" data-edit="underline" title="Underline (Ctrl/Cmd+U)"><i class="fa fa-underline"></i></a>' +
    '</div>' +
    '<div class="btn-group">' +
    '<a class="btn btn-default" data-edit="insertunorderedlist" title="Bullet list"><i class="fa fa-list-ul"></i></a>' +
    '<a class="btn btn-default" data-edit="insertorderedlist" title="Number list"><i class="fa fa-list-ol"></i></a>' +
    /*'<a class="btn btn-default" data-edit="outdent" title="Reduce indent (Shift+Tab)"><i class="fa fa-outdent"></i></a>' +
    '<a class="btn btn-default" data-edit="indent" title="Indent (Tab)"><i class="fa fa-indent"></i></a>' +*/
    '</div>' +
    '<div class="btn-group">' +
    '<a class="btn btn-default" data-edit="justifyleft" title="Align Left (Ctrl/Cmd+L)"><i class="fa fa-align-left"></i></a>' +
    '<a class="btn btn-default" data-edit="justifycenter" title="Center (Ctrl/Cmd+E)"><i class="fa fa-align-center"></i></a>' +
    '<a class="btn btn-default" data-edit="justifyright" title="Align Right (Ctrl/Cmd+R)"><i class="fa fa-align-right"></i></a>' +
    '<a class="btn btn-default" data-edit="justifyfull" title="Justify (Ctrl/Cmd+J)"><i class="fa fa-align-justify"></i></a>' +
    '</div>' +
    '<div class="btn-group">' +
    '<a class="btn btn-default js-upload editor-imgupload" title="Insert picture" style="position: relative; overflow: hidden;"><i class="fa fa-picture-o"></i></a>' +
    '</div>' +
    '<div class="btn-group">' +
    '<a class="btn btn-default" data-edit="undo" title="Undo (Ctrl/Cmd+Z)"><i class="fa fa-undo"></i></a>' +
    '<a class="btn btn-default" data-edit="redo" title="Redo (Ctrl/Cmd+Y)"><i class="fa fa-repeat"></i></a>' +
    '<a class="btn btn-default btn-clean" title="清除样式"><i class="fa fa-eraser"></i></a>' +
    '</div>' +

    '<div class="btn-group">' +
    '  <a class="btn btn-default dropdown-toggle" data-toggle="dropdown" title="" data-original-title="Hyperlink"><i class="fa fa-link"></i></a>' +
    '  <div class="dropdown-menu input-append">' +
    '    <input class="span2" placeholder="URL" type="text" data-edit="createLink" id="txtHyperlink" placeholder="需以hppt://或https://开头">' +
    '    <button class="btn" type="button" id="btnHyperlink">确定</button>' +
    '    <div>URL须以hppt://或https://开头</div>' +
    '  </div>' +
    '</div>' +

    '</div>';
  var template_alert = '<span class="msg-box n-right" for="" style="display: none;position: absolute;right: 15px;top: 85px;">' +
    '<span class="msg-wrap n-error" role="alert">' +
    '<span class="n-arrow"><b>◆</b><i>◆</i>' +
    '</span>' +
    '<span class="n-icon"></span>' +
    '<span class="n-msg">不能为空，且内容小于60000字符</span>' +
    '</span>' +
    '</span>';

  // default option
  var options_default = {
    renderTo: null,
    uploadUrl: '',
    alert: {
      maxLength: 1000,
      position: 'bottom'
    }
  };
  var trim = function (str) { return str.replace(/^\s+|\s+$/g, ''); };
  // editor
  var editor = function(options) {
    var id = (new Date()).getTime().toString() + Math.floor(Math.random()*100).toString();
    options = $.extend(true, {}, options_default, options);

    var range, bookmark;
    var saveFocus = function(){//保存焦点状态
        if (document.selection) { //只有坑爹的IE才执行下面的代码
            range = document.selection.createRange();
            bookmark=range.getBookmark();
        }
    }

    // none of renderTo
    if (!options.renderTo) {
      return;
    }

    // wrapper
    var $wrapper = $('<div class="editor"></div>');

    // render to dom
    var $renderTo = $(options.renderTo);
    $renderTo.wrap($wrapper);
    // event for editor
    $renderTo[0].onclick = saveFocus;//在鼠标点击编辑区时保存焦点
    $renderTo[0].onkeydown = saveFocus;//在输入内容时也保存焦点
    // set style
    $renderTo.addClass('editor-content').attr('name', id);

    // add toolbar
    var $toolbar = $(template_toolbar);
    $renderTo.before($toolbar);
    // dropdown
    $toolbar.find('.dropdown-toggle').on('click', function(e) {
      $(this).next('.dropdown-menu').toggleClass('active');
      e.stopPropagation();
    });
    var $dropdown_menu = $toolbar.find('.dropdown-menu');
    $(document).on('click', function() {
      $dropdown_menu.removeClass('active');
    })
    $('input[data-edit="createLink"]').on('click', function(e) {
      e.stopPropagation();
    });

    // $('#btnHyperlink').on('click', function(e) {
    //   var _url = $('#txtHyperlink').val();
    //   if (_url) {
    //     var req = new RegExp('((http|ftp|https)://)([a-zA-Z0-9_-]+\.)');
    //     var _r = reg.test(_url)
    //     if(_r) {
    //       alert(0)
    //       e.stopPropagation();
    //       return false;
    //     }
    //   }
    // })

    // alert
    /*var $alert = $(template_alert);
    $renderTo.after($alert);
    $wrapper.find('.msg-box').attr('for', id).addClass('n-' + options.alert.position);*/

    // set wysiwyg
    var $content = $renderTo;
    $content.wysiwyg();
    // event
    //onchange事件在很多场景会让coder很累，因为在用键盘的“粘贴”，“撤销”，“重做”，“拖拽”，“输入法”，这里有个onpropertychange事件和HTML中的oninput事件很不错：(作者主要是为了做一个兼容的change判断事件)
    function bindChangeHandler(input, fun) {
      if("onpropertychange" in input) {//IE6、7、8，属性为disable时不会被触发
        input.onpropertychange = function() {
          if(window.event.propertyName == "value") {
            if(fun) {
              fun.call(this,window.event);
            }
          }
        }
      } else {
        //IE9+ FF opera11+,该事件用js改变值时不会触发，自动下拉框选值时不会触发
        input.addEventListener("input",fun,false);
      }
    }
    bindChangeHandler($content[0], function() {
      var contentHTML = trim($content.html());
      if(!$content.hasClass('no-clean') && $content.find('*[style]').length > 0 && contentHTML.length > 60000) {
        $content.smoothConfirm('您粘贴的内容带有复杂格式，是否清除格式！', {
          'direction': 'bottom',
          'width': 290,
          'height': 100,
          'okVal': '是',
          'ok': function() {
            $content.removeClass('no-clean');
            $content.html(common.cleanHtmlStyle(contentHTML));
          },
          'cancelVal': '否',
          'cancel': function() { $content.addClass('no-clean'); }
        });
      }
    });
    $toolbar.find('.btn-clean').click(function(e){
      $content.removeClass('no-clean');
      var contentHTML = trim($content.html());
      $content.html(common.cleanHtmlStyle(contentHTML));
    });

    // img
    var $imgupload = $toolbar.find('.editor-imgupload');
    var h5 = new H5Uploader({
      'placeholder': $imgupload,
      'uploadUrl': options.uploadUrl,
      'filePostName': 'file',
      'limitFilesLen': 99999,
      'isSingleMode': true,
      'accept': 'image/*',
      'beforeUpload': (function($content, $imgupload) {
        return function() {
          $imgupload.find('form').hide();
          //var $img = $('<img class="img-loading" src="" />');
          //$content.append($img);
          $content.focus();
          if (range) { //同样，坑爹IE专用代码
              range.moveToBookmark(bookmark);
              range.select();
          }
          document.execCommand('insertImage', false, './img/loading_35x35.gif');
          //document.execCommand('insertimage', false, '');
          $content.find('img').each(function(){
            var $this = $(this);
            if ($this.attr('src') == './img/loading_35x35.gif') {
              $this.addClass('img-loading');//.attr('src', './img/loading_35x35.gif');
            }
          });
        }
      })($content, $imgupload),
      'uploadSuccess': (function($content, $imgupload) {
        return function(idx, data) {
          data = JSON.parse(data);
          var $img = $content.find('.img-loading');
          $img.removeClass('img-loading');
          $img.attr('src', data['filepath']);
          $img.data({
            'storeId': data['fileStoreId'],
            'name': data['filename'],
            'path': data['filepath']
          });
          $imgupload.find('form').show();

        }
      })($content, $imgupload)
    });
  };

  return editor;
});
