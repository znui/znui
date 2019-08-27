module.exports = zn.Class({
    statics: {
        create: function (application) {
            return new this.prototype.constructor(application);
        }
    },
    properties:{
        application: {
            readonly: true,
            get: function (){
                return this._application;
            }
        }
    },
    methods: {
        init: function (application){
            this._application = application;
        },
        fixRelativePath: function (path){
            var _basePath = this._basePath || '';
            if(path.indexOf(_basePath)==-1){
                path = _basePath + path;
            }

            return path;
        },
        relativeURL: function (path, argv){
            var _argv = zn.querystring.stringify(argv);
            return '#' + this.fixRelativePath(path) + (_argv?('?'+_argv):'');
        },
        relativeJump: function (path, search, overwrite){
            return this.jump(this.fixRelativePath(path), search, overwrite);
        },
        jump: function (path, search, overwrite){
            var _search = zn.extend({}, search);
            if(!overwrite){
                zn.overwrite(_search, this._globalSearch);
            }
            if(!search){
                this._search = {};
            }
            this._search = zn.overwrite(_search, this._search);
            var _querystring = zn.querystring.stringify(this._search);

            location.hash = path + (_querystring ? '?' + _querystring : '');

            return this;
    	},
        back: function (){
            return window.history.back(), this;
        },
        setGlobalSearch: function (value){
            return this._globalSearch = value, this;
        },
        setHome: function (value){
            return this._home = value, this;
        },
        setMain: function (value){
            return this._main = value, this;
        },
        setBasePath: function (value){
            return this._basePath = value, this;
        },
        fixPath: function (path){
            return (this._basePath || '') + (path || '');
        },
        isPath: function (value){
            return window.location.hash.split('?')[0] === '#' + this.fixPath(value);
        },
        containPath: function (value){
            return window.location.hash.split('?')[0].indexOf('#' + this.fixPath(value)) !== -1;
        },
        doHome: function (){
            if(this._home){
                location.hash = this._home;
            }

            return this;
        },
        doMain: function (data){
            if(this._main){
                if(data){
                    this.clear().set(data);
                }
                location.hash = this.fixRelativePath(this._main);
            }

            return this;
        },
        getPath: function (){
            return location.hash.slice(1);
        },
        clear: function (){
            return this.getEngine().clear(), this;
        },
        reset: function (){
            return this.clear(), this;
        },
        setEngine: function (engine){
            return this._engine = engine, this;
        },
        getEngine: function (){
            var _engine = this._engine || 'sessionStorage';   // Cookie, sessionStorage, localStorage
            if(_engine&&typeof _engine == 'string'){
                _engine = window[_engine];
            }

            return _engine;
        },
        setKey: function (key){
            return this._key = key, this;
        },
        getKey: function (){
            return this._key || 'WEB_LOGIN_SESSION';
        },
        setKeyValue: function (key, value, timeout){
            var _value = (typeof value=='object') ? JSON.stringify(value) : value;
            return this.getEngine().setItem(key, _value, timeout), this;
        },
        getKeyValue: function (key){
            return this.getEngine().getItem(key);
        },
        removeKeyValue: function (key){
            return this.getEngine().removeItem(key), this;
        },
        jsonKeyValue: function (value){
            var _value = this.getKeyValue(value);
            if(_value){
                try {
                    _value = JSON.parse(_value);
                }catch(e){
                    _value = {};
                    console.log(e.stack);
                }
            }

            return _value;
        },
        set: function (value, timeout) {
            return this.setKeyValue(this.getKey(), value, timeout);
        },
        get: function () {
            return this.getKeyValue(this.getKey());
        },
        json: function (name){
            var _value = this.get();
            if(_value){
                try {
                    _value = JSON.parse(_value);
                }catch(e){
                    _value = null;
                    console.log(e.stack);
                }
            }

            return _value;
        },
        validate: function (){
            if(this.json()){
                return true;
            }else {
                return this.doHome(), false;
            }
        }
    }
});
