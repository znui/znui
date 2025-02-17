if(!window.zn) {
    require("@zeanium/core");
    require("@zeanium/web");
}
module.exports = window.znui = {
    downloadExcelFromXHRResponse: function (filename, response){
        var _aTag = document.createElement('a');
        _aTag.href = URL.createObjectURL(new Blob([response], { 
            type: 'text/xlsx' 
        }));
        _aTag.download = filename;
        _aTag.click();
    },
    downloadExcelFromXHR: function (url, filename, data){
        var xhr = new XMLHttpRequest();
		xhr.open("post", url, true);
		xhr.responseType = 'blob';
		xhr.withCredentials = true;
		xhr.setRequestHeader("Content-Type", "application/json");
		xhr.onreadystatechange = function () {
			if (xhr.readyState === 4 && xhr.status === 200) {
				var _aTag = document.createElement('a');
				_aTag.href = URL.createObjectURL(new Blob([xhr.response], { 
                    type: 'text/xlsx' 
                }));
				_aTag.download = filename;
				_aTag.click();
			}
		};
        xhr.addEventListener('progress', function (){

        });
		xhr.send(JSON.stringify(data || {}));
    },
    downloadExcelFromXMLHttpRequest: function (args){
        var _args = zn.extend({
            method: 'post',
            headers: { }
        }, args);
        _args.headers["Content-Type"] = _args.headers["Content-Type"] || "application/json";

        var xhr = new XMLHttpRequest();
        console.log(_args.url);
		xhr.open(_args.method || "post", _args.url, true);
		xhr.responseType = 'blob';
		xhr.withCredentials = true;
        for(var key in _args.headers) {
            xhr.setRequestHeader(key, _args.headers[key]);
        }
		xhr.onreadystatechange = function () {
			if (xhr.readyState === 4 && xhr.status === 200) {
                var _response = xhr.response, _type = _response.type;
                if(_type == 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
                    var _aTag = document.createElement('a');
                    _aTag.href = URL.createObjectURL(new Blob([xhr.response], { 
                        type: 'text/xlsx' 
                    }));
                    _aTag.download = (_args.filename || 'excel') + '.xlsx';
                    _aTag.click();
                }else{
                    var _fileReader = new FileReader();
                    _fileReader.onload = function() {
                        var _result = _fileReader.result;
                        if(_type == 'application/json') {
                            _result = JSON.parse(_result);
                            _result = _result.detail
                        }
                        alert(_result);
                    }
                    _fileReader.readAsText(_response);
                }
			}
		};

        if(_args.loadstart) {
            xhr.addEventListener('loadstart', _args.loadstart);
        }
        if(_args.load) {
            xhr.addEventListener('load', _args.load);
        }
        if(_args.loadend) {
            xhr.addEventListener('loadend', _args.loadend);
        }
        if(_args.progress) {
            xhr.addEventListener('progress', _args.progress);
        }
        if(_args.error) {
            xhr.addEventListener('error', _args.error);
        }
        if(_args.abort) {
            xhr.addEventListener('abort', _args.abort);
        }
        
		xhr.send(JSON.stringify(_args.data || {}));
    },
    downloadDataURL: function (dataURL, filename){
        var blob = this.dataURLToBlob(dataURL);
        var url = window.URL.createObjectURL(blob);

        this.downloadURL(url, filename);
    },
    downloadURL: function (url, filename){
        var aTag = document.createElement("a");
        if(!('download' in aTag)){
            console.error('浏览器不支持a标签文件下载！');
        }
        aTag.style.display = "none";
        aTag.href = url;
        if(filename){
            aTag.download = filename;
        }
        zn.info('znui.downloadURL: ', url, filename);
        document.body.appendChild(aTag);
        aTag.click();
        document.body.removeChild(aTag);
        window.URL.revokeObjectURL(url);
    },
    imageToCanvas: function (imgObject, maxWidth, maxHeight){
        if(!imgObject) return;
        var _originWidth = imgObject.width || imgObject.naturalWidth,
            _originHeight = imgObject.height || imgObject.naturalHeight,
            _targetWidth = _originWidth,
            _targetHeight = _originHeight;
        
        if(_originWidth > maxWidth || _originHeight > maxHeight) {
            if (_originWidth / _originHeight > maxWidth / maxHeight) {
                _targetWidth = maxWidth;
                _targetHeight = Math.round(maxWidth * (_originHeight / _originWidth));
            } else {
                _targetHeight = maxHeight;
                _targetWidth = Math.round(maxHeight * (_originWidth / _originHeight));
            }
        }

        var canvas = document.createElement('canvas');
        var context = canvas.getContext('2d');
        canvas.width = _targetWidth;
        canvas.height = _targetHeight;
        context.clearRect(0, 0, _targetWidth, _targetHeight);
        context.drawImage(imgObject, 0, 0, _targetWidth, _targetHeight);
        return canvas;
    },
    resizeImageToDataURL: function (imgObject, maxWidth, maxHeight, type, quality){
        var _canvas = this.imageToCanvas(imgObject, maxWidth, maxHeight);
        if(!_canvas) return;
        var _type = type || 'png';
        _type = _type == 'jpg' ? 'jpeg' : _type;
        return _canvas.toDataURL("image/" + _type, quality || 1);
    },
    downloadDataURL: function (dataURL, filename){
        if(!dataURL) return;
        var aTag = document.createElement('a');
        if(!('download' in aTag)){
            console.error('浏览器不支持a标签文件下载！');
        }
        aTag.style.display = 'none';
        if(filename){
            aTag.download = filename;
        }

        aTag.href = dataURL;
        document.body.appendChild(aTag);
        aTag.click();
        document.body.removeChild(aTag);
    },
    downloadImageDom: function (imgObject, filename, imageType, maxWidth, maxHeight, quality){
        if(!imgObject) return;
        var aTag = document.createElement('a');
        if(!('download' in aTag)){
            console.error('浏览器不支持a标签文件下载！');
        }
        aTag.style.display = 'none';
        imageType = imageType || 'png';
        if(filename){
            aTag.download = filename;
        }
        var _canvas = this.imageToCanvas(imgObject, maxWidth, maxHeight);
        if(!_canvas) return;
        aTag.href = _canvas.toDataURL('image/' + imageType, quality || 1);
        document.body.appendChild(aTag);
        aTag.click();
        document.body.removeChild(aTag);
    },
    downloadStringAsFile: function (stringContent, filename, options){
        var aTag = document.createElement('a');
        aTag.style.display = 'none';
        if(filename){
            aTag.download = filename;
        }
        aTag.href = URL.createObjectURL(new Blob([stringContent], options));
        document.body.appendChild(aTag);
        aTag.click();
        document.body.removeChild(aTag);
    },
    dataURLToBlobByType: function (dataURL, type){
        var _binStr = window.atob(dataURL.split(',')[1]),
            _size = _binStr.length,
            _ary = new Uint8Array(_size);

        for (var i=0; i<len; i++ ) {
            _ary[i] = _binStr.charCodeAt(i);
        }

        return new Blob([_ary], { type: type || 'image/png' });
    },
    dataURLToBlob: function (dataURL) {
        // Code taken from https://github.com/ebidel/filer.js
        var parts = dataURL.split(';base64,');
        var contentType = parts[0].split(":")[1];
        var raw = window.atob(parts[1]);
        var rawLength = raw.length;
        var uInt8Array = new Uint8Array(rawLength);

        for (var i = 0; i < rawLength; ++i) {
            uInt8Array[i] = raw.charCodeAt(i);
        }

        return new Blob([uInt8Array], { type: contentType });
    },
    copyToClipboard: function (value, callback){
        var _tempInput = document.createElement('input');
        _tempInput.value = value;
        _tempInput.style.width = '0px !important';
        _tempInput.style.height = '0px !important';
        document.body.appendChild(_tempInput);
        _tempInput.select();
        document.execCommand("Copy");
        document.body.removeChild(_tempInput);
        callback && callback();
	},
    isWeChatClient: function () {
        var _ua = window.navigator.userAgent.toLowerCase();
        //mozilla/5.0 (iphone; cpu iphone os 9_1 like mac os x) applewebkit/601.1.46 (khtml, like gecko)version/9.0 mobile/13b143 safari/601.1
        if (_ua.match(/MicroMessenger/i) == 'micromessenger') {
            return true;
        } else {
            return false;
        }
    },
    isAndroid: function (){
        return navigator.userAgent.indexOf('Android') > -1 || navigator.userAgent.indexOf('Adr') > -1;
    },
    isIOS: function (){
        return !!navigator.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
    },
    isSafari: function (){
        return (/Safari/.test(navigator.userAgent) && !/Chrome/.test(navigator.userAgent));
    },
    isMobile: function (){
        if(/AppleWebKit.*Mobile/i.test(navigator.userAgent) || (/MIDP|SymbianOS|NOKIA|SAMSUNG|LG|NEC|TCL|Alcatel|BIRD|DBTEL|Dopod|PHILIPS|HAIER|LENOVO|MOT-|Nokia|SonyEricsson|SIE-|Amoi|ZTE/.test(navigator.userAgent))){
			try{
				if(/Android|webOS|iPhone|iPod|BlackBerry/i.test(navigator.userAgent)){
					return true;
				}else if(/iPad/i.test(navigator.userAgent)){
                    return true;
				}else{
					return true;
				}
			}catch(e){
                return false;
			}
		}else {
			return false;
		}
    },
    checkTime: function (beginTime, endTime){
        var _begin = (new Date(beginTime.replace(/-/g, '/'))).getTime(),
			_end = (new Date(endTime.replace(/-/g, '/'))).getTime(),
			_now = (new Date()).getTime();
		if(_begin < _now && _end > _now){
			return 0;
		}

		if(_begin>_now){
			return -1;
		}else {
			return 1;
		}
    },
    extendPath: function (path, views){
        var _views = {};
        switch(zn.type(views)){
            case 'object':
                for(var key in views){
                    _views[path+key] = views[key];
                }
                break;
            case 'array':
                for(var _temp of views){
                    _views = zn.extend(_views, this.extendPath(path, _temp));
                }
                break;
        }

        return _views;
    },
    loadPaths: function (paths, handler, ifDeep){
        var _exports = {},
            _temp = null;
        for(var key in paths) {
            _temp = handler&&handler(paths[key]);
            _exports[key] =_temp;
            if(ifDeep && zn.is(_temp, 'object')){
                for(var _tkey in _temp){
                    _exports[_tkey] = _temp[_tkey];
                }
            }
        }

        return _exports;
    },
    findTarget: function (target, options){
        if(!target){ return; }
        var _options = options || {};
        for(var key in _options){
            if(target[key] !== _options[key]){
                return this.findTarget(target.parentNode, options);
            }
        }

        return target;
    },
    exports: function (config, handler){

    },
    classname: function (){
        var _items = [];
        Array.prototype.slice.call(arguments).forEach(function (item, index){
            if(item){
                switch (window.zn.type(item)) {
                    case 'string':
                        _items.push(item);
                        break;
                    case 'function':
                        _items.push(item.call(null)||'');
                        break;
                }
            }
        });

        return _items.join(' ');
    },
    style: function (){
        var _styles = [];
        Array.prototype.slice.call(arguments).forEach(function (item, index){
            if(item){
                switch (window.zn.type(item)) {
                    case 'string':
                        _styles.push(item);
                        break;
                    case 'object':
                        for(var key in item){
                            _styles.push(key + ':' + item[key]);
                        }
                        break;
                    case 'array':
                        _styles.concat(this.style.apply(this, item));
                        break;
                    case 'function':
                        _styles.concat(item.call(null)||'');
                        break;
                }
            }
        }.bind(this));

        return _styles.join('; ');
    }
};