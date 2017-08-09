window.showDialog = function(param,callback){

	param.dialogid = 'dialog_'+parseInt(Math.random()*10000000);

	if( typeof param.showHead == 'undefined' ) {
		param.showHead = true;
	}

	if( typeof param.showFoot == 'undefined' ) {
		param.showFoot = true;
	}

	var tpl = template('tpl-dialog',param);

	$('body').append(tpl);

	var dialogdom = $('#'+param.dialogid);

	dialogdom.find('.dialog-bg').on('click', function () {
		dialogdom.remove();
	})

	dialogdom.find('.btn-ok').on('click',function(){

		dialogdom.remove();

		callback && callback();
	});

	dialogdom.find('.btn-cancel').on('click',function(){

		dialogdom.remove();
	});

	dialogdom.animate({
		'opacity':1
	},300);

	return dialogdom;
}

window.showMessage = function(param){

	if(typeof param=='string'){

		param = {'message':param};
	}

	param.msgid = 'msg_'+parseInt(Math.random()*10000000);

	param.type = param.type||'';

	var tpl = template('tpl-message',param);

	$('body').append(tpl);

	var msgdom = $('#'+param.msgid),
		current_height = parseInt(msgdom.css('top'));

	msgdom.css('margin-left',-(msgdom.width()/2)+'px');

	msgdom.animate({
		'opacity':1,
		'top':current_height+36+'px'
	});

	setTimeout(function(){

		msgdom.animate({
			'opacity':0,
			'top':current_height+'px'
		},function(){

			msgdom.remove();
		});

	},3000);
}

window.loading = function(selector,action){

	if(action == 'start'){

		var rotation = function (){

		  	$(selector).find('img').rotate({
		    	angle:0,
		    	animateTo:360,
		    	callback: rotation,
		    	easing: function (x,t,b,c,d){
			      	return c*(t/d)+b;
			    }
		  	});
		}

		rotation();

	}else{

		$(selector).find('img').stopRotate();
	}
}

window.loading = function(selector,action){

	if(action == 'start'){

		$(selector).show().animate({'opacity':1});

		var rotation = function (){
			console.log('rotation...');
			$(selector).find('img').stopRotate();

		  	$(selector).find('img').rotate({
		    	angle:0,
		    	animateTo:3600,
		    	duration:10000,
		    	callback: function(){console.log('one round');rotation()},
		    	easing: function (x,t,b,c,d){
			      	return c*(t/d)+b;
			    }
		  	});
		}

		rotation();

	}else{

		$(selector).animate({'opacity':0},function(){

			$(selector).hide().find('img').stopRotate();
		});
	}
}




// (function(){

// 	if(navigator.appName == "Microsoft Internet Explorer" && navigator.appVersion .split(";")[1].replace(/[ ]/g,"")=="MSIE8.0"){

// 		$('body').delegate('input[type="text"]','keyup',function(){
            
// 			if($(this).val()==''){

// 				$(this).val($(this).attr('placeholder'));
// 			}
// 		});
// 	}
// })()