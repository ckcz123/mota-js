(function(){
  fs = {};
  var postsomething = function (data,_ip,callback) {
    //callback:function(err, data)
    //data:字符串
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function(){
      switch(xhr.readyState){
        case 4 : 
          if ((xhr.status >= 200 && xhr.status < 300) || xhr.status == 304) {
            if (Boolean(callback)){
              if (xhr.responseText.slice(0,6)=='error:'){
                callback(xhr.responseText,null);
              } else {
                callback(null,xhr.responseText);
              }
            }
            //printf(xhr.responseText)
          }else{
            if (Boolean(callback))callback(xhr.status,null);
            //printf('error:' + xhr.status+'<br>'+(xhr.responseText||''));
          }
          break;
      }
    }
    xhr.open('post',_ip);
    xhr.setRequestHeader('Content-Type','text/plain');
    if(typeof(data)==typeof([][0]) || data==null)data=JSON.stringify({1:2});
    xhr.send(data);
  }

  fs.readFile = function (filename,encoding,callback) {
    if (typeof(filename)!=typeof(''))
      throw 'Type Error in fs.readFile';
    if (encoding=='utf-8'){
      //读文本文件
      //filename:支持"/"做分隔符
      //callback:function(err, data)
      //data:字符串
      var data='';
      data+='type=utf8&';
      data+='name='+filename;
      postsomething(data,'/readFile',callback);
      return;
    }
    if (encoding=='base64'){
      //读二进制文件
      //filename:支持"/"做分隔符
      //callback:function(err, data)  
      //data:base64字符串
      var data='';
      data+='type=base64&';
      data+='name='+filename;
      postsomething(data,'/readFile',callback);
      return;
    }
    throw 'Type Error in fs.readFile';
  }

  fs.writeFile = function (filename,datastr,encoding,callback) {
    if (typeof(filename)!=typeof('') || typeof(datastr)!=typeof(''))
      throw 'Type Error in fs.writeFile';
    if (encoding=='utf-8'){
      //写文本文件
      //filename:支持"/"做分隔符
      //callback:function(err)
      //datastr:字符串
      var data='';
      data+='type=utf8&';
      data+='name='+filename;
      data+='&value='+datastr;
      postsomething(data,'/writeFile',callback);
      return;
    }
    if (encoding=='base64'){
      //写二进制文件
      //filename:支持"/"做分隔符
      //callback:function(err)
      //datastr:base64字符串
      var data='';
      data+='type=base64&';
      data+='name='+filename;
      data+='&value='+datastr;
      postsomething(data,'/writeFile',callback);
      return;
    }
    throw 'Type Error in fs.writeFile';
  }

  fs.readdir = function (path, callback) {
    //callback:function(err, data) 
    //path:支持"/"做分隔符,不以"/"结尾
    //data:[filename1,filename2,..] filename是字符串,只包含文件不包含目录
    if (typeof(path)!=typeof(''))
      throw 'Type Error in fs.readdir';
    var data='';
    data+='name='+path;
    postsomething(data,'/listFile',function(err, data){callback(err,JSON.parse(data))});
    return;
  }
})();