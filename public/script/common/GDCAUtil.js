var base64EncodeChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
var base64DecodeChars = new Array(
    -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
    -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
    -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 62, -1, -1, -1, 63,
    52, 53, 54, 55, 56, 57, 58, 59, 60, 61, -1, -1, -1, -1, -1, -1,
    -1,  0,  1,  2,  3,  4,  5,  6,  7,  8,  9, 10, 11, 12, 13, 14,
    15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, -1, -1, -1, -1, -1,
    -1, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40,
    41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, -1, -1, -1, -1, -1);

function base64encode(str) {
    var out, i, len;
    var c1, c2, c3;

    len = str.length;
    i = 0;
    out = "";
    while(i < len) {
    c1 = str.charCodeAt(i++) & 0xff;
    if(i == len)
    {
        out += base64EncodeChars.charAt(c1 >> 2);
        out += base64EncodeChars.charAt((c1 & 0x3) << 4);
        out += "==";
        break;
    }
    c2 = str.charCodeAt(i++);
    if(i == len)
    {
        out += base64EncodeChars.charAt(c1 >> 2);
        out += base64EncodeChars.charAt(((c1 & 0x3)<< 4) | ((c2 & 0xF0) >> 4));
        out += base64EncodeChars.charAt((c2 & 0xF) << 2);
        out += "=";
        break;
    }
    c3 = str.charCodeAt(i++);
    out += base64EncodeChars.charAt(c1 >> 2);
    out += base64EncodeChars.charAt(((c1 & 0x3)<< 4) | ((c2 & 0xF0) >> 4));
    out += base64EncodeChars.charAt(((c2 & 0xF) << 2) | ((c3 & 0xC0) >>6));
    out += base64EncodeChars.charAt(c3 & 0x3F);
    }
    return out;
}

function base64decode(str) {
    var c1, c2, c3, c4;
    var i, len, out;

    len = str.length;
    i = 0;
    out = "";
    while(i < len) {
    /* c1 */
    do {
        c1 = base64DecodeChars[str.charCodeAt(i++) & 0xff];
    } while(i < len && c1 == -1);
    if(c1 == -1)
        break;

    /* c2 */
    do {
        c2 = base64DecodeChars[str.charCodeAt(i++) & 0xff];
    } while(i < len && c2 == -1);
    if(c2 == -1)
        break;

    out += String.fromCharCode((c1 << 2) | ((c2 & 0x30) >> 4));

    /* c3 */
    do {
        c3 = str.charCodeAt(i++) & 0xff;
        if(c3 == 61)
        return out;
        c3 = base64DecodeChars[c3];
    } while(i < len && c3 == -1);
    if(c3 == -1)
        break;

    out += String.fromCharCode(((c2 & 0XF) << 4) | ((c3 & 0x3C) >> 2));

    /* c4 */
    do {
        c4 = str.charCodeAt(i++) & 0xff;
        if(c4 == 61)
        return out;
        c4 = base64DecodeChars[c4];
    } while(i < len && c4 == -1);
    if(c4 == -1)
        break;
    out += String.fromCharCode(((c3 & 0x03) << 6) | c4);
    }
    return out;
}

function utf16to8(str) {
    var out, i, len, c;

    out = "";
    len = str.length;
    for(i = 0; i < len; i++) {
    c = str.charCodeAt(i);
    if ((c >= 0x0001) && (c <= 0x007F)) {
        out += str.charAt(i);
    } else if (c > 0x07FF) {
        out += String.fromCharCode(0xE0 | ((c >> 12) & 0x0F));
        out += String.fromCharCode(0x80 | ((c >>  6) & 0x3F));
        out += String.fromCharCode(0x80 | ((c >>  0) & 0x3F));
    } else {
        out += String.fromCharCode(0xC0 | ((c >>  6) & 0x1F));
        out += String.fromCharCode(0x80 | ((c >>  0) & 0x3F));
    }
    }
    return out;
}

function utf8to16(str) {
    var out, i, len, c;
    var char2, char3;

    out = "";
    len = str.length;
    i = 0;
    while(i < len) {
    c = str.charCodeAt(i++);
    switch(c >> 4)
    { 
      case 0: case 1: case 2: case 3: case 4: case 5: case 6: case 7:
        // 0xxxxxxx
        out += str.charAt(i-1);
        break;
      case 12: case 13:
        // 110x xxxx   10xx xxxx
        char2 = str.charCodeAt(i++);
        out += String.fromCharCode(((c & 0x1F) << 6) | (char2 & 0x3F));
        break;
      case 14:
        // 1110 xxxx  10xx xxxx  10xx xxxx
        char2 = str.charCodeAt(i++);
        char3 = str.charCodeAt(i++);
        out += String.fromCharCode(((c & 0x0F) << 12) |
                       ((char2 & 0x3F) << 6) |
                       ((char3 & 0x3F) << 0));
        break;
    }
    }

    return out;
}

function CharToHex(str) {
    var out, i, len, c, h;

    out = "";
    len = str.length;
    i = 0;
    while(i < len) 
    {
        c = str.charCodeAt(i++);
        h = c.toString(16);
        if(h.length < 2)
            h = "0" + h;
        
        out += "\\x" + h + " ";
        if(i > 0 && i % 8 == 0)
            out += "\r\n";
    }

    return out;
}

/******************************************************************************************
 * 函数名称：getData2
 * 创建作者：张汉瑞   
 * 创建日期：2014.05.13   
 * 函数功能：收集组合页面上的数据元素
 * 输入参数：
 * 输出参数：     
 * 修改记录：
 ******************************************************************************************/
function getData2(formId) {

	var form = document.getElementById(formId);
	var allStr = "";
	if (form) {
		var elementsObj = form.elements;
		var obj;
		if (elementsObj) {
			
			for ( var i = 0; i < elementsObj.length; i += 1) {
				obj = elementsObj[i];
				if (obj.name != undefined && obj.name != "") {
					 allStr+="<"+obj.name+">"+obj.value+ "</"+obj.name+">";
				}
			}
		} else {
			alert("没有elements对象!");
			return;
		}
	} else {
		alert("form不存在!");
		return;
	}
	return allStr;

}

/****************************************************************************************
 * 函数名称：getCookie
 * 创建作者：    
 * 创建日期：
 * 函数功能：客户端从cookie中得到服务方的信息
 * 输入参数：name    cookie中标识名
 * 输出参数：rvalue  得到标识名对应的值
 *****************************************************************************************/
function getCookie(name) {
	//alert("cookies");
	var cookies = document.cookie;
	var start = -1;
	var end = -1;
	var rvalue = null;
	if (cookies.length > 0) {
		start = cookies.indexOf(name);
		if (start != -1) {
			start += name.length + 1;
			end = cookies.indexOf(";", start);
			if (end == -1) {
				end = cookies.length;
			}
			rvalue = cookies.substring(start, end);
		}
	}

	rvalue = replaceChars(rvalue, "%0D", "\r");
	rvalue = replaceChars(rvalue, "%0A", "\n");
	rvalue = replaceChars(rvalue, "%2F", "/");
	rvalue = replaceChars(rvalue, "%2B", "+");
	rvalue = replaceChars(rvalue, "%3D", "=");
	var reg = new RegExp('"', "g");
	rvalue = rvalue.replace(reg, "");
	return rvalue;
}

/*************************************************************************************
 * 函数名称：replaceChars()
 * 创建作者：    
 * 创建日期：
 * 函数功能：替换字符串中的相应字符串
 * 输入参数：entry      源字符串
 *         orgStr     要被替换的字符串
 *         replaceStr 替换的字符串
 * 输出参数：temp       替换后的字符串
 **************************************************************************************/
function replaceChars(entry, orgStr, replaceStr) {
	temp = "" + entry;
	while (temp.indexOf(orgStr) > -1) {
		pos = temp.indexOf(orgStr);
		temp = ""
				+ (temp.substring(0, pos) + replaceStr + temp.substring(
						(pos + orgStr.length), temp.length));
	}

	return temp;
}


/******************************************************************************************
* 函数名称：getXML
* 创建作者：    
* 创建日期：   
* 函数功能：分离xml串中的数据  
* 输入参数：sourceData  要分离的源字符串
*         serchname   分离的tag标签名
* 输出参数：分离后的字符串
* 修改记录：
******************************************************************************************/
function getXML(sourceData,serchname)
{
	//var serchname="name";
	//var sourceData="<name>dfdfd</name><old>27</old><sex>nan</sex><add>ddddd</add><com>cccc</com>";
	var startStr="<"+serchname+">";
	var endStr="</"+serchname+">";
	
	var start=sourceData.indexOf(startStr);
	if(start<0)
	{
		alert("get xml Start flag "+startStr+" Data error!!!");
		return "";
	}
	var end=sourceData.indexOf(endStr);
	if(end<0)
	{
		alert("get xml End flag "+endStr+" Data error!!!");
		return "";
	}
	var outData=sourceData.substring(start+startStr.length,end);
	/*
	if(outData.length==0)
	{
		alert("get xml string Data error!!!");
		return "";
	}
	*/
	//alert(outData);
	return outData;
}
