(function(){
  
  editor_file = {};

  (function(){
    var script = document.createElement('script');
    if (window.location.href.indexOf('_server')!==-1)
      script.src = '../project/comment.js';
    else
      script.src = 'project/comment.js';
    document.body.appendChild(script);
    script.onload = function () {
      editor_file.comment=comment_c456ea59_6018_45ef_8bcc_211a24c627dc;
      delete(comment_c456ea59_6018_45ef_8bcc_211a24c627dc);
    }
  })();
  (function(){
    var script = document.createElement('script');
    if (window.location.href.indexOf('_server')!==-1)
      script.src = '../project/data.comment.js';
    else
      script.src = 'project/data.comment.js';
    document.body.appendChild(script);
    script.onload = function () {
      editor_file.dataComment=data_comment_a1e2fb4a_e986_4524_b0da_9b7ba7c0874d;
      delete(data_comment_a1e2fb4a_e986_4524_b0da_9b7ba7c0874d);
    }
  })();


  editor_file.getFloorFileList = function(editor,callback){
    if (!isset(callback)) throw('未设置callback');
    var fs = editor.fs;
    fs.readdir('project/floors',function(err, data){
      callback([data,err]);
    });
  }
  //callback([Array<String>,err:String])
  editor_file.loadFloorFile = function(editor,filename,callback){
    //filename不含'/'不含'.js'
    if (!isset(callback)) throw('未设置callback');
    var fs = editor.fs;
    fs.readFile('project/floors/'+filename+'.js','utf-8',function(err, data){
      if (err!=null){callback(err);return;}
      data=data.split('=');
      data=[data[0],data.slice(1).join('=')];
      var varnameId = data[0].split('.').slice(-1)[0].trim();
      var filenameId = filename.split('/').slice(-1)[0].split('\\').slice(-1)[0];
      eval('b3917d1d_71c2_41f2_a8aa_481b215ffb99='+data[1]);
      var floorData = b3917d1d_71c2_41f2_a8aa_481b215ffb99;
      delete(b3917d1d_71c2_41f2_a8aa_481b215ffb99);
      var floorId = floorData.floorId;
      if (varnameId!=filenameId || filenameId!=floorId){
        callback('文件名,第一行的变量名以及floorId不一致');
        return;
      }
      editor.currentFloorId = floorId;
      editor.currentFloorData = floorData;
      callback(null)
    });
  }
  //callback(err:String)
  editor_file.saveFloorFile = function(editor,callback){
    if (!isset(callback)) throw('未设置callback');
    /* if (!isset(editor.currentFloorId) || !isset(editor.currentFloorData)) {
      callback('未选中文件或无数据');
    } */
    var filename = 'project/floors/' + editor.currentFloorId + '.js';
    var datastr = ['main.floors.' , editor.currentFloorId , '=\n{'];
    for(var ii in editor.currentFloorData)
    if (editor.currentFloorData.hasOwnProperty(ii)) {
      if (ii=='map')
        datastr=datastr.concat(['\n"',ii,'": [\n',formatMap(editor.currentFloorData[ii]),'\n],']);
      else
        datastr=datastr.concat(['\n"',ii,'": ',JSON.stringify(editor.currentFloorData[ii],null,4),',']);
    }
    datastr=datastr.concat(['\n}']);
    datastr=datastr.join('');
    fs.writeFile(filename,datastr,'utf-8',function(err, data){
      callback(err);
    });
  }
  //callback(err:String)
  editor_file.saveFloorFileAs = function(editor,saveAsFilename,callback){
    //saveAsFilename不含'/'不含'.js'
    if (!isset(callback)) throw('未设置callback');
    if (!isset(editor.currentFloorData)) {
      callback('无数据');
    }
    editor.currentFloorData.floorId=saveAsFilename;
    editor.currentFloorId=saveAsFilename;
    editor_file.saveFloorFile(editor,callback);
  }
  //callback(err:String)

  ////////////////////////////////////////////////////////////////////

  editor_file.changeIdAndIdnum = function(editor,id,idnum,info,callback){
    if (!isset(callback)) throw('未设置callback');
    //检查maps中是否有重复的idnum或id
    var change = -1;
    for(var ii in editor.core.maps.blocksInfo){
      if (ii==idnum) {
        //暂时只允许创建新的不允许修改已有的
        //if (info.idnum==idnum){change=ii;break;}//修改id
        callback('idnum重复了');
        return;
      }
      if (editor.core.maps.blocksInfo[ii].id==id) {
        //if (info.id==id){change=ii;break;}//修改idnum
        callback('id重复了');
        return;
      }
    }
    /*
    if (change!=-1 && change!=idnum){//修改idnum
      editor.core.maps.blocksInfo[idnum] = editor.core.maps.blocksInfo[change];
      delete(editor.core.maps.blocksInfo[change]);
    } else if (change==idnum) {//修改id
      var oldid = editor.core.maps.blocksInfo[idnum].id;
      editor.core.maps.blocksInfo[idnum].id = id;
      for(var ii in editor.core.icons.icons){
        if (ii.hasOwnProperty(oldid)){
          ii[id]=ii[oldid];
          delete(ii[oldid]);
        }
      }
    } else {//创建新的
      editor.core.maps.blocksInfo[idnum]={'cls': info.images, 'id':id};
      editor.core.icons.icons[info.images][id]=info.y;
    }
    */
    var templist=[];
    var tempcallback = function (err) {
      templist.push(err);
      if (templist.length ==2 ) {
        if (templist[0]!=null || templist[1]!=null)
          callback((templist[0]||'')+'\n'+(templist[1]||''));
          //这里如果一个成功一个失败会出严重bug
        else
          callback(null);
      }
    }
    saveSetting('maps',[["add","['"+idnum+"']",{'cls': info.images, 'id':id}]],tempcallback);
    saveSetting('icons',[["add","['"+info.images+"']['"+id+"']",info.y]],tempcallback);
    
    callback(null);
  }
  //callback(err:String)
  editor_file.editItem = function(editor,id,actionList,callback){
    /*actionList:[
      ["change","['items']['name']","红宝石的新名字"],
      ["add","['items']['新的和name同级的属性']",123],
      ["change","['itemEffectTip']","'，攻击力+'+editor.core.values.redJewel"],
    ]
    为[]时只查询不修改
    */
    if (!isset(callback)) throw('未设置callback');
    if (isset(actionList) && actionList.length > 0){
      actionList.forEach(function (value) {
        var tempindex = value[1].indexOf(']')+1;
        value[1] = [value[1].slice(0,tempindex),"['"+id+"']",value[1].slice(tempindex)].join('');
      });
      saveSetting('items',actionList,function (err) {
        callback([
          {'items':editor.core.items.items[id],'itemEffect':editor.core.items.itemEffect[id],'itemEffectTip':editor.core.items.itemEffectTip[id]},
          editor_file.comment.items,
          err]);
      });
    } else {
      callback([
        {'items':editor.core.items.items[id],'itemEffect':editor.core.items.itemEffect[id],'itemEffectTip':editor.core.items.itemEffectTip[id]},
        editor_file.comment.items,
        null]);
    }
    //只有items.cls是items的才有itemEffect和itemEffectTip,keys和constants和tools只有items
  }
  //callback([obj,commentObj,err:String])
  editor_file.editEnemy = function(editor,id,actionList,callback){
    /*actionList:[
      ["change","['name']","初级巫师的新名字"],
      ["add","['新的和name同级的属性']",123],
      ["change","['bomb']",null],
    ]
    为[]时只查询不修改
    */
    if (!isset(callback)) throw('未设置callback');
    if (isset(actionList) && actionList.length > 0){
      actionList.forEach(function (value) {
        value[1] = "['"+id+"']"+value[1];
      });
      saveSetting('enemys',actionList,function (err) {
        callback([
          (function(){
            var locObj={};
            Object.keys(editor_file.comment.enemys).forEach(function(v){
              if (isset(editor.core.enemys.enemys[id][v]))
                locObj[v]=editor.core.enemys.enemys[id][v];
              else
                locObj[v]=null;
            });
            return locObj;
          })(),
          editor_file.comment.enemys,
          err]);
      });
    } else {
      callback([
        (function(){
          var locObj={};
          Object.keys(editor_file.comment.enemys).forEach(function(v){
            if (isset(editor.core.enemys.enemys[id][v]))
              locObj[v]=editor.core.enemys.enemys[id][v];
            else
              locObj[v]=null;
          });
          return locObj;
        })(),
        editor_file.comment.enemys,
        null]);
    }
  }
  //callback([obj,commentObj,err:String])

  ////////////////////////////////////////////////////////////////////  

  editor_file.editLoc = function(editor,x,y,actionList,callback){
    /*actionList:[
      ["change","['events']",["\t[老人,magician]领域、夹击。\n请注意领域怪需要设置value为伤害数值，可参见样板中初级巫师的写法。"]],
      ["change","['afterBattle']",null],
    ]
    为[]时只查询不修改
    */
    if (!isset(callback)) throw('未设置callback');
    if (isset(actionList) && actionList.length > 0){
      actionList.forEach(function (value) {
        value[1] = value[1]+"['"+x+","+y+"']";
      });
      saveSetting('floors',actionList,function (err) {
        callback([
          (function(){
            var locObj={};
            Object.keys(editor_file.comment.floors.loc).forEach(function(v){
              if (isset(editor.currentFloorData[v][x+','+y]))
                locObj[v]=editor.currentFloorData[v][x+','+y];
              else
                locObj[v]=null;
            });
            return locObj;
          })(),
          editor_file.comment.floors.loc,
          err]);
      });
    } else {
      callback([
        (function(){
          var locObj={};
          Object.keys(editor_file.comment.floors.loc).forEach(function(v){
            if (isset(editor.currentFloorData[v][x+','+y]))
              locObj[v]=editor.currentFloorData[v][x+','+y];
            else
              locObj[v]=null;
          });
          return locObj;
        })(),
        editor_file.comment.floors.loc,
        null]);
    }
    
  }
  //callback([obj,commentObj,err:String])

  ////////////////////////////////////////////////////////////////////  

  editor_file.editFloor = function(editor,actionList,callback){
    /*actionList:[
      ["change","['title']",'样板 3 层'],
      ["change","['color']",null],
    ]
    为[]时只查询不修改
    */
    if (!isset(callback)) throw('未设置callback');
    if (isset(actionList) && actionList.length > 0){
      saveSetting('floors',actionList,function (err) {
        callback([
          (function(){
            var locObj={};
            Object.keys(editor_file.comment.floors.floor).forEach(function(v){
              if (isset(editor.currentFloorData[v]))
                locObj[v]=editor.currentFloorData[v];
              else
                locObj[v]=null;
            });
            return locObj;
          })(),
          editor_file.comment.floors.floor,
          err]);
      });
    } else {
      callback([
        (function(){
          var locObj={};
          Object.keys(editor_file.comment.floors.floor).forEach(function(v){
            if (isset(editor.currentFloorData[v]))
              locObj[v]=editor.currentFloorData[v];
            else
              locObj[v]=null;
          });
          return locObj;
        })(),
        editor_file.comment.floors.floor,
        null]);
    }
  }
  //callback([obj,commentObj,err:String])

  ////////////////////////////////////////////////////////////////////

  editor_file.editTower = function(editor,actionList,callback){
    /*actionList:[
      ["change","['firstData']['version']",'Ver 1.0.1 (Beta)'],
      ["change","['values']['lavaDamage']",200],
    ]
    为[]时只查询不修改
    */
    if (!isset(callback)) throw('未设置callback');
    if (isset(actionList) && actionList.length > 0){
      saveSetting('data',actionList,function (err) {
        callback([
          (function(){
            var locObj=Object.assign({'main':{}},editor.core.data);
            Object.keys(editor_file.dataComment.main).forEach(function(v){
              if (isset(editor.main[v]))
                locObj.main[v]=editor.main[v];
              else
                locObj[v]=null;
            });
            return locObj;
          })(),
          editor_file.dataComment,
          err]);
      });
    } else {
      callback([
        (function(){
          var locObj=Object.assign({'main':{}},editor.core.data);
          Object.keys(editor_file.dataComment.main).forEach(function(v){
            if (isset(editor.main[v]))
              locObj.main[v]=editor.main[v];
            else
              locObj[v]=null;
          });
          return locObj;
        })(),
        editor_file.dataComment,
        null]);
    }
  }
  //callback([obj,commentObj,err:String])

  ////////////////////////////////////////////////////////////////////  
  
  var isset = function (val) {
    if (val == undefined || val == null) {
        return false;
    }
    return true
  }

  var formatMap = function(mapArr){
    //把13*13或者1*169数组格式化
    var formatArrStr = '';
    var arr = JSON.stringify(mapArr).replace(/\s+/g, '').split('],[');
    for(var i =0; i<13; i++){
      var a = [];
      formatArrStr +='    [';
      if(i==0||i==12) a = arr[i].split(/\D+/).join(' ').trim().split(' ');
      else a = arr[i].split(/\D+/);
      for(var k=0; k<13; k++){
        var num = parseInt(a[k]);
        formatArrStr += Array(Math.max(4-String(num).length,0)).join(' ')+num+(k==12?'':',');
      }
      formatArrStr += ']'+(i==12?'':',\n');
    }
    return formatArrStr;
  }
  
  var saveSetting = function(file,actionList,callback) {
    console.log(file);
    console.log(actionList);
    actionList.forEach(function (value) {
      if (value[0]!='change' && file!='icons' && file!='maps') throw('目前只支持change');
    });


    throw('尚未实现');


    if (file=='icons') {
      actionList.forEach(function (value) {
        if (value[0]!='add')return;
        eval("icons_4665ee12_3a1f_44a4_bea3_0fccba634dc1"+value[1]+'='+JSON.stringify(value[2]));
      });
      var datastr='icons_4665ee12_3a1f_44a4_bea3_0fccba634dc1 = \n';
      datastr+=JSON.stringify(icons_4665ee12_3a1f_44a4_bea3_0fccba634dc1,null,4);
      fs.writeFile('project/icons.js',datastr,'utf-8',function(err, data){
        callback(err);
      });
    }
    if (file=='maps') {
      actionList.forEach(function (value) {
        if (value[0]!='change')return;
        eval("maps_90f36752_8815_4be8_b32b_d7fad1d0542e"+value[1]+'='+JSON.stringify(value[2]));
      });
      var datastr='maps_90f36752_8815_4be8_b32b_d7fad1d0542e = \n';
      datastr+=JSON.stringify(maps_90f36752_8815_4be8_b32b_d7fad1d0542e,null,4);
      fs.writeFile('project/maps.js',datastr,'utf-8',function(err, data){
        callback(err);
      });
    }
    if (file=='items') {
      actionList.forEach(function (value) {
        if (value[0]!='change')return;
        eval("items_296f5d02_12fd_4166_a7c1_b5e830c9ee3a"+value[1]+'='+JSON.stringify(value[2]));
      });
      var datastr='items_296f5d02_12fd_4166_a7c1_b5e830c9ee3a = \n';
      datastr+=JSON.stringify(items_296f5d02_12fd_4166_a7c1_b5e830c9ee3a,null,4);
      fs.writeFile('project/items.js',datastr,'utf-8',function(err, data){
        callback(err);
      });
    }
    if (file=='enemys') {
      actionList.forEach(function (value) {
        if (value[0]!='change')return;
        eval("enemys_fcae963b_31c9_42b4_b48c_bb48d09f3f80"+value[1]+'='+JSON.stringify(value[2]));
      });
      var datastr='enemys_fcae963b_31c9_42b4_b48c_bb48d09f3f80 = \n';
      datastr+=JSON.stringify(enemys_fcae963b_31c9_42b4_b48c_bb48d09f3f80,null,4);
      fs.writeFile('project/enemys.js',datastr,'utf-8',function(err, data){
        callback(err);
      });

    }
    if (file=='data') {
      actionList.forEach(function (value) {
        if (value[0]!='change')return;
        eval("data_a1e2fb4a_e986_4524_b0da_9b7ba7c0874d"+value[1]+'='+JSON.stringify(value[2]));
      });
      var datastr='data_a1e2fb4a_e986_4524_b0da_9b7ba7c0874d = \n';
      datastr+=JSON.stringify(data_a1e2fb4a_e986_4524_b0da_9b7ba7c0874d,null,4);
      fs.writeFile('project/data.js',datastr,'utf-8',function(err, data){
        callback(err);
      });
    }
    if (file=='floors') {
      actionList.forEach(function (value) {
        if (value[0]!='change')return;
        eval("editor.currentFloorData"+value[1]+'='+JSON.stringify(value[2]));
      });
      editor_file.saveFloorFile(editor,callback);
    }
    callback('出错了,要设置的文件名不识别');
  }
  
  /*
  $range((function(){typeof(thiseval)==typeof(0)||})())
  if( 注释.indexof('$range(')!= -1){
    var thiseval = 新值;
    evalstr = 注释.split('$range')[1].split('$end')[0];
    if(eval(evalstr) !== true)alert('不在取值范围内')
  }
  */

  /* 
  所有注释中的特殊指令
  $range(evalstr:thiseval)$end
    限制取值范围,要求修改后的eval(evalstr)为true
  $leaf(evalstr:thiseval)$end
    强制指定为叶节点,如果eval(evalstr)为true

  todo:
  //以下几个中选一个 [
  $select(evalstr)$end
    渲染成<select>,选项为数组eval(evalstr)['values']
  $input
    渲染成<input>,此为默认选项
  $textarea(evalstr)$end
    渲染成<textarea>,行数为正整数eval(evalstr)['rows']
  // ]
  
  ?:
  //$childLeaf(evalstr:thiseval)$end
  //  强制指定直接后代为叶节点,如果evalstr的值为true,此处thiseval为后代的值
  */

})();