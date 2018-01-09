function editor_mode(){
  this.ids={
    'loc':'left2',
    'emenyitem':'left3',
    'floor':'left4',
    'tower':'left5',
    'test':'left99'
  }
  this._ids={}
  this.dom={}
  this.actionList=[];
  this.mode='';
  this.info={};
}

editor_mode.prototype.init = function(callback){

  Object.keys(editor_mode.ids).forEach(function(v){
    editor_mode.dom[v]=document.getElementById(editor_mode.ids[v]);
    editor_mode._ids[editor_mode.ids[v]]=v;
  });

  if (Boolean(callback))callback();
}

editor_mode.prototype.objToTable = function(obj,commentObj){
  var outstr=["\n<tr><td>条目</td><td>注释</td><td>值</td></tr>\n"];
  var guids=[];
  //深度优先遍历
  var recursionParse = function(tfield) {
    for(var ii in eval("obj"+tfield)){
      var field = tfield+"['"+ii+"']";
      var isleaf = editor_mode.checkIsLeaf(obj,commentObj,field);
      if (isleaf) {
        var leafnode = editor_mode.objToTr(obj,commentObj,field);
        outstr.push(leafnode[0]);
        guids.push(leafnode[1]);
      } else {
        outstr.push(["<tr><td>----</td><td>----</td><td>",field,"</td></tr>\n"].join(''));
        recursionParse(field);
      }
    }
  }
  recursionParse("");
  var listen = function(guids) {
    guids.forEach(function(guid){
      // tr>td[title=field]
      //   >td[title=comment]
      //   >td>div>input[value=thsieval]
      var thisTr = document.getElementById(guid);
      var input = thisTr.children[2].children[0].children[0];
      var field = thisTr.children[0].getAttribute('title');
      var comment = thisTr.children[1].getAttribute('title');
      input.onchange = function(){
        var node = thisTr.parentNode;
        while (!editor_mode._ids.hasOwnProperty(node.getAttribute('id'))) {
          node = node.parentNode;
        }
        editor_mode.onmode(editor_mode._ids[node.getAttribute('id')]);
        editor_mode.addAction(['change',field,JSON.parse(input.value)]);
        //尚未完成,目前没做$range的检查
      };
    });
  }
  return {"HTML":outstr.join(''),"guids":guids,"listen":listen};
}

editor_mode.prototype.checkIsLeaf = function(obj,commentObj,field){
  var thiseval = eval('obj'+field);
  if (thiseval == null || thiseval == undefined)return true;//null,undefined
  if (typeof(thiseval) == typeof(''))return true;//字符串
  if (Object.keys(thiseval).length == 0)return true;//数字,true,false,空数组,空对象
  try {
    var comment = eval('commentObj'+field);
    if( comment.indexOf('$leaf') != -1){
      evalstr = comment.split('$leaf')[1].split('$end')[0];
      if(eval(evalstr) === true)return true;
    }
  } catch (error) {}
  return false;
}

editor_mode.prototype.objToTr = function(obj,commentObj,field){
  var guid = editor_mode.guid();
  var thiseval = eval('obj'+field);
  var comment = '';
  try {
    comment = eval('commentObj'+field);
  } catch (error) {}

  var charlength=10;

  var shortField = field.split("']").slice(-2)[0].split("['").slice(-1)[0];
  shortField = (shortField.length<charlength?shortField:shortField.slice(0,charlength)+'...');

  var commentHTMLescape=comment.split('').map(function(v){return '&#'+v.charCodeAt(0)+';'}).join('');
  var shortCommentHTMLescape=(comment.length<charlength?commentHTMLescape:comment.slice(0,charlength).split('').map(function(v){return '&#'+v.charCodeAt(0)+';'}).join('')+'...');

  var outstr=['<tr id="',guid,'"><td title="',field,'">',shortField,'</td>',
  '<td title="',commentHTMLescape,'">',shortCommentHTMLescape,'</td>',
  '<td><div>',editor_mode.objToTd(thiseval,comment),'</div></td></tr>\n',
  ];
  return [outstr.join(''),guid];
}

editor_mode.prototype.objToTd = function(thiseval,comment){
  if( comment.indexOf('$select') != -1){
    var evalstr = comment.split('$select')[1].split('$end')[0];
    var values = eval(evalstr)['values'];
    var outstr = ['<select>\n',"<option value='",JSON.stringify(thiseval),"'>",JSON.stringify(thiseval),'</option>\n'];
    values.forEach(function(v){
      outstr.push(["<option value='",JSON.stringify(v),"'>",JSON.stringify(v),'</option>\n'].join(''))
    });
    outstr.push('</select>');
    return outstr.join('');
  } else if( comment.indexOf('$input') != -1){
    return ["<input spellcheck='false' value='",JSON.stringify(thiseval),"'/>\n"].join('');
  } else {
    //rows='",rows,"'
    return ["<textarea spellcheck='false' >",JSON.stringify(thiseval,null,4),'</textarea>\n'].join('');
  }
}

editor_mode.prototype.guid = function() {
  return 'id_'+'xxxxxxxx_xxxx_4xxx_yxxx_xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
    return v.toString(16);
  });
}

editor_mode.prototype.addAction = function(action){
  editor_mode.actionList.push(action);
}

editor_mode.prototype.doActionList = function(mode,actionList){
  if (actionList.length==0)return;
  //尚未完成
}

editor_mode.prototype.onmode = function (mode) {
  if (editor_mode.mode!=mode) {
    console.log('change mode into : '+mode);
    editor_mode.doActionList(editor_mode.mode,editor_mode.actionList);
    editor_mode.mode=mode;
    editor_mode.actionList=[];
  }
}

editor_mode.prototype.loc = function(callback){
  //editor.pos={x: 0, y: 0};
  if (!core.isset(editor.pos))return;
  document.getElementById('pos_a6771a78_a099_417c_828f_0a24851ebfce').innerText=editor.pos.x+','+editor.pos.y;

  var objs=[];
  editor_file.editLoc(editor,editor.pos.x,editor.pos.y,[],function(objs_){objs=objs_;console.log(objs_)});
  //只查询不修改时,内部实现不是异步的,所以可以这么写
  var tableinfo=editor_mode.objToTable(objs[0],objs[1]);
  document.getElementById('table_3d846fc4_7644_44d1_aa04_433d266a73df').innerHTML=tableinfo.HTML;
  tableinfo.listen(tableinfo.guids);

  if (Boolean(callback))callback();
}

editor_mode.prototype.emenyitem = function(callback){
  //editor.info=editor.ids[editor.indexs[201]];
  if (!core.isset(editor.info))return;
  editor_mode.info=editor.info;//避免editor.info被清空导致无法获得是物品还是怪物

  if (!core.isset(editor_mode.info.id)){
    return;
  }//尚未完成

  var objs=[];
  if (editor_mode.info.images=='enemys'){
    editor_file.editEnemy(editor,editor_mode.info.id,[],function(objs_){objs=objs_;console.log(objs_)});
  } else if (editor_mode.info.images=='items'){
    editor_file.editItem(editor,editor_mode.info.id,[],function(objs_){objs=objs_;console.log(objs_)});
  } else {
    return;
  }
  //只查询不修改时,内部实现不是异步的,所以可以这么写
  var tableinfo=editor_mode.objToTable(objs[0],objs[1]);
  document.getElementById('table_a3f03d4c_55b8_4ef6_b362_b345783acd72').innerHTML=tableinfo.HTML;
  tableinfo.listen(tableinfo.guids);

  if (Boolean(callback))callback();
}

editor_mode.prototype.floor = function(callback){
  var objs=[];
  editor_file.editFloor(editor,[],function(objs_){objs=objs_;console.log(objs_)});
  //只查询不修改时,内部实现不是异步的,所以可以这么写
  var tableinfo=editor_mode.objToTable(objs[0],objs[1]);
  document.getElementById('table_4a3b1b09_b2fb_4bdf_b9ab_9f4cdac14c74').innerHTML=tableinfo.HTML;
  tableinfo.listen(tableinfo.guids);
  if (Boolean(callback))callback();
}

editor_mode.prototype.tower = function(callback){
  var objs=[];
  editor.file.editTower(editor,[],function(objs_){objs=objs_;console.log(objs_)});
  //只查询不修改时,内部实现不是异步的,所以可以这么写
  var tableinfo=editor_mode.objToTable(objs[0],objs[1]);
  document.getElementById('table_b6a03e4c_5968_4633_ac40_0dfdd2c9cde5').innerHTML=tableinfo.HTML;
  tableinfo.listen(tableinfo.guids);
  if (Boolean(callback))callback();
}

editor_mode = new editor_mode();
editor_mode.init();