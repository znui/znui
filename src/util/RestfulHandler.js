var Request = zn.Class({
    properties:{
        data: {
            readonly: true,
            get: function (){
                return this._data || {};
            }
        },
        path: {
            readonly: true,
            get: function (){
                return this._path || '';
            }
        },
        search: {
            readonly: true,
            get: function (){
                return this._search || {};
            }
        },
        notFound: true
    },
    methods: {
        init: function (argv){
            this.sets(argv);
            this.reset();
        },
        reset: function (){
            var _meta = location.hash.split('?');
            this._path = _meta[0].slice(1);
            this._paths = this._path.split('/');
            this._search = this._data = _meta[1]?zn.querystring.parse(_meta[1]):{};
        },
        get: function (value){
            return value ? this._data[value] : this._data;
        },
        parseRouterParameter: function (router){
            var _data = {},
                _key = null,
                _value = null,
                _paths = this._paths;
            router.split('/').forEach(function (temp, index){
                if (/^:\w[\w\d]*$/.test(temp)) {
                    _key = temp.replace(/^:/, '');
                    _value = _paths[index];
                    _data[_key] = _value;
                }
            });

            return _data;
        },
        extend: function (value){
            if(value){
                zn.extend(this._data, value);
            }

            return this;
        },
        test: function (router){
            if (typeof router != 'string') {
                return false;
            }
            var __all = Boolean(router == '*');  //
            var _reg = router.replace(/\/:\w[^\/]+/g, '\/([^\/]+)');
            _reg = _reg.replace(/\//g, '\\/');
            if(router.slice(-3)=='{*}'){
                _reg = '^#' + _reg.slice(0, -3); // + '$';
            } else {
                _reg = '^#' + _reg + '$';
            }

            var __reg = Boolean(new RegExp(_reg).test('#' + this._path));
            var __index = Boolean(this._path == '' && router == '/');
            return Boolean(__all || __reg || __index);
        }
    }
});


module.exports = zn.Class({
    events: ['change'],
    methods: {
        init: function (routers){
            this._controllers = [];
            this._errors = [];
            window.addEventListener('hashchange', this.__onHashChange.bind(this), false);
        },
        fireHashChange: function (){
            this.__onHashChange();
        },
        __onHashChange: function (){
            var _req = new Request(),
                _len = this._controllers.length,
                _controller = null;
            for(var i = 0; i < _len; i++){
                _controller = this._controllers[i];
                if(_req.test(_controller.router)){
                    _req.notFound = false;
                    _req.extend(_req.parseRouterParameter(_controller.router));
                    _controller.handler.call(_controller.context, _req);
                    break;
                }
            }
            _req.notFound && this._errors.forEach(function (controller, index){
                controller.handler.call(controller.context, _req);
            });

            this.fire('change', _req);
        },
        error: function (handler, context){
            return this._errors.push({
                handler: handler,
                context: context
            }), this;
        },
        use: function (handler, context){
            return this._controllers.push({
                router: '*',
                handler: handler,
                context: context
            }), this;
        },
        get: function (router, handler, context){
            return this._controllers.push({
                router: router,
                handler: handler,
                context: context
            }), this;
        }
    }
});
