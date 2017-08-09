var AJAX_CFG = {

	//'baseurl':'http://118.178.134.104:8081'
	 baseurl:''
};

(function(cfg){

	var _ajax = {} , token = null , operations = {};

	_ajax.init = function(){

		token = store.get('token');

		operations = JSON.parse(store.get('operateToken'))||operations;

		console.log('ajax init...');
	}
	_ajax.setupAuth = function(){

	}
	_ajax.send = function(url,method,data,callback){

		var option = {
			'data':null,
			'dataType':'json',
			'contentType':'application/json'
		};

		if(data && typeof data == 'object' && (data.dataType||data.contentType||data.data) ){

			for(var key in data){

				option[key] = data[key];
			}

		}else{

			option.data = data;
		}

		var cmd = url.split('?')[0];

		var api = Interface[cmd]||null , apiKey;

		if(data && data.apiKey){

			apiKey = data.apiKey;

		}else{

			if(api && api.operation && api.operation[0]){

				apiKey = api.operation[0];

			}else{

				apiKey = null;
			}
		}

		console.log('ajax url : '+cfg.baseurl+url);

		$.ajax({
            type:method,
            url:cfg.baseurl+url,
            contentType:option.contentType,
            dataType:option.dataType,
            data:option.data,
            beforeSend: function(request) {

                request.setRequestHeader('X-Access-Token', token);

                if(apiKey && operations[apiKey]){

                	request.setRequestHeader('X-Operation-Token',apiKey+':'+operations[apiKey]);

                }else{
                    console.log('request.setRequestHeader')
                	request.setRequestHeader('X-Operation-Token','');
                }

            },
            success:function(data){

            	if(typeof callback == 'function'){

            		callback(null,data);
            	}
            },
            error:function(err){

            	var errinfo = null;

            	console.log(err.status,'asdfasdf');

            	// if(err.status == 401){
                //
            	// 	window.location.href = "login.html";
            	// }

            	if(err.responseText){

            		errinfo = JSON.parse(err.responseText);

            		console.error('接口请求错误 : '+errinfo.path);

            		console.error('接口错误信息 : '+errinfo.message);
            	}

            	if(typeof callback == 'function'){

            		callback(errinfo||err,null);
            	}
            }
        });
	}

	_ajax.init();

	var Ajax = {},_methods = ['get','post','put','delete'];

	for(var i=0;i<_methods.length;i++){

		Ajax[_methods[i]] = (function(method){

			return function(url,data,callback){

				_ajax.send(url,method,data,callback);
			}

		})(_methods[i]);
	}

	Ajax.call = function(alias,method,data,callback){

		var api = null , url;

		for(url in Interface){

			if(Interface[url]['alias'] == alias){

				api = Interface[url];

				break;
			}
		}

		_ajax.send(url,method,data,callback);
	}

	window.Ajax = Ajax;

})(AJAX_CFG);



