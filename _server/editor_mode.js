editor_mode = function(editor){
var core = editor.core;

function editor_mode(){
  this.ids={
    'loc':'left2',
    'emenyitem':'left3',
    'floor':'left4',
    'tower':'left5',
    'functions':'left8',

    'map':'left',
    'appendpic':'left1',
  }
  this._ids={}
  this.dom={}
  this.actionList=[];
  this.mode='';
  this.info={};
  this.appendPic={};
}
editor_mode.prototype.init = function(callback){
  if (Boolean(callback))callback();
}

editor_mode.prototype.init_dom_ids = function(callback){

  Object.keys(editor_mode.ids).forEach(function(v){
    editor_mode.dom[v]=document.getElementById(editor_mode.ids[v]);
    editor_mode._ids[editor_mode.ids[v]]=v;
  });

  if (Boolean(callback))callback();
}

/////////////////////////////////////////////////////////////////////////////
editor_mode.prototype.objToTable_ = function(obj,commentObj){
  var outstr=["\n<tr><td>条目</td><td>注释</td><td>值</td></tr>\n"];
  var guids=[];
  var defaultcobj={
    _type:'textarea',
    _data:'',
    _string:function(args){//object~[field,cfield,vobj,cobj]
      var thiseval = args.vobj;
      return (typeof(thiseval) === typeof('')) && thiseval[0]==='"';
    },
    _leaf:function(args){//object~[field,cfield,vobj,cobj]
      var thiseval = args.vobj;
      if (thiseval == null || thiseval == undefined)return true;//null,undefined
      if (typeof(thiseval) === typeof(''))return true;//字符串
      if (Object.keys(thiseval).length === 0)return true;//数字,true,false,空数组,空对象
      return false;
    },
  }
  var recursionParse = function(pfield,pcfield,pvobj,pcobj) {
    for(var ii in pvobj){
      var field = pfield+"['"+ii+"']";
      var cfield = pcfield+"['_data']['"+ii+"']";
      var vobj = pvobj[ii];
      var cobj = null;
      if(pcobj && pcobj['_data'] && pcobj['_data'][ii]){
        cobj = Object.assign({},defaultcobj,pcobj['_data'][ii]);
      } else {
        if(pcobj && (pcobj['_data'] instanceof Function))cobj = Object.assign({},defaultcobj,pcobj['_data'](ii));
        else cobj = Object.assign({},defaultcobj);
      }
      var args = {field:field,cfield:cfield,vobj:vobj,cobj:cobj}
      if(cobj._leaf instanceof Function)cobj._leaf=cobj._leaf(args);
      for(var key in cobj){
        if(key==='_data')continue;
        if(cobj[key] instanceof Function)cobj[key]=cobj[key](args);
      }
      if (cobj._leaf) {
        var leafnode = editor_mode.objToTr_(obj,commentObj,field,cfield,vobj,cobj);
        outstr.push(leafnode[0]);
        guids.push(leafnode[1]);
      } else {
        outstr.push(["<tr><td>----</td><td>----</td><td>",field,"</td></tr>\n"].join(''));
        recursionParse(field,cfield,vobj,cobj);
      }
    }
  }
  recursionParse("","",obj,commentObj);
  var checkRange = function(evalstr,thiseval){
    if(evalstr){
      return eval(evalstr);
    }
    return true;
  }
  var listen = function(guids) {
    guids.forEach(function(guid){
      // tr>td[title=field]
      //   >td[title=comment,cobj=cobj:json]
      //   >td>div>input[value=thiseval]
      var thisTr = document.getElementById(guid);
      var input = thisTr.children[2].children[0].children[0];
      var field = thisTr.children[0].getAttribute('title');
      var cobj = JSON.parse(thisTr.children[1].getAttribute('cobj'));
      input.onchange = function(){
        var node = thisTr.parentNode;
        while (!editor_mode._ids.hasOwnProperty(node.getAttribute('id'))) {
          node = node.parentNode;
        }
        editor_mode.onmode(editor_mode._ids[node.getAttribute('id')]);
        var thiseval=null;
        if(input.checked!=null)input.value=input.checked;
        try{
          thiseval = JSON.parse(input.value);
        }catch(ee){
          printe(field+' : '+ee);
          throw ee;
        }
        if(checkRange(cobj._range,thiseval)){
          editor_mode.addAction(['change',field,thiseval]);
          editor_mode.onmode('save');//自动保存
        } else {
          printe(field+' : 输入的值不合要求,请鼠标放置在注释上查看说明');
        }
      }
      input.ondblclick = function(){
        if(cobj._type==='event')editor_blockly.import(guid,{type:cobj._event});
        if(cobj._type==='textarea')editor_multi.import(guid,{lint:cobj._lint});
        
      }
    });
  }
  return {"HTML":outstr.join(''),"guids":guids,"listen":listen};
}

editor_mode.prototype.objToTr_ = function(obj,commentObj,field,cfield,vobj,cobj){
  var guid = editor.guid();
  var thiseval = vobj;
  var comment = cobj._data;

  var charlength=10;

  var shortField = field.split("']").slice(-2)[0].split("['").slice(-1)[0];
  shortField = (shortField.length<charlength?shortField:shortField.slice(0,charlength)+'...');

  var commentHTMLescape=editor.HTMLescape(comment);
  var shortCommentHTMLescape=(comment.length<charlength?commentHTMLescape:editor.HTMLescape(comment.slice(0,charlength))+'...');

  var cobjstr = Object.assign({},cobj);
  delete cobjstr._data;
  cobjstr = editor.HTMLescape(JSON.stringify(cobjstr));

  var outstr=['<tr id="',guid,'"><td title="',field,'">',shortField,'</td>',
  '<td title="',commentHTMLescape,'" cobj="',cobjstr,'">',shortCommentHTMLescape,'</td>',
  '<td><div class="etableInputDiv">',editor_mode.objToTd_(obj,commentObj,field,cfield,vobj,cobj),'</div></td></tr>\n',
  ];
  return [outstr.join(''),guid];
}

editor_mode.prototype.objToTd_ = function(obj,commentObj,field,cfield,vobj,cobj){
  var thiseval = vobj;
  if(cobj._select){
    var values = cobj._select.values;
    var outstr = ['<select>\n',"<option value='",JSON.stringify(thiseval),"'>",JSON.stringify(thiseval),'</option>\n'];
    values.forEach(function(v){
      outstr.push(["<option value='",JSON.stringify(v),"'>",JSON.stringify(v),'</option>\n'].join(''))
    });
    outstr.push('</select>');
    return outstr.join('');
  } else if(cobj._input){
    return ["<input type='text' spellcheck='false' value='",JSON.stringify(thiseval),"'/>\n"].join('');
  } else if(cobj._bool){
    return ["<input type='checkbox' ",(thiseval?'checked ':''),"/>\n"].join('');
  } else {
    var num = 0;//editor_mode.indent(field);
    return ["<textarea spellcheck='false' >",JSON.stringify(thiseval,null,num),'</textarea>\n'].join('');
  }
}

editor_mode.prototype.indent = function(field){
  var num = '\t';
  if(field.indexOf("['main']")===0)return 0;
  if(field.indexOf("['flyRange']")!==-1)return 0;
  if(field==="['special']")return 0;
  return num;
}

editor_mode.prototype.addAction = function(action){
  editor_mode.actionList.push(action);
}

editor_mode.prototype.doActionList = function(mode,actionList){
  if (actionList.length==0)return;
  printf('修改中...');
  switch (mode) {
    case 'loc':

      editor.file.editLoc(editor_mode.pos.x,editor_mode.pos.y,actionList,function(objs_){/*console.log(objs_);*/if(objs_.slice(-1)[0]!=null){printe(objs_.slice(-1)[0]);throw(objs_.slice(-1)[0])};printf('修改成功')});
      break;
    case 'emenyitem':

      if (editor_mode.info.images=='enemys'||editor_mode.info.images=='enemy48'){
        editor.file.editEnemy(editor_mode.info.id,actionList,function(objs_){/*console.log(objs_);*/if(objs_.slice(-1)[0]!=null){printe(objs_.slice(-1)[0]);throw(objs_.slice(-1)[0])};printf('修改成功')});
      } else if (editor_mode.info.images=='items'){
        editor.file.editItem(editor_mode.info.id,actionList,function(objs_){/*console.log(objs_);*/if(objs_.slice(-1)[0]!=null){printe(objs_.slice(-1)[0]);throw(objs_.slice(-1)[0])};printf('修改成功')});
      } else {
        editor.file.editMapBlocksInfo(editor_mode.info.idnum,actionList,function(objs_){/*console.log(objs_);*/if(objs_.slice(-1)[0]!=null){printe(objs_.slice(-1)[0]);throw(objs_.slice(-1)[0])};printf('修改成功')});
      }
      break;
    case 'floor':
      
      editor.file.editFloor(actionList,function(objs_){/*console.log(objs_);*/if(objs_.slice(-1)[0]!=null){printe(objs_.slice(-1)[0]);throw(objs_.slice(-1)[0])};printf('修改成功')});
      break;
    case 'tower':
      
      editor.file.editTower(actionList,function(objs_){/*console.log(objs_);*/if(objs_.slice(-1)[0]!=null){printe(objs_.slice(-1)[0]);throw(objs_.slice(-1)[0])};printf('修改成功')});
      break;
    case 'functions':
      
      editor.file.editFunctions(actionList,function(objs_){/*console.log(objs_);*/if(objs_.slice(-1)[0]!=null){printe(objs_.slice(-1)[0]);throw(objs_.slice(-1)[0])};printf('修改成功')});
      break;
    default:
      break;
  }
}

editor_mode.prototype.onmode = function (mode) {
  if (editor_mode.mode!=mode) {
    if(mode==='save')editor_mode.doActionList(editor_mode.mode,editor_mode.actionList);
    if(editor_mode.mode==='nextChange' && mode)editor_mode.showMode(mode);
    editor_mode.mode=mode;
    editor_mode.actionList=[];
  }
}

editor_mode.prototype.showMode = function (mode) {
  for(var name in this.dom){
    editor_mode.dom[name].style='z-index:-1;opacity: 0;';
  }
  editor_mode.dom[mode].style='';
  if(editor_mode[mode])editor_mode[mode]();
  document.getElementById('editModeSelect').value=mode;
  var tips = tip_in_showMode;
  if(!selectBox.isSelected)printf('tips: '+tips[~~(tips.length*Math.random())]);
}

editor_mode.prototype.loc = function(callback){
  //editor.pos={x: 0, y: 0};
  if (!core.isset(editor.pos))return;
  editor_mode.pos=editor.pos;
  document.getElementById('pos_a6771a78_a099_417c_828f_0a24851ebfce').innerText=editor_mode.pos.x+','+editor_mode.pos.y;

  var objs=[];
  editor.file.editLoc(editor_mode.pos.x,editor_mode.pos.y,[],function(objs_){objs=objs_;/*console.log(objs_)*/});
  //只查询不修改时,内部实现不是异步的,所以可以这么写
  var tableinfo=editor_mode.objToTable_(objs[0],objs[1]);
  document.getElementById('table_3d846fc4_7644_44d1_aa04_433d266a73df').innerHTML=tableinfo.HTML;
  tableinfo.listen(tableinfo.guids);

  if (Boolean(callback))callback();
}

editor_mode.prototype.emenyitem = function(callback){
  //editor.info=editor.ids[editor.indexs[201]];
  if (!core.isset(editor.info))return;
  
  if(Object.keys(editor.info).length!==0)editor_mode.info=editor.info;//避免editor.info被清空导致无法获得是物品还是怪物

  if (!core.isset(editor_mode.info.id)){
    document.getElementById('table_a3f03d4c_55b8_4ef6_b362_b345783acd72').innerHTML='';
    document.getElementById('newIdIdnum').style.display='';
    return;
  }
  document.getElementById('newIdIdnum').style.display='none';

  var objs=[];
  if (editor_mode.info.images=='enemys' || editor_mode.info.images=='enemy48'){
    editor.file.editEnemy(editor_mode.info.id,[],function(objs_){objs=objs_;/*console.log(objs_)*/});
  } else if (editor_mode.info.images=='items'){
    editor.file.editItem(editor_mode.info.id,[],function(objs_){objs=objs_;/*console.log(objs_)*/});
  } else {
    /* document.getElementById('table_a3f03d4c_55b8_4ef6_b362_b345783acd72').innerHTML='';
    return; */
    editor.file.editMapBlocksInfo(editor_mode.info.idnum,[],function(objs_){objs=objs_;/*console.log(objs_)*/});
  }
  //只查询不修改时,内部实现不是异步的,所以可以这么写
  var tableinfo=editor_mode.objToTable_(objs[0],objs[1]);
  document.getElementById('table_a3f03d4c_55b8_4ef6_b362_b345783acd72').innerHTML=tableinfo.HTML;
  tableinfo.listen(tableinfo.guids);

  if (Boolean(callback))callback();
}

editor_mode.prototype.floor = function(callback){
  var objs=[];
  editor.file.editFloor([],function(objs_){objs=objs_;/*console.log(objs_)*/});
  //只查询不修改时,内部实现不是异步的,所以可以这么写
  var tableinfo=editor_mode.objToTable_(objs[0],objs[1]);
  document.getElementById('table_4a3b1b09_b2fb_4bdf_b9ab_9f4cdac14c74').innerHTML=tableinfo.HTML;
  tableinfo.listen(tableinfo.guids);
  if (Boolean(callback))callback();
}

editor_mode.prototype.tower = function(callback){
  var objs=[];
  editor.file.editTower([],function(objs_){objs=objs_;/*console.log(objs_)*/});
  //只查询不修改时,内部实现不是异步的,所以可以这么写
  var tableinfo=editor_mode.objToTable_(objs[0],objs[1]);
  document.getElementById('table_b6a03e4c_5968_4633_ac40_0dfdd2c9cde5').innerHTML=tableinfo.HTML;
  tableinfo.listen(tableinfo.guids);
  if (Boolean(callback))callback();
}

editor_mode.prototype.functions = function(callback){
  var objs=[];
  editor.file.editFunctions([],function(objs_){objs=objs_;/*console.log(objs_)*/});
  //只查询不修改时,内部实现不是异步的,所以可以这么写
  var tableinfo=editor_mode.objToTable_(objs[0],objs[1]);
  document.getElementById('table_e260a2be_5690_476a_b04e_dacddede78b3').innerHTML=tableinfo.HTML;
  tableinfo.listen(tableinfo.guids);
  if (Boolean(callback))callback();
}

/////////////////////////////////////////////////////////////////////////////

editor_mode.prototype.listen = function(callback){

  var newIdIdnum = document.getElementById('newIdIdnum');
  newIdIdnum.children[2].onclick = function(){
    if (newIdIdnum.children[0].value && newIdIdnum.children[1].value){
      var id = newIdIdnum.children[0].value;
      var idnum = parseInt(newIdIdnum.children[1].value);
      if (!core.isset(idnum)) {
          printe('不合法的idnum');
          return;
      }
      editor.file.changeIdAndIdnum(id,idnum,editor_mode.info,function(err){
        if(err){printe(err);throw(err)}
        printe('添加id的idnum成功,请F5刷新编辑器');
      });
    } else {
      printe('请输入id和idnum');
    }
  }

  var selectFloor = document.getElementById('selectFloor');
  editor.file.getFloorFileList(function(floors){
    var outstr=[];
    floors[0].forEach(function(floor){
      outstr.push(["<option value='",floor,"'>",floor,'</option>\n'].join(''));
    });
    selectFloor.innerHTML=outstr.join('');
    selectFloor.value=core.status.floorId;
    selectFloor.onchange = function(){
      editor_mode.onmode('nextChange');
      editor_mode.onmode('floor');
      editor.changeFloor(selectFloor.value);
    }
  });

  var saveFloor = document.getElementById('saveFloor');
  saveFloor.onclick = function(){
    editor_mode.onmode('');
    editor.file.saveFloorFile(function(err){if(err){printe(err);throw(err)};printf('保存成功');});
  }

  var saveFloorAs = document.getElementById('saveFloorAs');
  var saveAsName = document.getElementById('saveAsName');
  saveFloorAs.onclick = function(){
    if (!saveAsName.value)return;
    editor_mode.onmode('');
    editor.file.saveFloorFileAs(saveAsName.value,function(err){
      if(err){printe(err);throw(err)}
      core.floorIds.push(saveAsName.value);
      editor.file.editTower([['change',"['main']['floorIds']",core.floorIds]],function(objs_){/*console.log(objs_);*/if(objs_.slice(-1)[0]!=null){printe(objs_.slice(-1)[0]);throw(objs_.slice(-1)[0])};printe('另存为成功,请F5刷新编辑器生效');});
    });
  }

  var ratio=1;
  var appendPicCanvas = document.getElementById('appendPicCanvas');
  var bg = appendPicCanvas.children[0];
  var source = appendPicCanvas.children[1];
  var picClick = appendPicCanvas.children[2];
  var sprite = appendPicCanvas.children[3];
  var appendPicSelection = document.getElementById('appendPicSelection');

  var selectAppend = document.getElementById('selectAppend');
  var selectAppend_str=[];
  ["terrains", "animates", "enemys", "enemy48", "items", "npcs", "npc48"].forEach(function(image){
    selectAppend_str.push(["<option value='",image,"'>",image,'</option>\n'].join(''));
  });
  selectAppend.innerHTML=selectAppend_str.join('');
  selectAppend.onchange = function(){
    var value = selectAppend.value;
    var ysize = selectAppend.value.indexOf('48')===-1?32:48;
    editor_mode.appendPic.imageName = value;
    var img = editor.material.images[value];
    editor_mode.appendPic.toImg = img;
    var num = ~~img.width/32;
    editor_mode.appendPic.num = num;
    editor_mode.appendPic.index = 0;
    var selectStr = '';
    for(var ii=0;ii<num;ii++){
      appendPicSelection.children[ii].style='left:0;top:0;height:'+(ysize-6)+'px';
      selectStr+='{"x":0,"y":0},'
    }
    editor_mode.appendPic.selectPos = eval('['+selectStr+']');
    for(var jj=num;jj<4;jj++){
      appendPicSelection.children[jj].style='display:none';
    }
    sprite.style.width = (sprite.width = img.width)/ratio + 'px';
    sprite.style.height = (sprite.height = img.height+ysize)/ratio + 'px';
    sprite.getContext('2d').drawImage(img, 0, 0);
  }
  selectAppend.onchange();

  var selectFileBtn = document.getElementById('selectFileBtn');
  selectFileBtn.onclick = function(){
    var loadImage = function (content, callback) {
      var image = new Image();
      try {
        image.src = content;
        if (image.complete) {
          callback(image);
          return;
        }
        image.onload = function () {
          callback(image);
        }
      }
      catch (e) {
        printe(e);
      }
    }
    core.readFile(function(content){
      loadImage(content,function(image){
        editor_mode.appendPic.img = image;
        editor_mode.appendPic.width = image.width;
        editor_mode.appendPic.height = image.height;
        var ysize = selectAppend.value.indexOf('48')===-1?32:48;
        for(var ii=0;ii<3;ii++){
          var newsprite = appendPicCanvas.children[ii];
          newsprite.style.width = (newsprite.width = Math.floor(image.width/32)*32)/ratio + 'px';
          newsprite.style.height = (newsprite.height = Math.floor(image.height/ysize)*ysize)/ratio + 'px';
        }

        //画灰白相间的格子
        var bgc = bg.getContext('2d');
        var colorA = ["#f8f8f8", "#cccccc"];
        var colorIndex;
        var sratio=4;
        for (var ii = 0; ii < image.width/32*sratio; ii++){
          colorIndex = 1-ii%2;
          for (var jj = 0; jj < image.height/32*sratio; jj++) {
            bgc.fillStyle = colorA[colorIndex];
            colorIndex = 1 - colorIndex;
            bgc.fillRect(ii * 32/sratio, jj * 32/sratio, 32/sratio, 32/sratio);
          }
        }
        
        //把导入的图片画出
        source.getContext('2d').drawImage(image, 0, 0);

        //重置临时变量
        selectAppend.onchange();
      });
    },null,'img');

    return;
  }

  var left1 = document.getElementById('left1');
  var eToLoc = function (e) { 
    var scrollLeft = document.documentElement.scrollLeft || document.body.scrollLeft
    var scrollTop = document.documentElement.scrollTop || document.body.scrollTop
    var loc = { 
      'x': scrollLeft+e.clientX + appendPicCanvas.scrollLeft  - left1.offsetLeft-appendPicCanvas.offsetLeft, 
      'y': scrollTop+e.clientY + appendPicCanvas.scrollTop - left1.offsetTop-appendPicCanvas.offsetTop, 
      'size': 32, 
      'ysize': selectAppend.value.indexOf('48')===-1?32:48
    };
    return loc; 
  }//返回可用的组件内坐标

  var locToPos = function (loc) {
    var pos = { 'x': ~~(loc.x / loc.size), 'y': ~~(loc.y / loc.ysize) ,'ysize': loc.ysize}
    return pos;
  }
  
  picClick.onclick = function(e){
    var loc = eToLoc(e);
    var pos = locToPos(loc);
    /*console.log(e,loc,pos);*/
    var num = editor_mode.appendPic.num;
    var ii = editor_mode.appendPic.index;
    if(ii+1>=num)editor_mode.appendPic.index=ii+1-num;
    else editor_mode.appendPic.index++;
    editor_mode.appendPic.selectPos[ii]=pos;
    appendPicSelection.children[ii].style=[
      'left:',pos.x*32,'px;',
      'top:',pos.y*pos.ysize,'px;',
      'height:',pos.ysize-6,'px;'
    ].join('');
  }

  var appendConfirm = document.getElementById('appendConfirm');
  appendConfirm.onclick = function(){
    var ysize = selectAppend.value.indexOf('48')===-1?32:48;
    var sprited = sprite.getContext('2d');
    //sprited.drawImage(img, 0, 0);
    var height = editor_mode.appendPic.toImg.height;
    var sourced = source.getContext('2d');
    for(var ii=0,v;v=editor_mode.appendPic.selectPos[ii];ii++){
      var imgData=sourced.getImageData(v.x*32,v.y*ysize,32,ysize);
      sprited.putImageData(imgData,ii*32,height);
    }
    var imgbase64 = sprite.toDataURL().split(',')[1];
    fs.writeFile('./project/images/'+editor_mode.appendPic.imageName+'.png',imgbase64,'base64',function(err,data){
      if(err){printe(err);throw(err)}
      printe('追加素材成功,请F5刷新编辑器');
    });
  }

  var editModeSelect = document.getElementById('editModeSelect');
  editModeSelect.onchange = function(){
    editor_mode.onmode('nextChange');
    editor_mode.onmode(editModeSelect.value);
  }

  if (Boolean(callback))callback();
}

var editor_mode = new editor_mode();
editor_mode.init_dom_ids();

return editor_mode;
}
//editor_mode = editor_mode(editor);