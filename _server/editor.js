function editor() {
  this.version = "2.0";
  this.material = {};
}

editor.prototype.init = function(callback){
  var afterCoreReset = function(){

    main.editor.disableGlobalAnimate=false;//允许GlobalAnimate
    /* core.setHeroMoveTriggerInterval(); */
    
    editor.reset(function(){
      editor.drawMapBg();
      var mapArray = core.maps.save(core.status.maps,core.status.floorId);
      editor.map = mapArray.map(function(v){return v.map(function(v){return editor.ids[[editor.indexs[parseInt(v)][0]]]})});
      editor.updateMap();
      editor.currentFloorId=core.status.floorId;
      editor.currentFloorData = core.floors[core.status.floorId];

      if (Boolean(callback))callback();
    });
  }

  var afterMainInit = function(){
    core.floors=JSON.parse(JSON.stringify(core.floors,function(k,v){if(v instanceof Function){return v.toString()}else return v}));
    core.data=JSON.parse(JSON.stringify(core.data,function(k,v){if(v instanceof Function){return v.toString()}else return v}));
    data_a1e2fb4a_e986_4524_b0da_9b7ba7c0874d=JSON.parse(JSON.stringify(data_a1e2fb4a_e986_4524_b0da_9b7ba7c0874d,function(k,v){if(v instanceof Function){return v.toString()}else return v}));
    editor.main=main;
    editor.core=core;
    editor.fs=fs;
    editor_file = editor_file(editor, function() {
      editor.file=editor_file;
      editor_mode = editor_mode(editor);
      editor.mode=editor_mode;
      editor.material.images=core.material.images;
      editor.listen(); // 开始监听事件
      core.resetStatus(core.firstData.hero, null, core.firstData.floorId, null, core.initStatus.maps);
      core.changeFloor(core.status.floorId, null, core.firstData.hero.loc, null, function() {
          afterCoreReset();
      }, true);
      core.events.setInitData(null);
    });
  }
  afterMainInit();
}

editor.prototype.reset = function(callback){
  editor.idsInit(core.maps, core.icons.icons); // 初始化图片素材信息
  editor.drawInitData(core.icons.icons); // 初始化绘图
  if(Boolean(callback))callback();
}

editor.prototype.idsInit = function(maps, icons){
  editor.ids = [0];
  editor.indexs = [];
  var MAX_NUM = 1000;
  var getInfoById = function(id){
    var block = maps.initBlock(0, 0, id);
    if(hasOwnProp(block, 'event')){
      return block;
    }
  }
  var point = 0;
  for(var i=0; i<MAX_NUM; i++){
    var indexBlock = getInfoById(i);
    editor.indexs[i] = [];
    if(indexBlock){
      var id = indexBlock.event.id;
      var indexId = indexBlock.id;
      var allCls = Object.keys(icons);
      for(var j=0; j<allCls.length; j++){
        if(id in icons[allCls[j]] ){
          editor.ids.push({'idnum':indexId,'id':id,'images':allCls[j],'y':icons[allCls[j]][id]});
          point++;
          editor.indexs[i].push(point);
        }
      }
    }
  }
  editor.indexs[0]=[0];
}
editor.prototype.drawInitData = function (icons) {
  var ratio=1;
  var images=editor.material.images;
  var maxHeight=700;
  var sumWidth=0;
  editor.widthsX={};
  // var imgNames = Object.keys(images);  //还是固定顺序吧；
  var imgNames = ["terrains", "animates", "enemys", "enemy48", "items", "npcs", "npc48", "autotile"];
  
  for(var ii=0; ii<imgNames.length; ii++){
    var img=imgNames[ii], tempy = 0;
    if(img == 'autotile'){
      var autotiles = images[img];
      for(var im in autotiles){
        tempy += autotiles[im].height;
      }
      editor.widthsX[img]=[img, sumWidth/32, (sumWidth+3*32)/32, tempy];
      sumWidth += 3*32;
      maxHeight = Math.max(maxHeight, tempy);
      continue;
    }
    if(img == 'terrains'){
      editor.widthsX[img]=[img, sumWidth/32, (sumWidth+images[img].width)/32, images[img].height+32]
      sumWidth += images[img].width;
      maxHeight = Math.max(maxHeight, images[img].height+32);
      continue;
    }
    editor.widthsX[img]=[img, sumWidth/32, (sumWidth+images[img].width)/32, images[img].height];
    sumWidth += images[img].width;
    maxHeight = Math.max(maxHeight, images[img].height);
  }
  var fullWidth=~~(sumWidth*ratio);
  var fullHeight=~~(maxHeight*ratio);

  if (fullWidth > edata.width) edata.style.width = (edata.width = fullWidth)/ratio + 'px';
  edata.style.height = (edata.height = fullHeight)/ratio + 'px';
  var dc = edata.getContext('2d');
  var nowx = 0;
  var nowy = 0;
  for(var ii=0; ii<imgNames.length; ii++){
    var img=imgNames[ii];
    if(img == 'terrains'){
      dc.drawImage(images[img], nowx, 32);
      nowx += images[img].width;
      continue;
    }
    if(img == 'autotile'){
      var autotiles = images[img];
      for(var im in autotiles){
        dc.drawImage(autotiles[im], nowx, nowy);
        nowy += autotiles[im].height;
      }
      continue;
    }
    dc.drawImage(images[img], nowx, 0)
    nowx += images[img].width;
  }
  bgSelect.bgs = Object.keys(icons.terrains);
  //editor.drawMapBg();
  //editor.mapInit();
}
editor.prototype.mapInit = function(){
  var ec = document.getElementById('event').getContext('2d');
  ec.clearRect(0, 0, 416, 416);
  document.getElementById('event2').getContext('2d').clearRect(0,0,416,416);
  editor.map = [];
  for(var y=0; y<13; y++){
    editor.map[y] = [];
    for(var x = 0; x<13; x++){
      editor.map[y][x] = 0;
    }
  }
  editor.currentFloorData.map=editor.map;
  editor.currentFloorData.firstArrive=[];
  editor.currentFloorData.events={};
  editor.currentFloorData.changeFloor={};
  editor.currentFloorData.afterBattle={};
  editor.currentFloorData.afterGetItem={};
  editor.currentFloorData.afterOpenDoor={};
  editor.currentFloorData.cannotMove={};
}
editor.prototype.drawMapBg = function(img){
  var bgc = bg.getContext('2d');
  if (!core.isset(editor.bgY) || editor.bgY == 0){
    editor.main.editor.drawMapBg();
    return;
  }

  for (var ii = 0; ii < 13; ii++)
    for (var jj = 0; jj < 13; jj++) {
      bgc.clearRect(ii*32, jj*32, 32, 32);
      bgc.drawImage(editor.material.images['terrains'], 0, 32*(editor.bgY||0), 32, 32, ii*32, jj*32, 32, 32);
    }
  if(img){
    bgc.drawImage(img, 0, 0, 416, 416);
  }
}

editor.prototype.updateMap = function(){
  var blocks = main.editor.mapIntoBlocks(editor.map.map(function(v){return v.map(function(v){return v.idnum||v||0})}),{'events':{},'changeFloor':{}});
  core.status.thisMap.blocks = blocks;
  main.editor.updateMap();

  var drawTile = function(ctx, x, y, tileInfo){ // 绘制一个普通块

    //ctx.clearRect(x*32, y*32, 32, 32);
    if(tileInfo == 0) return;

    if(typeof(tileInfo) == typeof([][0]) || !hasOwnProp(tileInfo, 'idnum')) {//未定义块画红块
      if(typeof(tileInfo) != typeof([][0]) && hasOwnProp(tileInfo, 'images')){
        ctx.drawImage(editor.material.images[tileInfo.images], 0, tileInfo.y*32, 32, 32, x*32, y*32, 32, 32);
      }
      ctx.strokeStyle = 'red';
      var OFFSET = 2;
      ctx.lineWidth = OFFSET;
      ctx.strokeRect(x*32+OFFSET, y*32+OFFSET, 32-OFFSET*2, 32-OFFSET*2);
      ctx.font = "30px Verdana";
      ctx.textAlign = 'center'
      ctx.fillStyle = 'red';
      ctx.fillText("?", x*32+16, y*32+27);
      return;
    } 
    //ctx.drawImage(editor.material.images[tileInfo.images], 0, tileInfo.y*32, 32, 32, x*32, y*32, 32, 32); 
  }
  /*
  // autotile的相关处理
  var indexArrs = [ //16种组合的图块索引数组; // 将autotile分割成48块16*16的小块; 数组索引即对应各个小块
  //                                       +----+----+----+----+----+----+
    [10,  9,  4, 3 ],  //0   bin:0000      | 1  | 2  | 3  | 4  | 5  | 6  |
    [10,  9,  4, 13],  //1   bin:0001      +----+----+----+----+----+----+
    [10,  9, 18, 3 ],  //2   bin:0010      | 7  | 8  | 9  | 10 | 11 | 12 |
    [10,  9, 16, 15],  //3   bin:0011      +----+----+----+----+----+----+
    [10, 43,  4, 3 ],  //4   bin:0100      | 13 | 14 | 15 | 16 | 17 | 18 |
    [10, 31,  4, 25],  //5   bin:0101      +----+----+----+----+----+----+
    [10,  7,  2, 3 ],  //6   bin:0110      | 19 | 20 | 21 | 22 | 23 | 24 |
    [10, 31, 16, 5 ],  //7   bin:0111      +----+----+----+----+----+----+
    [48,  9,  4, 3 ],  //8   bin:1000      | 25 | 26 | 27 | 28 | 29 | 30 |
    [ 8,  9,  4, 1 ],  //9   bin:1001      +----+----+----+----+----+----+
    [36,  9, 30, 3 ],  //10  bin:1010      | 31 | 32 | 33 | 34 | 35 | 36 |
    [36,  9,  6, 15],  //11  bin:1011      +----+----+----+----+----+----+
    [46, 45,  4, 3 ],  //12  bin:1100      | 37 | 38 | 39 | 40 | 41 | 42 |
    [46, 11,  4, 25],  //13  bin:1101      +----+----+----+----+----+----+
    [12, 45, 30, 3 ],  //14  bin:1110      | 43 | 44 | 45 | 46 | 47 | 48 |
    [34, 33, 28, 27]   //15  bin:1111      +----+----+----+----+----+----+
  ];
  var drawBlockByIndex = function(ctx, dx, dy, autotileImg, index){ //index为autotile的图块索引1-48
    var sx = 16*((index-1)%6), sy = 16*(~~((index-1)/6));
    ctx.drawImage(autotileImg, sx, sy, 16, 16, dx, dy, 16, 16);
  }
  var isAutotile = function(info){
    if(typeof(info)=='object' && hasOwnProp(info, 'images') && info.images=='autotile') return true;
    return false;
  }
  var getAutotileAroundId = function(currId, x, y){ //与autotile当前idnum一致返回1，否则返回0
    if(x>=0 && y >=0 && x<13 && y<13 && isAutotile(editor.map[y][x]) && editor.map[y][x].idnum == currId)
      return 1;
    else if(x<0 || y<0 || x>12 || y>12) return 1; //边界外视为通用autotile，这样好看些
    else
      return 0;
  }
  var checkAround = function(x, y){ // 得到周围四个32*32块（周围每块都包含当前块的1/4，不清楚的话画下图你就明白）的数组索引
    var currId = editor.map[y][x].idnum;
    var pointBlock = [];
    for(var i=0; i<4; i++){
      var bsum = 0;
      var offsetx = i%2, offsety = ~~(i/2);
      for(var j=0; j<4; j++){
        var mx = j%2, my = ~~(j/2);
        var b = getAutotileAroundId(currId, x+offsetx+mx-1, y+offsety+my-1);
        bsum += b*(Math.pow(2, 3-j));
      }
      pointBlock.push(bsum);
    }
    return pointBlock;
  }
  var addIndexToAutotileInfo = function(x, y){
    var indexArr = [];
    var pointBlocks = checkAround(x, y);
    for(var i=0; i<4; i++){
      var arr = indexArrs[pointBlocks[i]]
      indexArr.push(arr[3-i]);
    }
    editor.map[y][x].blockIndex = indexArr;
  }
  var drawAutotile = function(ctx, x, y, info){ // 绘制一个autotile
    ctx.clearRect(x*32, y*32, 32, 32);
    //修正四个边角的固定搭配
    if(info.blockIndex[0] == 13){
      if(info.blockIndex[1] == 16) info.blockIndex[1] = 14;
      if(info.blockIndex[2] == 31) info.blockIndex[2] = 19;
    }
    if(info.blockIndex[1] == 18){
      if(info.blockIndex[0] == 15) info.blockIndex[0] = 17;
      if(info.blockIndex[3] == 36) info.blockIndex[3] = 24;
    }
    if(info.blockIndex[2] == 43){
      if(info.blockIndex[0] == 25) info.blockIndex[0] = 37;
      if(info.blockIndex[3] == 46) info.blockIndex[3] = 44;
    }
    if(info.blockIndex[3] == 48){
      if(info.blockIndex[1] == 30) info.blockIndex[1] = 42;
      if(info.blockIndex[2] == 45) info.blockIndex[2] = 47;
    }
    for(var i=0; i<4; i++){
      var index = info.blockIndex[i];
      var dx = x*32 + 16*(i%2), dy = y*32 + 16*(~~(i/2));
      drawBlockByIndex(ctx, dx, dy, editor.material.images[info.images][info.id], index);
    }
  }
  */
  // 绘制地图 start
  var eventCtx = document.getElementById('event').getContext("2d");
  for(var y=0; y<13; y++)
    for(var x=0; x<13; x++){
      var tileInfo = editor.map[y][x];
      if(false && isAutotile(tileInfo)){
        addIndexToAutotileInfo(x, y);
        drawAutotile(eventCtx, x, y, tileInfo);
      }else drawTile(eventCtx, x, y, tileInfo);
    }
  // 绘制地图 end
}

editor.prototype.changeFloor = function(floorId,callback) {
  editor.currentFloorData.map = editor.map.map(function(v){return v.map(function(v){return v.idnum||v||0})});
  core.changeFloor(floorId, null, core.firstData.hero.loc, null, function(){
    editor.drawMapBg();
    var mapArray = core.maps.save(core.status.maps,core.status.floorId);
    editor.map = mapArray.map(function(v){return v.map(function(v){return editor.ids[[editor.indexs[parseInt(v)][0]]]})});
    editor.updateMap();
    editor.currentFloorId=core.status.floorId;
    editor.currentFloorData = core.floors[core.status.floorId];
    editor_mode.floor();
    if (core.isset(callback))callback();
  });
}

editor.prototype.guid = function() {
  return 'id_'+'xxxxxxxx_xxxx_4xxx_yxxx_xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
    return v.toString(16);
  });
}

editor.prototype.HTMLescape = function(str_) {
  return String(str_).split('').map(function(v){return '&#'+v.charCodeAt(0)+';'}).join('');
}

editor.prototype.listen = function() {

  var uc = eui.getContext('2d');

  function fillPos(pos) {
    uc.fillStyle = '#' + ~~(Math.random() * 8) + ~~(Math.random() * 8) + ~~(Math.random() * 8);
    uc.fillRect(pos.x * 32 + 12, pos.y * 32 + 12, 8, 8);
  }//在格子内画一个随机色块

  function eToLoc(e) { 
    var scrollLeft = document.documentElement.scrollLeft || document.body.scrollLeft
    var scrollTop = document.documentElement.scrollTop || document.body.scrollTop
    editor.loc = { 
      'x': scrollLeft+e.clientX - mid.offsetLeft-mapEdit.offsetLeft, 
      'y': scrollTop+e.clientY - mid.offsetTop-mapEdit.offsetTop, 
      'size': 32 
    };
    return editor.loc; }//返回可用的组件内坐标

  function locToPos(loc) {
    editor.pos = { 'x': ~~(loc.x / loc.size), 'y': ~~(loc.y / loc.size) }
    return editor.pos;
  }

  var holdingPath = 0;
  var stepPostfix = null;//用于存放寻路检测的第一个点之后的后续移动

  var mouseOutCheck = 2;
  function clear1() {
    if (mouseOutCheck > 1) {
      mouseOutCheck--;
      setTimeout(clear1, 1000);
      return;
    }
    holdingPath = 0;
    stepPostfix = [];
    uc.clearRect(0, 0, 416, 416);
  }//用于鼠标移出canvas时的自动清除状态

  eui.onmousedown = function (e) {
    if(!selectBox.isSelected) {
      var loc = eToLoc(e);
      var pos = locToPos(loc);
      editor_mode.onmode('nextChange');
      editor_mode.onmode('loc');
      //editor_mode.loc();
      tip.whichShow = 1;
      return;
    }

    holdingPath = 1;
    mouseOutCheck = 2;
    setTimeout(clear1);
    e.stopPropagation();
    uc.clearRect(0, 0, 416, 416);
    var loc = eToLoc(e);
    var pos = locToPos(loc);
    stepPostfix = [];
    stepPostfix.push(pos);
    fillPos(pos);
  }

  eui.onmousemove = function (e) {
    if(!selectBox.isSelected) {
      // tip.whichShow = 1;
      return;
    }

    if (holdingPath == 0) { return; }
    mouseOutCheck = 2;
    e.stopPropagation();
    var loc = eToLoc(e);
    var pos = locToPos(loc);
    var pos0 = stepPostfix[stepPostfix.length - 1]
    var directionDistance = [pos.y - pos0.y, pos0.x - pos.x, pos0.y - pos.y, pos.x - pos0.x]
    var max = 0, index = 4;
    for (var i = 0; i < 4; i++) {
      if (directionDistance[i] > max) {
        index = i;
        max = directionDistance[i];
      }
    }
    var pos = [{ 'x': 0, 'y': 1 }, { 'x': -1, 'y': 0 }, { 'x': 0, 'y': -1 }, { 'x': 1, 'y': 0 }, false][index]
    if (pos) {
      pos.x += pos0.x;
      pos.y += pos0.y;
      stepPostfix.push(pos);
      fillPos(pos);
    }
  }

  eui.onmouseup = function (e) {
    if(!selectBox.isSelected) {
      tip.whichShow = 1;
      return;
    }
    holdingPath = 0;
    e.stopPropagation();
    var loc = eToLoc(e);
    if (stepPostfix.length) {
      preMapData = JSON.parse(JSON.stringify(editor.map));
      currDrawData.pos = JSON.parse(JSON.stringify(stepPostfix));
      currDrawData.info = JSON.parse(JSON.stringify(editor.info));
      reDo = null;
      // console.log(stepPostfix);
      for (var ii = 0; ii < stepPostfix.length; ii++)
        editor.map[stepPostfix[ii].y][stepPostfix[ii].x] = editor.info;
      // console.log(editor.map);
      editor.updateMap();
      holdingPath = 0;
      stepPostfix = [];
      uc.clearRect(0, 0, 416, 416);
    }
  }
  
  var preMapData = {};
  var currDrawData = {
    pos: [],
    info: {}
  };
  var reDo = null;
  document.body.onkeydown = function(e) {
    // 禁止快捷键的默认行为
    if( e.ctrlKey && ( e.keyCode == 90 || e.keyCode == 89 ) )
      e.preventDefault();
    //Ctrl+z 撤销上一步undo
    if(e.keyCode == 90 && e.ctrlKey && preMapData && currDrawData.pos.length && selectBox.isSelected){
      editor.map = JSON.parse(JSON.stringify(preMapData));
      editor.updateMap();
      reDo = JSON.parse(JSON.stringify(currDrawData));
      currDrawData = {pos: [],info: {}};
      preMapData = null;
    }
    //Ctrl+y 重做一步redo
    if(e.keyCode == 89 && e.ctrlKey && reDo && reDo.pos.length && selectBox.isSelected){
      preMapData = JSON.parse(JSON.stringify(editor.map));
      for(var j=0; j<reDo.pos.length;j++)
        editor.map[reDo.pos[j].y][reDo.pos[j].x] = JSON.parse(JSON.stringify(reDo.info));

      editor.updateMap();
      currDrawData = JSON.parse(JSON.stringify(reDo));
      reDo = null;
    }
  }

  edata.onmousedown = function (e) {
    e.stopPropagation();
    var scrollLeft = document.documentElement.scrollLeft || document.body.scrollLeft;
    var scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
    var loc = { 
      'x': scrollLeft + e.clientX + iconLib.scrollLeft - right.offsetLeft-iconLib.offsetLeft, 
      'y': scrollTop + e.clientY + iconLib.scrollTop - right.offsetTop-iconLib.offsetTop, 
      'size': 32
    };
    editor.loc = loc;
    var pos = locToPos(loc);
    for (var spriter in editor.widthsX){
      if(pos.x>=editor.widthsX[spriter][1] && pos.x<editor.widthsX[spriter][2]){
        var ysize = spriter.indexOf('48')===-1?32:48;
        loc.ysize = ysize;
        pos.y = ~~(loc.y / loc.ysize);
        pos.x=editor.widthsX[spriter][1];
        pos.images = editor.widthsX[spriter][0];
        var autotiles = editor.material.images['autotile'];
        if(pos.images=='autotile'){
          var imNames = Object.keys(autotiles);
          if((pos.y+1)*ysize > editor.widthsX[spriter][3])
            pos.y = ~~(editor.widthsX[spriter][3]/ysize)-4;
          else{
            for(var i=0; i<imNames.length; i++){
              if(pos.y >= 4*i && pos.y < 4*(i+1)){
                pos.images = imNames[i];
                pos.y = 4*i;
              }
            }
          }
        }else if((pos.y+1)*ysize > editor.widthsX[spriter][3])
          pos.y = ~~(editor.widthsX[spriter][3]/ysize)-1;
        
        selectBox.isSelected = true;
        // console.log(pos,editor.material.images[pos.images].height)
        dataSelection.style.left = pos.x*32 +'px';
        dataSelection.style.top = pos.y*ysize +'px';
        dataSelection.style.height = ysize-6+'px';
        
        if(pos.x==0&&pos.y==0){
          // editor.info={idnum:0, id:'empty','images':'清除块', 'y':0};
          editor.info=0;
        }else{
          if(hasOwnProp(autotiles, pos.images)) editor.info={'images':pos.images, 'y':0};
          else if(pos.images == 'terrains') editor.info={'images':pos.images, 'y':pos.y-1};
          else editor.info={'images':pos.images, 'y':pos.y};

          for (var ii=0;ii<editor.ids.length;ii++){
            if( ( editor.info.images==editor.ids[ii].images 
                && editor.info.y==editor.ids[ii].y )
                || (hasOwnProp(autotiles, pos.images) && editor.info.images==editor.ids[ii].id 
                && editor.info.y==editor.ids[ii].y)){

              editor.info = editor.ids[ii];
              break;
            }
          }
        }
        tip.infos = JSON.parse(JSON.stringify(editor.info));
        editor_mode.onmode('nextChange');
        editor_mode.onmode('emenyitem');
        //editor_mode.emenyitem();
      }
    }
  }

}//绑定事件

/* 
editor.loc
editor.pos
editor.info
始终是最后一次点击的结果
注意editor.info可能因为点击其他地方而被清空
*/

editor = new editor();