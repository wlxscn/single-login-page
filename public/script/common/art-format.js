
if(template){

	template.defaults.imports.moneyFormat = function(value,len){

		len = len!=undefined?len:2;

		return '￥'+parseFloat(value).toFixed(2);
	}
	template.defaults.imports.intFormat = function(value){

		return parseInt(value);
	}
	template.defaults.imports.taxRateFormat = function(value){

		if(value.length>0){

			var newvalues = [];

			for(var i in value){

				newvalues[i] = value[i]+'%';
			}

			return newvalues.join(',');
		}

		return '';
	}

	template.defaults.imports.dateFormat = function(value){

		var datearr = [];

		datearr.push(value.substr(0,4));

		datearr.push(value.substr(4,2));

		if(value.length>=8){

			datearr.push(value.substr(6,2));
		}

		return datearr.join('.');
	}
	template.defaults.imports.timeFormat = function(value){

		var datearr = [];

		if(value.length>=14){

			datearr.push(value.substr(8,2));

			datearr.push(value.substr(10,2));

			datearr.push(value.substr(12,2));
		}

		return datearr.join('：');
	}
	template.defaults.imports.removeUndefined = function(value){
         if(!value) {
			 return '';
		 }
	}
}