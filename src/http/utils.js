export function guid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
        return v.toString(16);
    });
}
 
export function getServerDate() {
	var createxmlhttp = function () {
        var xmlHttp;
        function createxmlHttpRequest() {
            if(window.ActiveXObject){
                xmlHttp = new ActiveXObject('Microsoft.XMLHTTP');
                return xmlHttp;
            }else if(window.XMLHttpRequest){
                xmlHttp = new XMLHttpRequest();
                return xmlHttp
            }
        }
        return createxmlHttpRequest;
    }
    var xml = new createxmlhttp();
    var xmlHttp = xml();
    xmlHttp.open('GET', '/timestamp.php?'+new Date().getTime());
    xmlHttp.send(null);
    var text = '' + xmlHttp.responseText;
    if(xmlHttp.status === 200 && text.length == 13){
        return xmlHttp.responseText*1
    }else{
        var xmls = new createxmlhttp();
        var xmlsHttp = xmls();
        xmlsHttp.open('GET', '/bitbug_favicon.ico?'+new Date().getTime());
        xmlsHttp.send(null);
        if(xmlsHttp.status == 200){
            return new Date(xmlsHttp.getResponseHeader("Date")).getTime();
        }else{
            return new Date().getTime();
        }
    }
}
