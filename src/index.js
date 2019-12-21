require("@zeanium/core");
require("@zeanium/web");
module.exports = zn.GLOBAL.znui = {
    downloadDataURL: function (dataURL, filename){
        var blob = this.dataURLToBlob(dataURL);
        var url = window.URL.createObjectURL(blob);

        this.downloadURL(url, filename);
    },
    downloadURL: function (url, filename){
        var a = document.createElement("a");
        a.style = "display: none";
        a.href = url;
        if(filename){
            a.download = filename;
        }

        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
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
    isAndroid: function (){
        return navigator.userAgent.indexOf('Android') > -1 || navigator.userAgent.indexOf('Adr') > -1;
    },
    isIOS: function (){
        return !!navigator.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
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
        for(var key in views){
            _views[path+key] = views[key];
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
        zn.each(Array.prototype.slice.call(arguments), function (item, index){
            if(item){
                switch (zn.type(item)) {
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
        zn.each(Array.prototype.slice.call(arguments), function (item, index){
            if(item){
                switch (zn.type(item)) {
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