/**
 * User: Saturn
 * Date:
 * GDCA COM多浏览器支持
 */

var browser = navigator.appName;

//需要调用的COM组件classid号
var com_classid = "BFEAA574-D032-49EE-BAB4-D09D0D511D52";    //gdca_sof_com.dll


//判断浏览器类型选择合适的ActiveX控件调用方式
if (browser == "Microsoft Internet Explorer")  //IE浏览器
{
    document.writeln("<OBJECT id=\"GDCACom\" classid=\"CLSID:" + com_classid + "\" style=\"display:none\"></OBJECT>");
}
else if (browser == "Netscape")  //IE11, Chrome,Firefox浏览器
{
        if (navigator.userAgent.search("Trident") != -1) //IE11
            document.writeln("<OBJECT id=\"GDCACom\" classid=\"CLSID:" + com_classid + "\" style=\"display:none\"></OBJECT>");
        else
            document.writeln("<OBJECT id=\"GDCACom\" TYPE=\"application/gdca-activex\" clsid=\"{" + com_classid + "}\" WIDTH=\"0\" HEIGHT=\"0\"></OBJECT>");
}

var GDCACom = document.getElementById("GDCACom");


//Chrome和Firefox浏览器下检测MIME类型是否存在，对IE无效
function DetectGDCAFFlugin() {
    var mimetype = navigator.mimeTypes["application/gdca-activex"];
    if (mimetype) {
        var plugin = mimetype.enabledPlugin;
        if (plugin) {
            return true;
        }
    }
    else {
        return false;
    }
}


//通知用户安装最新客户端软件
function NotifyInsClient() {
//alert("version low!")
    alert("您没有安装GDCA客户端软件或你的客户端软件版本较低！");
}

//通知用户安装GDCA浏览器插件
function NotifyInsPlugin() {
//alert("No Plugin!")
    alert("您没有安装GDCA浏览器插件！");
}

//检查客户端是否安装了插件，没有则下载
//针对不同种浏览器分别处理
function CheckPlugin() {
    if (browser == "Microsoft Internet Explorer")        //IE浏览器
    {
        //对于IE浏览器，通过尝试调用COM组件中的某个方法来判断是否安装了客户端
        try 
        {
            var my_version = GDCACom.SOF_GetLastError();
        }
        catch (e) 
        {
            NotifyInsClient();
            return false;
        }//try..catch
    }
    else if (browser == "Netscape")        //如果是IE11, Chrome或Firefox浏览器
    {
        if (navigator.userAgent.search("Trident") != -1)  //IE11
        {
            //对于IE浏览器，通过尝试调用COM组件中的某个方法来判断是否安装了客户端
            try 
            {
                var my_version = GDCACom.SOF_GetLastError();
            }
            catch (e) 
            {
                alert(e.message);
                NotifyInsClient();
                return false;
            }//try..catch
        }
        else
        {
            if (DetectGDCAFFlugin()) {
                try {
                    var my_version = GDCACom.SOF_GetLastError();
                }
                catch (e) {
                    NotifyInsClient();
                    return false;
                }//try..catch
            }
            else {
                NotifyInsPlugin();

                return false;
            }
        }
    }
    else        //如果是Opera浏览器或其它
    {
    alert("Sorry,Not Surpport!");
        alert("很抱歉，目前不支持当前浏览器，请使用IE、火狐、Chrome等浏览器");
        return false;
    }


    return true;

}//funcion CheckPlugin

//CheckPlugin();

