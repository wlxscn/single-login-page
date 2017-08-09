var RunEnv = 'dev';

if(!console){

	console = {

		log:function(){

			if(RunEnv == 'pro'){

				return;
			}

			alert(arguments[0]);
		}
	};
};

var bind = function(func,scope){

	return function(){

		return func.apply(scope,arguments);
	}
};


/*
	本地存储封装，还未完善，需加入IE低版本不兼容localStorage时cookie替代方案
*/
(function(){

	var store = {};

	if(window.localStorage){

		store.set = function(key , val){
			localStorage.setItem(key, val);
		}

		store.get = function(key){

			var saveval = localStorage.getItem(key);

			saveval = saveval?saveval:null;

			return saveval;
		}
	}

	window.store = store;
})();


/*
	页面组件基类
*/
(function(){

	var widget = function(attribute){

		this.name = '';

		this.data = {};

		this.tplname = null;

		this.methods = {};

		this.create = function(){};

		this.mounted = function(){};

		this.destory = function(){};

		this._init = function(option){

			for(var key in option){

				this[key] = option[key];
			}

			var self = this;

			for(var fname in self.methods){

				if(self[fname]){

					console.error('[widget] : ' + self.name + ' 方法定义重复！');

				}else{

					self[fname] = bind(self.methods[fname],self);

					self.methods[fname] = self[fname];
				}
			}
		};

		this._event = function(){

			var self = this;

			this.$dom.find('[v-click]').each(function(idx,dom){

				dom = $(dom);

				var fun_name = dom.attr('v-click');

				$(dom).on('click',self.methods[fun_name]);
			});

			this.$dom.find('[v-mode]').each(function(idx,dom){

				dom = $(dom);

				var mode_name = dom.attr('v-mode');

				$(dom).on('input propertychange',function(){

					self.data[mode_name] = this.value;
				});
			});
		};

		this._render = function(){

			var self = this;

			if(document.readyState!='complete'){

				$(document).ready(function(){

					self.$dom = $('[v-templete='+self.tplname+']');

					self._event();

					self.mounted();
				});

			}else{

				self.$dom = $('[v-templete='+self.tplname+']');

				this._event();

				this.mounted();
			}
		}

		this._init(attribute);

		this.create();

		this._render();
	}

	var widgetbuilder = function(option){

		return new widget(option);
	}

	window.widget = widgetbuilder;
})();






(function(){
	/**
	##	查找一个对象类型的数据中，符合查询条件的对象
	##	@param : [type:object] 查询条件
	##	@return : 如果存在则返回最近的一个匹配对象，不存在则返回null
	*/
	Array.prototype.findObjectItem = function(param){

		var i , key , hashflag;

		for(i=0;i<this.length;i++){

			hashflag = true;

			for(key in param){

				if(param[key] != this[i][key]){

					hashflag = false;

					break;
				}
			}

			if(hashflag){

				return this[i];
			}
		}

		return null;
	}
})();
