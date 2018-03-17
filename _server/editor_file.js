editor_file = function(editor, callback){
  
  var editor_file = {};


  var commentjs={
    'comment':'comment',
    'data.comment':'dataComment',
    'functions.comment':'functionsComment',
  }
  for(var key in commentjs){
    (function(key){
      var value = commentjs[key];
      var script = document.createElement('script');
      if (window.location.href.indexOf('_server')!==-1)
        script.src = '../project/'+key+'.js';
      else
        script.src = 'project/'+key+'.js';
      document.body.appendChild(script);
      script.onload = function () {
        editor_file[value]=eval(key.replace('.','_')+'_c456ea59_6018_45ef_8bcc_211a24c627dc');
        var loaded = Boolean(callback);
        for(var key_ in commentjs){loaded = loaded && editor_file[commentjs[key_]]}
        if (loaded)callback();
      }
    })(key);
  }


  editor_file.getFloorFileList = function(callback){
    if (!isset(callback)) {printe('未设置callback');throw('未设置callback')};
    /* var fs = editor.fs;
    fs.readdir('project/floors',function(err, data){
      callback([data,err]);
    }); */
    callback([editor.core.floorIds,null]);
  }
  //callback([Array<String>,err:String])
  editor_file.loadFloorFile = function(filename,callback){
    //filename不含'/'不含'.js'
    if (!isset(callback)) {printe('未设置callback');throw('未设置callback')};
    /* var fs = editor.fs;
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
    }); */
    editor.currentFloorId=editor.core.status.floorId;
    editor.currentFloorData = editor.core.floors[editor.currentFloorId];
  }
  //callback(err:String)
  editor_file.saveFloorFile = function(callback){
    if (!isset(callback)) {printe('未设置callback');throw('未设置callback')};
    /* if (!isset(editor.currentFloorId) || !isset(editor.currentFloorData)) {
      callback('未选中文件或无数据');
    } */
    var filename = 'project/floors/' + editor.currentFloorId + '.js';
    var datastr = ['main.floors.' , editor.currentFloorId , '=\n{'];
    editor.currentFloorData.map = editor.map.map(function(v){return v.map(function(v){return v.idnum||v||0})});
    for(var ii in editor.currentFloorData)
    if (editor.currentFloorData.hasOwnProperty(ii)) {
      if (ii=='map')
        datastr=datastr.concat(['\n"',ii,'": [\n',formatMap(editor.currentFloorData[ii]),'\n],']);
      else
        datastr=datastr.concat(['\n"',ii,'": ',JSON.stringify(editor.currentFloorData[ii],null,4),',']);
    }
    datastr=datastr.concat(['\n}']);
    datastr=datastr.join('');
    fs.writeFile(filename,encode(datastr),'base64',function(err, data){
      callback(err);
    });
  }
  //callback(err:String)
  editor_file.saveFloorFileAs = function(saveAsFilename,callback){
    //saveAsFilename不含'/'不含'.js'
    if (!isset(callback)) {printe('未设置callback');throw('未设置callback')};
    if (!isset(editor.currentFloorData)) {
      callback('无数据');
    }
    editor.currentFloorData.map = editor.map.map(function(v){return v.map(function(v){return v.idnum||v||0})});
    editor.currentFloorData=JSON.parse(JSON.stringify(editor.currentFloorData));
    editor.currentFloorData.floorId=saveAsFilename;
    editor.currentFloorId=saveAsFilename;
    editor_file.saveFloorFile(callback);
  }
  //callback(err:String)

  ////////////////////////////////////////////////////////////////////

  editor_file.changeIdAndIdnum = function(id,idnum,info,callback){
    if (!isset(callback)) {printe('未设置callback');throw('未设置callback')};
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
    if(info.images==='items'){
      saveSetting('items',[["add","['items']['"+id+"']",editor_file.comment._data.items_template]],function(err){if(err){printe(err);throw(err)}});
    }
    if(info.images==='enemys' || info.images==='enemy48'){
      saveSetting('enemys',[["add","['"+id+"']",editor_file.comment._data.enemys_template]],function(err){if(err){printe(err);throw(err)}});
    }
    
    callback(null);
  }
  //callback(err:String)
  editor_file.editItem = function(id,actionList,callback){
    /*actionList:[
      ["change","['items']['name']","红宝石的新名字"],
      ["add","['items']['新的和name同级的属性']",123],
      ["change","['itemEffectTip']","'，攻击力+'+editor.core.values.redJewel"],
    ]
    为[]时只查询不修改
    */
    if (!isset(callback)) {printe('未设置callback');throw('未设置callback')};
    if (isset(actionList) && actionList.length > 0){
      actionList.forEach(function (value) {
        var tempindex = value[1].indexOf(']')+1;
        value[1] = [value[1].slice(0,tempindex),"['"+id+"']",value[1].slice(tempindex)].join('');
      });
      saveSetting('items',actionList,function (err) {
        callback([
          (function(){
            var locObj_ ={};
            Object.keys(editor_file.comment._data.items._data).forEach(function(v){
              if (isset(editor.core.items[v][id]) && v!=='items')
                locObj_[v]=editor.core.items[v][id];
              else
                locObj_[v]=null;
            });
            locObj_['items']=(function(){
              var locObj=Object.assign({},editor.core.items.items[id]);
              Object.keys(editor_file.comment._data.items._data.items._data).forEach(function(v){
                if (!isset(editor.core.items.items[id][v]))
                  locObj[v]=null;
              });
              return locObj;
            })();
            return locObj_;
          })(),
          editor_file.comment._data.items,
          err]);
      });
    } else {
      callback([
        (function(){
          var locObj_ ={};
          Object.keys(editor_file.comment._data.items._data).forEach(function(v){
            if (isset(editor.core.items[v][id]) && v!=='items')
              locObj_[v]=editor.core.items[v][id];
            else
              locObj_[v]=null;
          });
          locObj_['items']=(function(){
            var locObj=Object.assign({},editor.core.items.items[id]);
            Object.keys(editor_file.comment._data.items._data.items._data).forEach(function(v){
              if (!isset(editor.core.items.items[id][v]))
                locObj[v]=null;
            });
            return locObj;
          })();
          return locObj_;
        })(),
        editor_file.comment._data.items,
        null]);
    }
    //只有items.cls是items的才有itemEffect和itemEffectTip,keys和constants和tools只有items
  }
  //callback([obj,commentObj,err:String])
  editor_file.editEnemy = function(id,actionList,callback){
    /*actionList:[
      ["change","['name']","初级巫师的新名字"],
      ["add","['新的和name同级的属性']",123],
      ["change","['bomb']",null],
    ]
    为[]时只查询不修改
    */
    if (!isset(callback)) {printe('未设置callback');throw('未设置callback')};
    if (isset(actionList) && actionList.length > 0){
      actionList.forEach(function (value) {
        value[1] = "['"+id+"']"+value[1];
      });
      saveSetting('enemys',actionList,function (err) {
        callback([
          (function(){
            var locObj=Object.assign({},editor.core.enemys.enemys[id]);
            Object.keys(editor_file.comment._data.enemys._data).forEach(function(v){
              if (!isset(editor.core.enemys.enemys[id][v]))
                /* locObj[v]=editor.core.enemys.enemys[id][v];
              else */
                locObj[v]=null;
            });
            return locObj;
          })(),
          editor_file.comment._data.enemys,
          err]);
      });
    } else {
      callback([
        (function(){
          var locObj=Object.assign({},editor.core.enemys.enemys[id]);
          Object.keys(editor_file.comment._data.enemys._data).forEach(function(v){
            if (!isset(editor.core.enemys.enemys[id][v]))
              /* locObj[v]=editor.core.enemys.enemys[id][v];
            else */
              locObj[v]=null;
          });
          return locObj;
        })(),
        editor_file.comment._data.enemys,
        null]);
    }
  }
  //callback([obj,commentObj,err:String])

  editor_file.editMapBlocksInfo = function(idnum,actionList,callback){
    /*actionList:[
      ["change","['events']",["\t[老人,magician]领域、夹击。\n请注意领域怪需要设置value为伤害数值，可参见样板中初级巫师的写法。"]],
      ["change","['afterBattle']",null],
    ]
    为[]时只查询不修改
    */
    if (!isset(callback)) {printe('未设置callback');throw('未设置callback')};
    if (isset(actionList) && actionList.length > 0){
      actionList.forEach(function (value) {
        value[1] = "['"+idnum+"']"+value[1];
      });
      saveSetting('maps',actionList,function (err) {
        callback([
          (function(){
            var locObj=Object.assign({},editor.core.maps.blocksInfo[idnum]);
            Object.keys(editor_file.comment._data.maps._data).forEach(function(v){
              if (!isset(editor.core.maps.blocksInfo[idnum][v]))
                locObj[v]=null;
            });
            locObj.idnum = idnum;
            return locObj;
          })(),
          editor_file.comment._data.maps,
          null]);
      });
    } else {
      callback([
        (function(){
          var locObj=Object.assign({},editor.core.maps.blocksInfo[idnum]);
          Object.keys(editor_file.comment._data.maps._data).forEach(function(v){
            if (!isset(editor.core.maps.blocksInfo[idnum][v]))
              locObj[v]=null;
          });
          locObj.idnum = idnum;
          return locObj;
        })(),
        editor_file.comment._data.maps,
        null]);
    }
  }
  //callback([obj,commentObj,err:String])

  ////////////////////////////////////////////////////////////////////  

  editor_file.editLoc = function(x,y,actionList,callback){
    /*actionList:[
      ["change","['events']",["\t[老人,magician]领域、夹击。\n请注意领域怪需要设置value为伤害数值，可参见样板中初级巫师的写法。"]],
      ["change","['afterBattle']",null],
    ]
    为[]时只查询不修改
    */
    if (!isset(callback)) {printe('未设置callback');throw('未设置callback')};
    if (isset(actionList) && actionList.length > 0){
      actionList.forEach(function (value) {
        value[1] = value[1]+"['"+x+","+y+"']";
      });
      saveSetting('floors',actionList,function (err) {
        callback([
          (function(){
            var locObj={};
            Object.keys(editor_file.comment._data.floors._data.loc._data).forEach(function(v){
              if (isset(editor.currentFloorData[v][x+','+y]))
                locObj[v]=editor.currentFloorData[v][x+','+y];
              else
                locObj[v]=null;
            });
            return locObj;
          })(),
          editor_file.comment._data.floors._data.loc,
          err]);
      });
    } else {
      callback([
        (function(){
          var locObj={};
          Object.keys(editor_file.comment._data.floors._data.loc._data).forEach(function(v){
            if (isset(editor.currentFloorData[v][x+','+y]))
              locObj[v]=editor.currentFloorData[v][x+','+y];
            else
              locObj[v]=null;
          });
          return locObj;
        })(),
        editor_file.comment._data.floors._data.loc,
        null]);
    }
    
  }
  //callback([obj,commentObj,err:String])

  ////////////////////////////////////////////////////////////////////  

  editor_file.editFloor = function(actionList,callback){
    /*actionList:[
      ["change","['title']",'样板 3 层'],
      ["change","['color']",null],
    ]
    为[]时只查询不修改
    */
    if (!isset(callback)) {printe('未设置callback');throw('未设置callback')};
    if (isset(actionList) && actionList.length > 0){
      saveSetting('floors',actionList,function (err) {
        callback([
          (function(){
            var locObj=Object.assign({},editor.currentFloorData);
            Object.keys(editor_file.comment._data.floors._data.floor._data).forEach(function(v){
              if (!isset(editor.currentFloorData[v]))
                /* locObj[v]=editor.currentFloorData[v];
              else */
                locObj[v]=null;
            });
            Object.keys(editor_file.comment._data.floors._data.loc._data).forEach(function(v){
              delete(locObj[v]);
            });
            delete(locObj.map);
            return locObj;
          })(),
          editor_file.comment._data.floors._data.floor,
          err]);
      });
    } else {
      callback([
        (function(){
          var locObj=Object.assign({},editor.currentFloorData);
          Object.keys(editor_file.comment._data.floors._data.floor._data).forEach(function(v){
            if (!isset(editor.currentFloorData[v]))
              /* locObj[v]=editor.currentFloorData[v];
            else */
              locObj[v]=null;
          });
          Object.keys(editor_file.comment._data.floors._data.loc._data).forEach(function(v){
            delete(locObj[v]);
          });
          delete(locObj.map);
          return locObj;
        })(),
        editor_file.comment._data.floors._data.floor,
        null]);
    }
  }
  //callback([obj,commentObj,err:String])

  ////////////////////////////////////////////////////////////////////

  editor_file.editTower = function(actionList,callback){
    /*actionList:[
      ["change","['firstData']['version']",'Ver 1.0.1 (Beta)'],
      ["change","['values']['lavaDamage']",200],
    ]
    为[]时只查询不修改
    */
    if (!isset(callback)) {printe('未设置callback');throw('未设置callback')};
    if (isset(actionList) && actionList.length > 0){
      saveSetting('data',actionList,function (err) {
        callback([
          (function(){
            var locObj=Object.assign({'main':{}},editor.core.data);
            Object.keys(editor_file.dataComment._data.main._data).forEach(function(v){
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
          Object.keys(editor_file.dataComment._data.main._data).forEach(function(v){
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

  var fmap = {};
  var fjson = JSON.stringify(functions_d6ad677b_427a_4623_b50f_a445a3b0ef8a,function(k,v){if(v instanceof Function){var id_ = editor.guid();fmap[id_]=v.toString();return id_;}else return v},4);
  var fobj = JSON.parse(fjson);
  editor_file.functionsMap = fmap;
  editor_file.functionsJSON = fjson;
  var buildlocobj = function(locObj){
    for(var key in locObj){
      if(typeof(locObj[key])!==typeof(''))buildlocobj(locObj[key]);
      else locObj[key]=fmap[locObj[key]];
    }
  };

  editor_file.editFunctions = function(actionList,callback){
    /*actionList:[
      ["change","['events']['afterChangeLight']","function(x,y){console.log(x,y)}"],
      ["change","['ui']['drawAbout']","function(){...}"],
    ]
    为[]时只查询不修改
    */
    if (!isset(callback)) {printe('未设置callback');throw('未设置callback')};
    if (isset(actionList) && actionList.length > 0){
      saveSetting('functions',actionList,function (err) {
        callback([
          (function(){
            var locObj=JSON.parse(fjson);
            buildlocobj(locObj);
            return locObj;
          })(),
          editor_file.functionsComment,
          err]);
      });
    } else {
      callback([
        (function(){
          var locObj=JSON.parse(fjson);
          buildlocobj(locObj);
          return locObj;
        })(),
        editor_file.functionsComment,
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

  var encode = function (str) {
    return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, function(match, p1) {
        return String.fromCharCode(parseInt(p1, 16))
    }))
  }
  
  var saveSetting = function(file,actionList,callback) {
    //console.log(file);
    //console.log(actionList);

    if (file=='icons') {
      actionList.forEach(function (value) {
        eval("icons_4665ee12_3a1f_44a4_bea3_0fccba634dc1"+value[1]+'='+JSON.stringify(value[2]));
      });
      var datastr='icons_4665ee12_3a1f_44a4_bea3_0fccba634dc1 = \n';
      datastr+=JSON.stringify(icons_4665ee12_3a1f_44a4_bea3_0fccba634dc1,null,'\t');
      fs.writeFile('project/icons.js',encode(datastr),'base64',function(err, data){
        callback(err);
      });
      return;
    }
    if (file=='maps') {
      actionList.forEach(function (value) {
        eval("maps_90f36752_8815_4be8_b32b_d7fad1d0542e"+value[1]+'='+JSON.stringify(value[2]));
      });
      var datastr='maps_90f36752_8815_4be8_b32b_d7fad1d0542e = \n';
      //datastr+=JSON.stringify(maps_90f36752_8815_4be8_b32b_d7fad1d0542e,null,4);

      var emap={};
      var estr = JSON.stringify(maps_90f36752_8815_4be8_b32b_d7fad1d0542e,function(k,v){if(v.id!=null){var id_ = editor.guid();emap[id_]=JSON.stringify(v);return id_;}else return v},'\t');
      for(var id_ in emap){
          estr = estr.replace('"'+id_+'"',emap[id_])
      }
      datastr+=estr;

      fs.writeFile('project/maps.js',encode(datastr),'base64',function(err, data){
        callback(err);
      });
      return;
    }
    if (file=='items') {
      actionList.forEach(function (value) {
        eval("items_296f5d02_12fd_4166_a7c1_b5e830c9ee3a"+value[1]+'='+JSON.stringify(value[2]));
      });
      var datastr='items_296f5d02_12fd_4166_a7c1_b5e830c9ee3a = \n';
      datastr+=JSON.stringify(items_296f5d02_12fd_4166_a7c1_b5e830c9ee3a,null,'\t');
      fs.writeFile('project/items.js',encode(datastr),'base64',function(err, data){
        callback(err);
      });
      return;
    }
    if (file=='enemys') {
      actionList.forEach(function (value) {
        eval("enemys_fcae963b_31c9_42b4_b48c_bb48d09f3f80"+value[1]+'='+JSON.stringify(value[2]));
      });
      var datastr='enemys_fcae963b_31c9_42b4_b48c_bb48d09f3f80 = \n';
      var emap={};
      var estr = JSON.stringify(enemys_fcae963b_31c9_42b4_b48c_bb48d09f3f80,function(k,v){if(v.hp!=null){var id_ = editor.guid();emap[id_]=JSON.stringify(v);return id_;}else return v},'\t');
      for(var id_ in emap){
        estr = estr.replace('"'+id_+'"',emap[id_])
      }
      datastr+=estr;
      fs.writeFile('project/enemys.js',encode(datastr),'base64',function(err, data){
        callback(err);
      });
      return;
    }
    if (file=='data') {
      actionList.forEach(function (value) {
        eval("data_a1e2fb4a_e986_4524_b0da_9b7ba7c0874d"+value[1]+'='+JSON.stringify(value[2]));
      });
      if (data_a1e2fb4a_e986_4524_b0da_9b7ba7c0874d.main.floorIds.indexOf(data_a1e2fb4a_e986_4524_b0da_9b7ba7c0874d.firstData.floorId)<0)
        data_a1e2fb4a_e986_4524_b0da_9b7ba7c0874d.firstData.floorId = data_a1e2fb4a_e986_4524_b0da_9b7ba7c0874d.main.floorIds[0];
      var datastr='data_a1e2fb4a_e986_4524_b0da_9b7ba7c0874d = \n';
      datastr+=JSON.stringify(data_a1e2fb4a_e986_4524_b0da_9b7ba7c0874d,null,'\t');
      fs.writeFile('project/data.js',encode(datastr),'base64',function(err, data){
        callback(err);
      });
      return;
    }
    if (file=='functions') {
      actionList.forEach(function (value) {
        eval("fmap[fobj"+value[1]+']='+JSON.stringify(value[2]));
      });
      var fraw = fjson;
      for(var id_ in fmap){
        fraw = fraw.replace('"'+id_+'"',fmap[id_])
      }
      var datastr='functions_d6ad677b_427a_4623_b50f_a445a3b0ef8a = \n';
      datastr+=fraw;
      fs.writeFile('project/functions.js',encode(datastr),'base64',function(err, data){
        callback(err);
      });
      return;
    }
    if (file=='floors') {
      actionList.forEach(function (value) {
        eval("editor.currentFloorData"+value[1]+'='+JSON.stringify(value[2]));
      });
      editor_file.saveFloorFile(callback);
      return;
    }
    callback('出错了,要设置的文件名不识别');
  }

  /*
  $select({\"values\":[\"keys\",\"items\",\"constants\",\"tools\"]})$end
  $range(thiseval==~~thiseval &&thiseval>0)$end
  $leaf(true)$end
  $select({\"values\":[true]})$end
  $select({\"values\":[false]})$end
  $select({\"values\":[true,false]})$end

  */

  /* 
  所有注释中的特殊指令
  $range(evalstr:thiseval)$end
    限制取值范围,要求修改后的eval(evalstr)为true
  $leaf(evalstr:thiseval)$end
    强制指定为叶节点,如果eval(evalstr)为true

  //以下几个中选一个 [
  $select(evalstr)$end
    渲染成<select>,选项为数组eval(evalstr)['values']
  $input(evalstr)$end
    渲染成<input>
  $textarea(evalstr)$end
    渲染成<textarea>
  默认选项为$textarea()$end
  // ]
  
  */
  return editor_file;
}
//editor_file = editor_file(editor);