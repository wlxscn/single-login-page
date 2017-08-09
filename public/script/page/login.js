widget({
	name:'login',
	tplname:'tpl-login',
	data:{
		username:'',
		password:''
	},

	methods:{

		'ajax_login':function(){
			
			var data = JSON.stringify({
	        	'username':this.data.username,
	        	'password':this.data.password
	        });

	        Ajax.post('/api-v1/security/login',data,function(err,data){
	        	
	        	if(data && data.code == 1){

	        		store.set('token',data.token);

	        		store.set('operations',data.operations);

	        		console.log('login success -> ',data);

	        		window.location.href="statement_out.html";

					// window.location.href= '/src/invoice_out.html';

	        	}else{

	        		console.log('login faild -> ',data,err);
	        	}
	        });
		},

		'ajax_list':function(){

	        Ajax.call('测试接口一','get',{'userRole':1},function(err,data){

	        	console.log('测试接口一 返回。。。',err,data);
	        });
		}
	},

	mounted:function(){


	}
});