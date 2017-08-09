
/*	
	create by : cjsasdf
	create time : 2017/7/20
*/
(function($) {

	var ScrollLoading = function(dom,options){

		var self = this;

		this.$dom = $(dom);

		this.no_more = false;

		this.loading_lock = false;

		this.cfg = $.extend({
			'fireDistence':10,
			'callback':function(){}
		},options);

		this.$dom.on('scroll',function(evt){
			
			if(!self.loading_lock && !self.no_more){
				// console.log(self.$dom.get(0).scrollHeight , self.$dom.get(0).scrollTop , self.$dom.height());
				if(self.$dom.get(0).scrollHeight-self.$dom.get(0).scrollTop-self.$dom.height()<=self.cfg.fireDistence){

					self.loading_lock = true;

					self.cfg.callback();
				}
			}
		});

		this.lock = function () {
			self.loading_lock = true;
		}

		this.unLock = function(){

			self.loading_lock = false;
		}

		this.noMore = function(){

			self.no_more = true;
		}

		this.reset = function(){

			self.no_more = false;

			self.loading_lock = false;
		}
		this.destory = function(){

			var sl = self.$dom.data('scrollloading');

			sl = null;

			self.$dom.data('scrollloading',null);

			self.$dom.unbind('scroll');
		}
	}

  	return $.fn.scrollLoading = function(options) {

  		if(this.data('scrollloading')){

  			var scrollloading = this.data('scrollloading');

  			if(options){

  				scrollloading.cfg = $.extend(scrollloading.cfg,options);
  			}

  			return scrollloading;
  		}

    	var hashsl = new ScrollLoading(this, options);

    	this.data('scrollloading',hashsl);

    	return hashsl;
  	};
})(jQuery);