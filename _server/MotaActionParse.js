MotaActionParse=function(){
function ActionParser(){
}

ActionParser.prototype.parse = function (obj,type) {
  switch (type) {
    case 'event':
      if(!obj)obj={};
      if(typeof(obj)===typeof('')) obj={'data':[obj]};
      if(obj instanceof Array) obj={'data':obj};
      return MotaActionBlocks['event_m'].xmlText([
        obj.trigger==='action',obj.enable,obj.noPass,obj.displayDamage,this.parseList(obj.data)
      ]);
    
    case 'autoEvent':
      if(!obj)obj={};
      return MotaActionBlocks['autoEvent_m'].xmlText([
        obj.condition,obj.priority,obj.currentFloor,obj.delayExecute,obj.multiExecute,this.parseList(obj.data)
      ]);
    
    case 'changeFloor':
      if(!obj)obj={};
      if (!obj.loc) {
        obj.loc = obj.loc || ['',''];
        obj.stair = obj.stair || ':now';
      }
      if (obj.floorId==':before'||obj.floorId==':next'||obj.floorId==':now') {
        obj.floorType=obj.floorId;
        delete obj.floorId;
      }
      return MotaActionBlocks['changeFloor_m'].xmlText([
        obj.floorType||'floorId',obj.floorId,obj.stair||'loc',obj.loc[0],obj.loc[1],obj.direction,
        obj.time,obj.ignoreChangeFloor
      ]);
    
    case 'afterGetItem':
      if (!obj) obj = [];
      if (obj instanceof Array) obj = {'data': obj};
      return MotaActionBlocks['afterGetItem_m'].xmlText([
        obj.disableOnGentleClick||false, this.parseList(obj.data)
      ]);

    case 'level':
      if(!obj)obj={};
      var text_choices = null;
      for(var ii=obj.length-1,choice;choice=obj[ii];ii--) {
        text_choices=MotaActionBlocks['levelCase'].xmlText([
          this.expandEvalBlock([choice.need]),choice.title,choice.clear||false,this.parseList(choice.action),text_choices]);
      }
      return MotaActionBlocks['level_m'].xmlText([text_choices]);

    case 'levelChoose':
      if(!obj) obj=[];
      var text_choices = null;
      for(var ii=obj.length-1,choice;choice=obj[ii];ii--) {
        text_choices=MotaActionBlocks['levelChooseChoice'].xmlText([
          choice.title, choice.name, choice.hard||0, choice.color, 'rgba('+choice.color+')', this.parseList(choice.action), text_choices]);
      }
      return MotaActionBlocks['levelChoose_m'].xmlText([text_choices]);

    case 'equip':
      if(!obj) obj={};
      var buildEquip = function (obj) {
        obj = obj || {};
        var text_choices = null;
        var knownEquipListKeys = MotaActionBlocks.equipKnown.json.args0[0].options.map(function (one) {return one[1];})
        Object.keys(obj).sort().forEach(function (key) {
          var one = knownEquipListKeys.indexOf(key) >= 0 ? 'equipKnown' : 'equipUnknown';
          text_choices = MotaActionBlocks[one].xmlText([
            key, obj.key, text_choices
          ]);
        })
        return text_choices;
      }
      return MotaActionBlocks['equip_m'].xmlText([obj.type, obj.animate, buildEquip(obj.value), buildEquip(obj.percentage)]);

      case 'doorInfo':
        if(!obj) obj={};
        var buildKeys = function (obj) {
          obj = obj || {};
          var text_choices = null;
          var knownListKeys = MotaActionBlocks.doorKeyKnown.json.args0[0].options.map(function (one) {return one[1];})
          Object.keys(obj).sort().forEach(function (key) {
            var one = knownListKeys.indexOf(key) >= 0 ? 'doorKeyKnown' : 'doorKeyUnknown';
            text_choices = MotaActionBlocks[one].xmlText([
              key, obj.key, text_choices
            ]);
          })
          return text_choices;
        }
        return MotaActionBlocks['doorInfo_m'].xmlText([obj.time || 160, obj.openSound, obj.closeSound, buildKeys(obj.keys)]);

    case 'floorImage':
      if(!obj) obj=[];
      var text_choices = null;
      for(var ii=obj.length-1,choice;choice=obj[ii];ii--) {
        text_choices=MotaActionBlocks['floorOneImage'].xmlText([
          choice.name, choice.reverse, choice.canvas||'bg', choice.x||0, choice.y||0, choice.disable||false, 
          choice.sx, choice.sy, choice.w, choice.h, choice.frame, text_choices]);
      }
      return MotaActionBlocks['floorImage_m'].xmlText([text_choices]);

    case 'faceIds':
      if(!obj) obj={};
      return MotaActionBlocks['faceIds_m'].xmlText([obj.up||"", obj.down||"", obj.left||"", obj.right||""]);

    case 'shop':
      var buildsub = function(obj,parser,next){
        var text_choices = null;
        for(var ii=obj.choices.length-1,choice;choice=obj.choices[ii];ii--) {
          text_choices=MotaActionBlocks['shopChoices'].xmlText([
            choice.text,choice.need||'',choice.icon,choice.color,'rgba('+choice.color+')',choice.condition,parser.parseList(choice.action),text_choices]);
        }
        var info = parser.getTitleAndPosition(obj.text || '');
        return MotaActionBlocks['shopsub'].xmlText([
          obj.id,obj[0],info[1],info[3],obj.textInList,obj.mustEnable,obj.disablePreview,text_choices,next
        ]);
      }
      var buildcommentevent = function(obj,parser,next){
        if (obj.args instanceof Array) {
          obj.args = JSON.stringify(obj.args);
        }
        else obj.args = null;
        return MotaActionBlocks['shopcommonevent'].xmlText([
          obj.id,parser.EvalString(obj.textInList),obj.mustEnable,parser.EvalString(obj.commonEvent),obj.args,next
        ]);
      }
      var builditem = function (obj,parser,next){
        var text_choices = null;
        for(var ii=obj.choices.length-1,choice;choice=obj.choices[ii];ii--) {
          text_choices = MotaActionBlocks['shopItemChoices'].xmlText([
            choice.id, choice.number == null ? "" : (""+choice.number), choice.money == null ? "" : (""+choice.money), 
            choice.sell == null ? "" : (""+choice.sell), choice.condition || "", text_choices
          ]);
        }
        return MotaActionBlocks['shopitem'].xmlText([
          obj.id,obj.textInList,obj.mustEnable,text_choices,next
        ]);
      }
      var next=null;
      if(!obj)obj=[];
      while(obj.length){
        var shopobj=obj.pop()
        if(shopobj.item)
          next=builditem(shopobj,this,next);
        else if(shopobj.choices)
          next=buildsub(shopobj,this,next);
        else if(shopobj.commonEvent)
          next=buildcommentevent(shopobj,this,next);
        else
          throw new Error("[警告]出错啦！\n"+shopobj.id+" 无效的商店");
      }
      return MotaActionBlocks['shop_m'].xmlText([next]);
    
    default:
      return MotaActionBlocks[type+'_m'].xmlText([this.parseList(obj)]);
  }
}

////// 开始解析一系列自定义事件 //////
ActionParser.prototype.parseList = function (list) {
  if (!this.isset(list)) return MotaActionBlocks['pass_s'].xmlText([],true);
  if (!(list instanceof Array)) {
    list = [list];
  }
  if (list.length===0) return MotaActionBlocks['pass_s'].xmlText([],true);
  this.event = {'id': 'action', 'data': {
    'list': list
  }}
  this.next = null;
  this.result = null;
  this.parseAction();
  return this.result;
}

////// 解析当前自定义事件列表中的最后一个事件 //////
ActionParser.prototype.parseAction = function() {

  // 事件处理完毕
  if (this.event.data.list.length==0) {
    this.result = this.next;
    this.next = null;
    return;
  }

  var data = this.event.data.list.pop();
  this.event.data.current = data;

  // 不同种类的事件

  // 如果是文字：显示
  if (typeof data == "string") {
      data={"type": "text", "text": data}
  }
  this.event.data.type=data.type;
  switch (data.type) {
    case "_next":
      this.result = this.next;
      this.next = data.next;
      return;
    case "text": // 文字/对话
      var info = this.getTitleAndPosition(data.text);
      if (info[0] || info[1] || info[2]) {
        this.next = MotaActionBlocks['text_1_s'].xmlText([
          info[0], info[1], info[2], info[3], this.next]);
      }
      else {
        this.next = MotaActionBlocks['text_0_s'].xmlText([info[3],this.next]);
      }
      break;
    case "autoText": // 自动剧情文本
      var info = this.getTitleAndPosition(data.text);
      this.next = MotaActionBlocks['autoText_s'].xmlText([
        info[0],info[1],info[2],data.time,info[3],this.next]);
      break;
    case "scrollText":
      this.next = MotaActionBlocks['scrollText_s'].xmlText([
        data.time, data.lineHeight||1.4, data.async||false, this.EvalString(data.text), this.next]);
        break;
    case "comment": // 注释
      this.next = MotaActionBlocks['comment_s'].xmlText([this.EvalString(data.text),this.next],null,data.text);
      break;
    case "setText": // 设置剧情文本的属性
      data.title=this.Colour(data.title);
      data.text=this.Colour(data.text);
      if (!/^\w+\.png$/.test(data.background))
        data.background=this.Colour(data.background);
      this.next = MotaActionBlocks['setText_s'].xmlText([
        data.position,data.offset,data.align,data.title,'rgba('+data.title+')',
        data.text,'rgba('+data.text+')',data.background,'rgba('+data.background+')',
        data.bold,data.titlefont,data.textfont,data.lineHeight,data.time,data.interval,this.next]);
      break;
    case "tip":
      this.next = MotaActionBlocks['tip_s'].xmlText([
        data.text,data.icon||"",this.next]);
      break;
    case "show": // 显示
      data.loc=data.loc||[];
      if (!(data.loc[0] instanceof Array))
        data.loc = [data.loc];
      var x_str=[],y_str=[];
      data.loc.forEach(function (t) {
        x_str.push(t[0]);
        y_str.push(t[1]);
      })
      this.next = MotaActionBlocks['show_s'].xmlText([
        x_str.join(','),y_str.join(','),data.floorId||'',data.time,data.async||false,this.next]);
      break;
    case "hide": // 消失
      data.loc=data.loc||[];
      if (!(data.loc[0] instanceof Array))
        data.loc = [data.loc];
      var x_str=[],y_str=[];
      data.loc.forEach(function (t) {
        x_str.push(t[0]);
        y_str.push(t[1]);
      })
      this.next = MotaActionBlocks['hide_s'].xmlText([
        x_str.join(','),y_str.join(','),data.floorId||'',data.remove||false,data.time,data.async||false,this.next]);
      break;
    case "setBlock": // 设置图块
      data.loc=data.loc||[];
      if (!(data.loc[0] instanceof Array))
        data.loc = [data.loc];
      var x_str=[],y_str=[];
      data.loc.forEach(function (t) {
        x_str.push(t[0]);
        y_str.push(t[1]);
      })
      this.next = MotaActionBlocks['setBlock_s'].xmlText([
        data.number||0,x_str.join(','),y_str.join(','),data.floorId||'',data.time,data.async||false,this.next]);
      break;
    case "turnBlock": // 事件转向
      data.loc=data.loc||[];
      if (!(data.loc[0] instanceof Array))
        data.loc = [data.loc];
      var x_str=[],y_str=[];
      data.loc.forEach(function (t) {
        x_str.push(t[0]);
        y_str.push(t[1]);
      })
      this.next = MotaActionBlocks['turnBlock_s'].xmlText([
        data.direction,x_str.join(','),y_str.join(','),data.floorId||'',this.next]);
      break;
    case "showFloorImg": // 显示贴图
      data.loc=data.loc||[];
      if (!(data.loc[0] instanceof Array))
        data.loc = [data.loc];
      var x_str=[],y_str=[];
      data.loc.forEach(function (t) {
        x_str.push(t[0]);
        y_str.push(t[1]);
      })
      this.next = MotaActionBlocks['showFloorImg_s'].xmlText([
        x_str.join(','),y_str.join(','),data.floorId||'',this.next]);
      break;
    case "hideFloorImg": // 隐藏贴图
      data.loc=data.loc||[];
      if (!(data.loc[0] instanceof Array))
        data.loc = [data.loc];
      var x_str=[],y_str=[];
      data.loc.forEach(function (t) {
        x_str.push(t[0]);
        y_str.push(t[1]);
      })
      this.next = MotaActionBlocks['hideFloorImg_s'].xmlText([
        x_str.join(','),y_str.join(','),data.floorId||'',this.next]);
      break;
    case "showBgFgMap": // 显示图层块
      data.loc=data.loc||[];
      if (!(data.loc[0] instanceof Array))
        data.loc = [data.loc];
      var x_str=[],y_str=[];
      data.loc.forEach(function (t) {
        x_str.push(t[0]);
        y_str.push(t[1]);
      })
      this.next = MotaActionBlocks['showBgFgMap_s'].xmlText([
        data.name||'bg', x_str.join(','),y_str.join(','),data.floorId||'',this.next]);
      break;
    case "hideBgFgMap": // 隐藏图层块
      data.loc=data.loc||[];
      if (!(data.loc[0] instanceof Array))
        data.loc = [data.loc];
      var x_str=[],y_str=[];
      data.loc.forEach(function (t) {
        x_str.push(t[0]);
        y_str.push(t[1]);
      })
      this.next = MotaActionBlocks['hideBgFgMap_s'].xmlText([
        data.name||'bg', x_str.join(','),y_str.join(','),data.floorId||'',this.next]);
      break;
    case "setBgFgBlock": // 设置图块
      data.loc=data.loc||[];
      if (!(data.loc[0] instanceof Array))
        data.loc = [data.loc];
      var x_str=[],y_str=[];
      data.loc.forEach(function (t) {
        x_str.push(t[0]);
        y_str.push(t[1]);
      })
      this.next = MotaActionBlocks['setBgFgBlock_s'].xmlText([
        data.name||'bg', data.number||0, x_str.join(','),y_str.join(','),data.floorId||'',this.next]);
      break;
    case "setHeroIcon": // 改变勇士
      this.next = MotaActionBlocks['setHeroIcon_s'].xmlText([
        data.name||"",this.next]);
      break;
    case "move": // 移动事件
      data.loc=data.loc||['',''];
      this.next = MotaActionBlocks['move_s'].xmlText([
        data.loc[0],data.loc[1],data.time,data.keep||false,data.async||false,this.StepString(data.steps),this.next]);
      break;
    case "moveAction": // 前进一格或撞击
      this.next = MotaActionBlocks['moveAction_s'].xmlText([this.next]);
      break;
    case "moveHero": // 无视地形移动勇士
      this.next = MotaActionBlocks['moveHero_s'].xmlText([
        data.time,data.async||false,this.StepString(data.steps),this.next]);
      break;
    case "jump": // 跳跃事件
      data.from=data.from||['',''];
      data.to=data.to||['',''];
      this.next = MotaActionBlocks['jump_s'].xmlText([
        data.from[0],data.from[1],data.to[0],data.to[1],data.time,data.keep||false,data.async||false,this.next]);
      break;
    case "jumpHero": // 跳跃勇士
      data.loc=data.loc||['','']
      this.next = MotaActionBlocks['jumpHero_s'].xmlText([
        data.loc[0],data.loc[1],data.time,data.async||false,this.next]);
      break;
    case "changeFloor": // 楼层转换
      if (!data.loc) {
        data.loc = data.loc || ['',''];
        data.stair = data.stair || ':now';
      }
      if (data.floorId==':before'||data.floorId==':next'||data.floorId==':now') {
        data.floorType=data.floorId;
        delete data.floorId;
      }
      this.next = MotaActionBlocks['changeFloor_s'].xmlText([
        data.floorType||'floorId',data.floorId,data.stair||'loc',data.loc[0],data.loc[1],data.direction,
        data.time, this.next]);
      break;
    case "changePos": // 直接更换勇士位置, 不切换楼层
      data.loc=data.loc||['','']
      this.next = MotaActionBlocks['changePos_s'].xmlText([
        data.loc[0],data.loc[1],data.direction,this.next]);
      break;
    case "follow": // 跟随勇士
      this.next = MotaActionBlocks['follow_s'].xmlText([data.name||"", this.next]);
      break;
    case "unfollow": // 取消跟随
      this.next = MotaActionBlocks['unfollow_s'].xmlText([data.name||"", this.next]);
      break;
    case "animate": // 显示动画
      var animate_loc = data.loc||'';
      if(animate_loc && animate_loc!=='hero')animate_loc = animate_loc[0]+','+animate_loc[1];
      this.next = MotaActionBlocks['animate_s'].xmlText([
        data.name,animate_loc,data.alignWindow||false,data.async||false,this.next]);
      break;
    case "setViewport": // 设置视角
      data.loc = data.loc||['',''];
      this.next = MotaActionBlocks['setViewport_s'].xmlText([
        data.loc[0],data.loc[1],this.next]);
      break;
    case "moveViewport": // 移动视角
      this.next = MotaActionBlocks['moveViewport_s'].xmlText([
        data.time,data.async||false,this.StepString(data.steps),this.next]);
      break;
    case "vibrate": // 画面震动
      this.next = MotaActionBlocks['vibrate_s'].xmlText([data.time||0, data.async||false, this.next]);
      break;
    case "showImage": // 显示图片
      data.loc=data.loc||['','']
      if (data.sloc) {
        this.next = MotaActionBlocks['showImage_1_s'].xmlText([
            data.code,data.image||data.name,data.reverse,data.sloc[0],data.sloc[1],data.sloc[2],data.sloc[3],data.opacity,
            data.loc[0],data.loc[1],data.loc[2],data.loc[3],data.time||0,data.async||false,this.next
        ]);
      }
      else {
        this.next = MotaActionBlocks['showImage_s'].xmlText([
              data.code,data.image||data.name,data.reverse,data.loc[0],data.loc[1],data.opacity,data.time||0,data.async||false,this.next]);
      }
      break;
    case "hideImage": // 清除图片
      this.next = MotaActionBlocks['hideImage_s'].xmlText([
        data.code,data.time||0,data.async||false,this.next]);
      break;
    case "showTextImage": // 显示图片化文本
      data.loc=data.loc||['','']
      this.next = MotaActionBlocks['showTextImage_s'].xmlText([
        this.EvalString(data.text),data.code,data.loc[0],data.loc[1],data.lineHeight||1.4,data.opacity,data.time||0,data.async||false,this.next]);
      break;
    case "moveImage": // 移动图片
      data.to=data.to||['','']
      this.next = MotaActionBlocks['moveImage_s'].xmlText([
        data.code, data.to[0], data.to[1], data.opacity, data.time||0, data.async||false, this.next]);
      break;
    case "showGif": // 显示动图
      data.loc=data.loc||['','']
      this.next = MotaActionBlocks['showGif_s'].xmlText([
        data.name,data.loc[0],data.loc[1],this.next]);
      break;
    case "setCurtain": // 颜色渐变
      if(this.isset(data.color)){
        data.color = this.Colour(data.color);
        this.next = MotaActionBlocks['setCurtain_0_s'].xmlText([
          data.color,'rgba('+data.color+')',data.time,data.keep||false,data.async||false,this.next]);
      } else {
        this.next = MotaActionBlocks['setCurtain_1_s'].xmlText([
          data.time,data.async||false,this.next]);
      }
      break;
    case "screenFlash": // 画面闪烁
        data.color = this.Colour(data.color);
        this.next = MotaActionBlocks['screenFlash_s'].xmlText([
          data.color,'rgba('+data.color+')',data.time||500,data.times,data.async||false,this.next]);
      break;
    case "setWeather": // 更改天气
      this.next = MotaActionBlocks['setWeather_s'].xmlText([
        data.name,data.level||1,data.keep||false,this.next]);
      break;
    case "openDoor": // 开一个门, 包括暗墙
      data.loc=data.loc||['','']
      this.next = MotaActionBlocks['openDoor_s'].xmlText([
        data.loc[0],data.loc[1],data.floorId||'',data.needKey||false,data.async||false,this.next]);
      break;
    case "closeDoor": // 关一个门，需要该点无事件
      data.loc=data.loc||['','']
      this.next = MotaActionBlocks['closeDoor_s'].xmlText([
        data.loc[0],data.loc[1],data.id,data.async||false,this.next]);
      break;
    case "useItem": // 使用道具
      this.next = MotaActionBlocks['useItem_s'].xmlText([
        data.id,this.next]);
      break;
    case "loadEquip": // 装上装备
      this.next = MotaActionBlocks['loadEquip_s'].xmlText([
        data.id,this.next]);
      break;
    case "unloadEquip": // 卸下装备
      this.next = MotaActionBlocks['unloadEquip_s'].xmlText([
        data.pos,this.next]);
      break;
    case "openShop": // 打开一个全局商店
      this.next = MotaActionBlocks['openShop_s'].xmlText([
        data.id,data.open||false,this.next]);
      break;
    case "disableShop": // 禁用一个全局商店
      this.next = MotaActionBlocks['disableShop_s'].xmlText([
        data.id,this.next]);
      break;
    case "battle": // 强制战斗
      if (data.id) {
        this.next = MotaActionBlocks['battle_s'].xmlText([
          data.id,this.next]);
      }
      else {
        data.loc = data.loc || [];
        this.next = MotaActionBlocks['battle_1_s'].xmlText([
          data.loc[0],data.loc[1],this.next]);
      }
      break;
    case "trigger": // 触发另一个事件
      data.loc = data.loc || [];
      this.next = MotaActionBlocks['trigger_s'].xmlText([
        data.loc[0],data.loc[1],this.next]);
      break;
    case "insert": // 强制插入另一个点的事件在当前事件列表执行，当前坐标和楼层不会改变
      if (data.args instanceof Array) {
        data.args = JSON.stringify(data.args);
      }
      else data.args = null;
      if (this.isset(data.name)) {
        this.next = MotaActionBlocks['insert_1_s'].xmlText([
          data.name, data.args||"", this.next]);
      }
      else {
        data.loc = data.loc || [];
        this.next = MotaActionBlocks['insert_2_s'].xmlText([
          data.loc[0],data.loc[1],data.which,data.floorId||'',data.args||"",this.next]);
      }
      break;
    case "playSound":
      this.next = MotaActionBlocks['playSound_s'].xmlText([
        data.name,data.stop,this.next]);
      break;
    case "playBgm":
      this.next = MotaActionBlocks['playBgm_s'].xmlText([
        data.name,data.startTime||0,data.keep||false,this.next]);
      break
    case "pauseBgm":
      this.next = MotaActionBlocks['pauseBgm_s'].xmlText([
        this.next]);
      break
    case "resumeBgm":
      this.next = MotaActionBlocks['resumeBgm_s'].xmlText([
        data.resume||false,this.next]);
      break
    case "loadBgm":
      this.next = MotaActionBlocks['loadBgm_s'].xmlText([
        data.name,this.next]);
      break
    case "freeBgm":
      this.next = MotaActionBlocks['freeBgm_s'].xmlText([
        data.name,this.next]);
      break
    case "stopSound":
      this.next = MotaActionBlocks['stopSound_s'].xmlText([
        this.next]);
      break
    case "setVolume":
      this.next = MotaActionBlocks['setVolume_s'].xmlText([
        data.value, data.time, data.async||false, this.next]);
      break
    case "setValue":
      this.next = MotaActionBlocks['setValue_s'].xmlText([
        this.expandIdBlock([data.name]), data["operator"]||'=',
        this.expandEvalBlock([data.value]),
        data.norefresh || false,
        this.next]);
      break;
    case "setEnemy":
      this.next = MotaActionBlocks['setEnemy_s'].xmlText([
        data.id, data.name, this.expandEvalBlock([data.value]), this.next]);
      break;
    case "setFloor":
      this.next = MotaActionBlocks['setFloor_s'].xmlText([
        data.name, data.floorId||null, data.value, this.next]);
      break;
    case "setGlobalAttribute":
      this.next = MotaActionBlocks['setGlobalAttribute_s'].xmlText([
        data.name, data.value, this.next]);
      break;
    case "setGlobalValue":
      this.next = MotaActionBlocks['setGlobalValue_s'].xmlText([
        data.name, data.value, this.next]);
      break;
    case "setGlobalFlag":
      this.next = MotaActionBlocks['setGlobalFlag_s'].xmlText([
        data.name, data.value, this.next]);
      break;
    case "input":
      this.next = MotaActionBlocks['input_s'].xmlText([
        data.text,this.next]);
      break;
    case "input2":
      this.next = MotaActionBlocks['input2_s'].xmlText([
        data.text,this.next]);
      break;
    case "if": // 条件判断
      if (data["false"]) {
        this.next = MotaActionBlocks['if_s'].xmlText([
          this.expandEvalBlock([data.condition]),
          this.insertActionList(data["true"]),
          this.insertActionList(data["false"]),
          this.next]);
      }
      else {
        this.next = MotaActionBlocks['if_1_s'].xmlText([
          this.expandEvalBlock([data.condition]),
          this.insertActionList(data["true"]),
          this.next]);
      }
      break;
    case "confirm": // 显示确认框
      this.next = MotaActionBlocks['confirm_s'].xmlText([
        this.EvalString(data.text), data.timeout||0, data["default"],
        this.insertActionList(data["yes"]),
        this.insertActionList(data["no"]),
        this.next]);
      break;
    case "switch": // 多重条件分歧
      var case_caseList = null;
      for(var ii=data.caseList.length-1,caseNow;caseNow=data.caseList[ii];ii--) {
        case_caseList=MotaActionBlocks['switchCase'].xmlText([
          this.isset(caseNow.case)?this.expandEvalBlock([caseNow.case]):"值",caseNow.nobreak,this.insertActionList(caseNow.action),case_caseList]);
      }
      this.next = MotaActionBlocks['switch_s'].xmlText([
        this.expandEvalBlock([data.condition]),
        case_caseList,this.next]);
      break;
    case "choices": // 提供选项
      var text_choices = null;
      for(var ii=data.choices.length-1,choice;choice=data.choices[ii];ii--) {
        choice.color = this.Colour(choice.color);
        text_choices=MotaActionBlocks['choicesContext'].xmlText([
          choice.text,choice.icon,choice.color,'rgba('+choice.color+')',choice.condition||'',this.insertActionList(choice.action),text_choices]);
      }
      if (!this.isset(data.text)) data.text = '';
      var info = this.getTitleAndPosition(data.text);
      this.next = MotaActionBlocks['choices_s'].xmlText([
        info[3],info[0],info[1],data.timeout||0,text_choices,this.next]);
      break;
    case "for": // 循环遍历
      this.next = MotaActionBlocks['for_s'].xmlText([
        this.expandEvalBlock([data.name]),
        data.from || 0, data.to || 0, data.step || 0,
        this.insertActionList(data.data),
        this.next]);
      break;
    case "forEach": // 循环遍历列表
      this.next = MotaActionBlocks['forEach_s'].xmlText([
        this.expandEvalBlock([data.name]),
        JSON.stringify(data.list),
        this.insertActionList(data.data),
        this.next]);
      break;
    case "while": // 前置条件循环处理
      this.next = MotaActionBlocks['while_s'].xmlText([
        this.expandEvalBlock([data.condition]),
        this.insertActionList(data.data),
        this.next]);
      break;
    case "dowhile": // 后置条件循环处理
      this.next = MotaActionBlocks['dowhile_s'].xmlText([
        this.insertActionList(data.data),
        this.expandEvalBlock([data.condition]),
        this.next]);
      break;
    case "break": // 跳出循环
      this.next = MotaActionBlocks['break_s'].xmlText([
        this.next]);
      break;
    case "continue": // 继续执行当前循环
      this.next = MotaActionBlocks['continue_s'].xmlText([
        this.next]);
      break;
    case "win":
      this.next = MotaActionBlocks['win_s'].xmlText([
        data.reason,data.norank?true:false,data.noexit?true:false,this.next]);
      break;
    case "lose":
      this.next = MotaActionBlocks['lose_s'].xmlText([
        data.reason,this.next]);
      break;
    case "restart":
      this.next = MotaActionBlocks['restart_s'].xmlText([
        this.next]);
      break;
    case "function":
      var func = data["function"];
      func=func.split('{').slice(1).join('{').split('}').slice(0,-1).join('}').trim().split('\n').join('\\n');
      this.next = MotaActionBlocks['function_s'].xmlText([
        data.async||false,func,this.next]);
      break;
    case "update":
      this.next = MotaActionBlocks['update_s'].xmlText([
        this.next, this.doNotCheckAutoEvents||false]);
      break;
    case "showStatusBar":
      this.next = MotaActionBlocks['showStatusBar_s'].xmlText([
        this.next]);
      break;
    case "hideStatusBar":
      this.next = MotaActionBlocks['hideStatusBar_s'].xmlText([
        data.toolbox||false,this.next]);
      break;
    case "showHero":
      this.next = MotaActionBlocks['showHero_s'].xmlText([
        data.time, data.async||false, this.next]);
      break;
    case "hideHero":
      this.next = MotaActionBlocks['hideHero_s'].xmlText([
        data.time, data.async||false, this.next]);
      break;
    case "sleep": // 等待多少毫秒
      this.next = MotaActionBlocks['sleep_s'].xmlText([
        data.time||0,data.noSkip||false,this.next]);
      break;
    case "wait": // 等待用户操作
      var case_waitList = null;
      if (data.data) {
        for(var ii=data.data.length-1,caseNow;caseNow=data.data[ii];ii--) {
          if (caseNow["case"] == "keyboard") {
            case_waitList = MotaActionBlocks['waitContext_1'].xmlText([
              caseNow.keycode || "0", this.insertActionList(caseNow.action), case_waitList
            ]);
          } else if (caseNow["case"] == "mouse") {
            case_waitList = MotaActionBlocks['waitContext_2'].xmlText([
              caseNow.px[0], caseNow.px[1], caseNow.py[0], caseNow.py[1], this.insertActionList(caseNow.action), case_waitList
            ]);
          }
        }
      }
      this.next = MotaActionBlocks['wait_s'].xmlText([
        data.timeout||0,case_waitList, this.next]);
      break;
    case "waitAsync": // 等待所有异步事件执行完毕
      this.next = MotaActionBlocks['waitAsync_s'].xmlText([
        this.next]);
      break;
    case "callBook": // 呼出怪物手册
      this.next = MotaActionBlocks['callBook_s'].xmlText([
        this.next]);
      break;
    case "callSave": // 呼出存档界面
      this.next = MotaActionBlocks['callSave_s'].xmlText([
        this.next]);
      break;
    case "autoSave": // 自动存档
      this.next = MotaActionBlocks['autoSave_s'].xmlText([
        data.nohint||false, this.next]);
      break;
    case "callLoad": // 呼出读档界面
      this.next = MotaActionBlocks['callLoad_s'].xmlText([
        this.next]);
      break;
    case "exit": // 立刻结束事件
      this.next = MotaActionBlocks['exit_s'].xmlText([
        this.next]);
      break;
    case "previewUI": // UI绘制预览
      this.next = MotaActionBlocks['previewUI_s'].xmlText([
        this.insertActionList(data.action), this.next
      ]);
      break;
    case "clearMap": // 清除画布
      if (data.x != null && data.y != null && data.width != null && data.height != null) {
        this.next = MotaActionBlocks['clearMap_s'].xmlText([
          data.x, data.y, data.width, data.height, this.next
        ]);
      }
      else {
        this.next = MotaActionBlocks['clearMap_1_s'].xmlText([this.next]);
      }
      break;
    case "setAttribute": // 设置画布属性
      data.fillStyle=this.Colour(data.fillStyle);
      data.strokeStyle=this.Colour(data.strokeStyle);
      this.next = MotaActionBlocks['setAttribute_s'].xmlText([
        data.font,data.fillStyle,'rgba('+data.fillStyle+')',data.strokeStyle,'rgba('+data.strokeStyle+')',
        data.lineWidth,data.alpha,data.align,data.baseline,data.z,this.next]);
      break;
    case "fillText": // 绘制一行文本
      data.style = this.Colour(data.style);
      this.next = MotaActionBlocks['fillText_s'].xmlText([
        data.x, data.y, data.style, 'rgba('+data.style+')', data.font, data.maxWidth, this.EvalString(data.text), this.next
      ]);
      break;
    case "fillBoldText": // 绘制一行描边文本
      data.style = this.Colour(data.style);
      this.next = MotaActionBlocks['fillBoldText_s'].xmlText([
        data.x, data.y, data.style, 'rgba('+data.style+')', data.strokeStyle, 'rgba('+(data.strokeStyle||"0,0,0,1")+')', 
        data.font, this.EvalString(data.text), this.next
      ]);
      break;
    case "drawTextContent": // 绘制多行文本
      data.color = this.Colour(data.color);
      this.next = MotaActionBlocks['drawTextContent_s'].xmlText([
        this.EvalString(data.text), data.left, data.top, data.maxWidth, data.color, 'rgba('+data.color+')',
        data.align, data.fontSize, data.lineHeight, data.bold, this.next
      ]);
      break;
    case "fillRect": // 绘制矩形
      data.style = this.Colour(data.style);
      this.next = MotaActionBlocks['fillRect_s'].xmlText([
        data.x, data.y, data.width, data.height, data.radius, data.style, 'rgba('+data.style+')', this.next
      ]);
      break;
    case "strokeRect": // 绘制矩形边框
      data.style = this.Colour(data.style);
      this.next = MotaActionBlocks['strokeRect_s'].xmlText([
        data.x, data.y, data.width, data.height, data.radius, data.style, 'rgba('+data.style+')', data.lineWidth, this.next
      ]);
      break;
    case "drawLine": // 绘制线段
      data.style = this.Colour(data.style);
      this.next = MotaActionBlocks['drawLine_s'].xmlText([
        data.x1, data.y1, data.x2, data.y2, data.style, 'rgba('+data.style+')', data.lineWidth, this.next
      ]);
      break;
    case "drawArrow": // 绘制线段
      data.style = this.Colour(data.style);
      this.next = MotaActionBlocks['drawArrow_s'].xmlText([
        data.x1, data.y1, data.x2, data.y2, data.style, 'rgba('+data.style+')', data.lineWidth, this.next
      ]);
      break;
    case "fillPolygon": // 绘制多边形
      data.style = this.Colour(data.style);
      var x_str=[],y_str=[];
      data.nodes.forEach(function (t) {
        x_str.push(t[0]);
        y_str.push(t[1]);
      })
      this.next = MotaActionBlocks['fillPolygon_s'].xmlText([
        x_str.join(','), y_str.join(','), data.style, 'rgba('+data.style+')', this.next
      ]);
      break;
    case "strokePolygon": // 绘制多边形
      data.style = this.Colour(data.style);
      var x_str=[],y_str=[];
      data.nodes.forEach(function (t) {
        x_str.push(t[0]);
        y_str.push(t[1]);
      })
      this.next = MotaActionBlocks['strokePolygon_s'].xmlText([
        x_str.join(','), y_str.join(','), data.style, 'rgba('+data.style+')', data.lineWidth, this.next
      ]);
      break;
    case "fillEllipse": // 绘制椭圆
      data.style = this.Colour(data.style);
      this.next = MotaActionBlocks['fillEllipse_s'].xmlText([
        data.x, data.y, data.a, data.b, data.angle, data.style, 'rgba('+data.style+')', this.next
      ]);
      break;
    case "strokeEllipse": // 绘制椭圆边框
      data.style = this.Colour(data.style);
      this.next = MotaActionBlocks['strokeEllipse_s'].xmlText([
        data.x, data.y, data.a, data.b, data.angle, data.style, 'rgba('+data.style+')', data.lineWidth, this.next
      ]);
      break;
    case "fillArc": // 绘制弧
      data.style = this.Colour(data.style);
      this.next = MotaActionBlocks['fillArc_s'].xmlText([
        data.x, data.y, data.r, data.start, data.end, data.style, 'rgba('+data.style+')', this.next
      ]);
      break;
    case "strokeArc": // 绘制弧
      data.style = this.Colour(data.style);
      this.next = MotaActionBlocks['strokeArc_s'].xmlText([
        data.x, data.y, data.r, data.start, data.end, data.style, 'rgba('+data.style+')', data.lineWidth, this.next
      ]);
      break;
    case "drawImage": // 绘制图片
      if (data.x1 != null && data.y1 != null && data.w1 != null && data.h1 != null) {
        this.next = MotaActionBlocks['drawImage_1_s'].xmlText([
          data.image, data.reverse, data.x, data.y, data.w, data.h, data.x1, data.y1, data.w1, data.h1, this.next
        ]);
      }
      else {
        this.next = MotaActionBlocks['drawImage_s'].xmlText([
          data.image, data.reverse, data.x, data.y, data.w, data.h, this.next
        ]);
      }
      break;
    case "drawIcon": // 绘制图标
      this.next = MotaActionBlocks['drawIcon_s'].xmlText([
        data.id, data.frame||0, data.x, data.y, data.width, data.height, this.next
      ]);
      break;
    case "drawBackground": // 绘制背景
      if (!/^\w+\.png$/.test(data.background))
        data.background=this.Colour(data.background);
      this.next = MotaActionBlocks['drawBackground_s'].xmlText([
        data.background, 'rgba('+data.background+')', data.x, data.y, data.width, data.height, this.next
      ]);
      break;
    case "drawSelector": // 绘制光标
      if (data.image) {
        this.next = MotaActionBlocks['drawSelector_s'].xmlText([
          data.image, data.code, data.x, data.y, data.width, data.height, this.next
        ]);
      }
      else {
        this.next = MotaActionBlocks['drawSelector_1_s'].xmlText([data.code, this.next]);
      }
    case "animateImage":  // 兼容 animateImage
      break;
    default:
      this.next = MotaActionBlocks['unknown_s'].xmlText([
        JSON.stringify(data),this.next]);
  }
  this.parseAction();
  return;
}

////// 往当前事件列表之后添加一个事件组 //////
ActionParser.prototype.insertActionList = function (actionList) {
  if (actionList.length===0) return null;
  this.event.data.list.push({"type": "_next", "next": this.next});
  this.event.data.list=this.event.data.list.concat(actionList);
  this.next = null;
  this.parseAction();
  return this.result;
}

////// 判断某对象是否不为undefined也不会null //////
ActionParser.prototype.isset = function (val) {
    if (val === undefined || val === null) {
        return false;
    }
    return true
}

ActionParser.prototype.StepString = function(steplist) {
  var stepchar = {
    'up': '上',
    'down': '下',
    'left': '左',
    'right': '右',
    'forward': '前',
    'backward': '后'
  }
  var StepString = '';
  var last = null, number = 0;
  steplist.forEach(function (v) {
    if (v != last) {
      if (last != null) {
        StepString += stepchar[last];
        if (number > 1) StepString += number;
      }
      last = v;
      number = 1;
    } else {
      number++;
    }
  });
  if (last != null) {
      StepString += stepchar[last];
      if (number > 1) StepString += number;
  }
  return StepString;
}

ActionParser.prototype.EvalString = function(EvalString) {
  return EvalString.split('\b').join('\\b').split('\t').join('\\t').split('\n').join('\\n');
}

ActionParser.prototype.getTitleAndPosition = function (string) {
  string = this.EvalString(string);
  var title = '', icon = '', position = '';
  string = string.replace(/\\t\[(([^\],]+),)?([^\],]+)\]/g, function (s0, s1, s2, s3) {
    if (s3) title = s3;
    if (s2) { icon = s3; title = s2; }
    if (icon && !/^(.*)\.(jpg|jpeg|png)$/.test(icon) 
        && !/^[0-9a-zA-Z_][0-9a-zA-Z_:]*$/.test(icon)) { title += "," + icon; icon = ''; }
    return "";
  }).replace(/\\b\[(.*?)\]/g, function (s0, s1) {
    position = s1; return "";
  });
  return [title, icon, position, string];
}

ActionParser.prototype.Colour = function(color) {
  return color?JSON.stringify(color).slice(1,-1):null;
}

ActionParser.prototype.matchId = function(args) {
  var rt=function(xml,args){
    // 此处刻意不写成 xml:MotaActionBlocks[str].xmlText 来方便搜索
    return {ret:true,xml:xml,args:args}
  }
  var match = /nothing/.exec('nothing')
  // 固定列表
  var FixedId_List=MotaActionBlocks.idFixedList_e.json.args0[0].options; // [["生命", "status:hp"], ...]
  match=new RegExp('^('+FixedId_List.map(function(v){return v[1]}).join('|')+')$').exec(args[0])
  if(match){
    return rt(MotaActionBlocks['idFixedList_e'].xmlText, args);
  }
  // 独立开关
  match=/^switch:([A-Z])$/.exec(args[0])
  if(match){
    args[0]=match[1]
    return rt(MotaActionBlocks['idFlag_e'].xmlText, args);
  }
  // 临时变量
  match=/^temp:([A-Z])$/.exec(args[0])
  if(match){
    args[0]=match[1]
    return rt(MotaActionBlocks['idTemp_e'].xmlText, args);
  }
  // id列表
  var Id_List = MotaActionBlocks.idIdList_e.json.args0[0].options; // [["变量", "flag"], ...]
  match=new RegExp('^('+Id_List.map(function(v){return v[1]}).join('|')+'):([a-zA-Z0-9_\\u4E00-\\u9FCC]+)$').exec(args[0])
  if(match){
    args=[match[1],MotaActionFunctions.replaceToName_token(match[2])]
    return rt(MotaActionBlocks['idIdList_e'].xmlText, args);
  }
  return {ret:false}
}

ActionParser.prototype.matchEvalAtom = function(args) {
  var rt=function(xml,args){
    // 此处刻意不写成 xml:MotaActionBlocks[str].xmlText 来方便搜索
    return {ret:true,xml:xml,args:args}
  }
  var match = /nothing/.exec('nothing')
  // 勾选框
  match = /^(true|false)$/.exec(args[0])
  if(match){
    return rt(MotaActionBlocks['bool_e'].xmlText, args);
  }
  // 怪物属性
  var EnemyId_List=MotaActionBlocks.enemyattr_e.json.args0[1].options; // [["生命", "hp"], ...]
  match=new RegExp("^enemy:([a-zA-Z0-9_]+):(" + EnemyId_List.map(function(v){return v[1]}).join('|') + ")$").exec(args[0])
  if(match){
    args=[match[1],match[2]]
    return rt(MotaActionBlocks['enemyattr_e'].xmlText, args);
  }
  // 图块ID
  match=/^blockId:(-?\d+),(-?\d+)$/.exec(args[0])
  if(match){
    args=[match[1],match[2]]
    return rt(MotaActionBlocks['blockId_e'].xmlText, args);
  }
  // 图块类别
  match=/^blockCls:(-?\d+),(-?\d+)$/.exec(args[0])
  if(match){
    args=[match[1],match[2]]
    return rt(MotaActionBlocks['blockCls_e'].xmlText, args);
  }
  // 装备孔
  match=/^equip:(-?\d+)$/.exec(args[0])
  if(match){
    args[0]=match[1]
    return rt(MotaActionBlocks['equip_e'].xmlText, args);
  }
  return {ret:false}
}

ActionParser.prototype.matchEvalCompare=function(args, isShadow){
  if (MotaActionFunctions.disableExpandCompare) return {ret:false};
  var raw=args[0].replace(/&gt;/g,'>').replace(/&lt;/g,'<').replace(/&quot;/g,'"').replace(/&nbsp;/g,' ').replace(/&amp;/g,'&')
  if (raw[0]+raw.slice(-1)=='()') raw=raw.slice(1,-1);
  var str=raw
  var xml=MotaActionBlocks['expression_arithmetic_0'].xmlText
  if (!/<=|<|>=|>|==|!=|===|!==|&&|\|\|/.exec(str)) return {ret:false};
  str=str.replace(/[^<>=!()&|]/g,' ')
  // 处理括号匹配
  var old;
  do {
    old=str;
    str=str.replace(/\([^()]*\)/g,function(v){return Array.from({length:v.length+1}).join(' ')})
  } while (old!=str);
  // 按优先级依次寻找以下符号
  var oplist=['<','<=','>','>=','==','!=','===','!==','&&','||'].reverse()
  for (var index = 0,op; op=oplist[index]; index++) {
    var match=new RegExp(' '+(op=='||'?'\\|\\|':op)+' ').exec(str)
    if (!match) continue;
    args=[this.expandEvalBlock([raw.slice(0,match.index+1)],isShadow),op.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'),this.expandEvalBlock([raw.slice(match.index+1+op.length)],isShadow)]
    return {ret:true,xml:xml,args:args}
  }
  return {ret:false}
}

ActionParser.prototype.expandIdBlock = function(args, isShadow, comment) {
  args[0]=MotaActionFunctions.replaceFromName(args[0])
  var xml=MotaActionBlocks['idString_e'].xmlText
  var ret=this.matchId(args)
  if (ret.ret){
    xml=ret.xml;
    args=ret.args;
  } else {
    for (var index = 0; index < args.length; index++) {
      args[index]=MotaActionFunctions.replaceToName(args[index])
    }
  }
  return xml(args, isShadow, comment);
}

ActionParser.prototype.expandEvalBlock = function(args, isShadow, comment) {
  args[0]=MotaActionFunctions.replaceFromName(args[0])
  var xml=MotaActionBlocks['evalString_e'].xmlText
  var ret=this.matchId(args)
  if (ret.ret){
    xml=ret.xml;
    args=ret.args;
  } else if( (ret=this.matchEvalAtom(args)).ret ){
    xml=ret.xml;
    args=ret.args;
  } else if(/^(!.*|\(!.*\))$/.exec(args[0])){
    // 非
    xml=MotaActionBlocks['negate_e'].xmlText
    var content=args[0][0]=='!'?args[0].slice(1):args[0].slice(2,-1)
    args[0]=this.expandEvalBlock([content],isShadow)
  } else if( (ret=this.matchEvalCompare(args, isShadow)).ret ){
    // 大小比较
    xml=ret.xml;
    args=ret.args;
  } else {
    for (var index = 0; index < args.length; index++) {
      args[index]=MotaActionFunctions.replaceToName(args[index])
    }
  }
  return xml(args, isShadow, comment);
}

MotaActionFunctions.actionParser = new ActionParser();

MotaActionFunctions.workspace = function(){return workspace}

MotaActionFunctions.parse = function(obj,type) {
  try {
    obj = JSON.parse(MotaActionFunctions.replaceToName(JSON.stringify(obj)));
  } catch (e) {}
  MotaActionFunctions.workspace().clear();
  xml_text = MotaActionFunctions.actionParser.parse(obj,type||'event');
  xml = Blockly.Xml.textToDom('<xml>'+xml_text+'</xml>');
  Blockly.Xml.domToWorkspace(xml, MotaActionFunctions.workspace());
}

MotaActionFunctions.EvalString_pre = function(EvalString){
  if (EvalString.indexOf('__door__')!==-1) throw new Error('请修改开门变量__door__，如door1，door2，door3等依次向后。请勿存在两个门使用相同的开门变量。');
  EvalString = MotaActionFunctions.replaceFromName(EvalString);
  return EvalString.replace(/([^\\])"/g,'$1\\"').replace(/^"/g,'\\"').replace(/""/g,'"\\"');
}

MotaActionFunctions.JsonEvalString_pre = function (JsonEvalString) {
  if (JsonEvalString == '') return '';
  JsonEvalString = MotaActionFunctions.replaceFromName(JsonEvalString);
  try {
    return JSON.stringify(JSON.parse(JsonEvalString));
  } catch (e) {
    throw new Error('此处需要填写一个合法的JSON内容');
  }
}

MotaActionFunctions.IntString_pre = function (IntString) {
  if (!/^\d*$/.test(IntString)) throw new Error('此项必须是整数或不填');
  return IntString;
}

MotaActionFunctions.IdString_pre = function(IdString){
  if (IdString.indexOf('__door__')!==-1) throw new Error('请修改开门变量__door__，如door1，door2，door3等依次向后。请勿存在两个门使用相同的开门变量。');
  IdString = MotaActionFunctions.replaceFromName(IdString);
  if (IdString && !(MotaActionFunctions.pattern.id.test(IdString)) && !(MotaActionFunctions.pattern.idWithoutFlag.test(IdString)))
      throw new Error('id: '+IdString+'中包含了0-9 a-z A-Z _ - :之外的字符');
  return IdString;
}

MotaActionFunctions.PosString_pre = function(PosString){
  if (!PosString || /^-?\d+$/.test(PosString)) return PosString;
  //if (!(MotaActionFunctions.pattern.id.test(PosString)))throw new Error(PosString+'中包含了0-9 a-z A-Z _ 和中文之外的字符,或者是没有以flag: 开头');
  return '"'+MotaActionFunctions.replaceFromName(PosString)+'"';
}

MotaActionFunctions.StepString_pre = function(StepString){
  //StepString='上右3下2左上左2'
  var route = StepString.replace(/上/g,'U').replace(/下/g,'D').replace(/左/g,'L').replace(/右/g,'R').replace(/前/g,'F').replace(/后/g,'B');

  //copyed from core.js
  var ans=[], index=0;

  var isset = function(a) {
    if (a == undefined || a == null) {
      return false;
    }
    return true;
  }
  var getNumber = function (noparse) {
    var num="";
    while (index<route.length && !isNaN(route.charAt(index))) {
      num+=route.charAt(index++);
    }
    if (num.length==0) num="1";
    return isset(noparse)?num:parseInt(num);
  }

  while (index<route.length) {
    var c=route.charAt(index++);
    var number=getNumber();

    switch (c) {
      case "U": for (var i=0;i<number;i++) ans.push("up"); break;
      case "D": for (var i=0;i<number;i++) ans.push("down"); break;
      case "L": for (var i=0;i<number;i++) ans.push("left"); break;
      case "R": for (var i=0;i<number;i++) ans.push("right"); break;
      case "F": for (var i=0;i<number;i++) ans.push("forward"); break;
      case "B": for (var i=0;i<number;i++) ans.push("backward"); break;
    }
  }
  return ans;
}

MotaActionFunctions.ColorString_pre = function (ColorString) {
  if (ColorString && !MotaActionFunctions.pattern.colorRe.test(ColorString))
    throw new Error('颜色格式错误,形如:0~255,0~255,0~255,0~1');
  return ColorString;
}

MotaActionFunctions.FontString_pre = function (FontString) {
  if (FontString && !MotaActionFunctions.pattern.fontRe.test(FontString))
    throw new Error('字体必须是 [italic] [bold] 14px Verdana 这种形式或不填');
  return FontString;
}

MotaActionFunctions.pattern=MotaActionFunctions.pattern||{};
MotaActionFunctions.pattern.id=/^(flag|global):([a-zA-Z0-9_\u4E00-\u9FCC]+)$/;
MotaActionFunctions.pattern.id2=/^flag:([a-zA-Z0-9_\u4E00-\u9FCC]+),flag:([a-zA-Z0-9_\u4E00-\u9FCC]+)$/;
MotaActionFunctions.pattern.idWithoutFlag=/^[0-9a-zA-Z_][0-9a-zA-Z_\-:]*$/;
MotaActionFunctions.pattern.colorRe=/^(25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d),(25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d),(25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)(,0(\.\d+)?|,1)?$/;
MotaActionFunctions.pattern.fontRe=/^(italic )?(bold )?(\d+)px ([a-zA-Z0-9_\u4E00-\u9FCC]+)$/;


MotaActionFunctions.pattern.replaceStatusList = [
  // 保证顺序！
  ["hpmax", "生命上限"],
  ["hp", "生命"],
  ["name", "名称"],
  ["lv", "等级"],
  ["atk", "攻击"],
  ["def", "防御"],
  ["mdef", "护盾"],
  ["manamax", "魔力上限"],
  ["mana", "魔力"],
  ["money", "金币"],
  ["exp", "经验"],
  ["steps", "步数"],
];

MotaActionFunctions.pattern.replaceItemList = [
  // 保证顺序！
  ["yellowKey", "黄钥匙"],
  ["blueKey", "蓝钥匙"],
  ["redKey", "红钥匙"],
  ["redGem", "红宝石"],
  ["blueGem", "蓝宝石"],
  ["greenGem", "绿宝石"],
  ["yellowGem", "黄宝石"],
  ["redPotion", "红血瓶"],
  ["bluePotion", "蓝血瓶"],
  ["yellowPotion", "黄血瓶"],
  ["greenPotion", "绿血瓶"],
  ["sword1", "铁剑"],
  ["sword2", "银剑"],
  ["sword3", "骑士剑"],
  ["sword4", "圣剑"],
  ["sword5", "神圣剑"],
  ["shield1", "铁盾"],
  ["shield2", "银盾"],
  ["shield3", "骑士盾"],
  ["shield4", "圣盾"],
  ["shield5", "神圣盾"],
  ["superPotion", "圣水"],
  ["silverCoin", "银币"],
  ["book", "怪物手册"],
  ["fly", "楼层传送器"],
  ["coin", "幸运金币"],
  ["freezeBadge", "冰冻徽章"],
  ["cross", "十字架"],
  ["dagger", "屠龙匕首"],
  ["amulet", "护符"],
  ["bigKey", "大黄门钥匙"],
  ["greenKey", "绿钥匙"],
  ["steelKey", "铁门钥匙"],
  ["pickaxe", "破墙镐"],
  ["icePickaxe", "破冰镐"],
  ["bomb", "炸弹"],
  ["centerFly", "中心对称飞行器"],
  ["upFly", "上楼器"],
  ["downFly", "下楼器"],
  ["earthquake", "地震卷轴"],
  ["poisonWine", "解毒药水"],
  ["weakWine", "解衰药水"],
  ["curseWine", "解咒药水"],
  ["superWine", "万能药水"],
  ["hammer", "圣锤"],
  ["lifeWand", "生命魔杖"],
  ["jumpShoes", "跳跃靴"],
];

MotaActionFunctions.pattern.replaceEnemyList = [
  // 保证顺序！
  ["name", "名称"],
  ["atk", "攻击"],
  ["def", "防御"],
  ["money", "金币"],
  ["exp", "经验"],
  ["point", "加点"],
  ["special", "属性"],
];

MotaActionFunctions.disableReplace = false;
MotaActionFunctions.disableExpandCompare = false;

MotaActionFunctions.replaceToName_token = function (str) {
  if (!str || MotaActionFunctions.disableReplace) return str;
  var list = [];
  list=list.concat(MotaActionFunctions.pattern.replaceStatusList)
  list=list.concat(MotaActionFunctions.pattern.replaceItemList)
  list=list.concat(MotaActionFunctions.pattern.replaceEnemyList)
  for(var index=0,pair;pair=list[index];index++){
    if (pair[0]==str) {
      return pair[1]
    }
  }
  return str;
}

MotaActionFunctions.replaceToName = function (str) {
  if (!str || MotaActionFunctions.disableReplace) return str;
  var map = {}, list = [];
  MotaActionFunctions.pattern.replaceStatusList.forEach(function (v) {
    map[v[0]] = v[1]; list.push(v[0]);
  });
  str = str.replace(new RegExp("status:(" + list.join("|") + ")", "g"), function (a, b) {
    return map[b] ? ("状态：" + map[b]) : b;
  }).replace(/status:/g, "状态：");
  map = {}; list = [];
  MotaActionFunctions.pattern.replaceItemList.forEach(function (v) {
    map[v[0]] = v[1]; list.push(v[0]);
  });
  str = str.replace(new RegExp("item:(" + list.join("|") + ")", "g"), function (a, b) {
    return map[b] ? ("物品：" + map[b]) : b;
  }).replace(/item:/g, "物品：");
  str = str.replace(/flag:/g, "变量：").replace(/switch:/g, "独立开关：").replace(/global:/g, "全局存储：").replace(/temp:/g, "临时变量：");

  map = {}; list = [];
  MotaActionFunctions.pattern.replaceEnemyList.forEach(function (v) {
    map[v[0]] = v[1]; list.push(v[0]);
  });
  str = str.replace(new RegExp("enemy:([a-zA-Z0-9_]+).(" + list.join("|") + ")", "g"), function (a, b, c) {
    return map[c] ? ("怪物：" + b + "：" + map[c]) : c;
  }).replace(/enemy:/g, "怪物：");

  str = str.replace(/blockId:/g, "图块ID：").replace(/blockCls:/g, "图块类别：").replace(/equip:/g, "装备孔：");
  return str;
}

MotaActionFunctions.replaceFromName = function (str) {
  if (!str || MotaActionFunctions.disableReplace) return str;
  var map = {}, list = [];
  MotaActionFunctions.pattern.replaceStatusList.forEach(function (v) {
    map[v[1]] = v[0]; list.push(v[1]);
  });
  str = str.replace(new RegExp("状态[:：](" + list.join("|") + ")", "g"), function (a, b) {
    return map[b] ? ("status:" + map[b]) : b;
  }).replace(/状态[:：]/g, "status:");
  map = {}; list = [];
  MotaActionFunctions.pattern.replaceItemList.forEach(function (v) {
    map[v[1]] = v[0]; list.push(v[1]);
  });
  str = str.replace(new RegExp("物品[:：](" + list.join("|") + ")", "g"), function (a, b) {
    return map[b] ? ("item:" + map[b]) : b;
  }).replace(/物品[:：]/g, "item:");
  str = str.replace(/临时变量[:：]/g, "temp:").replace(/变量[:：]/g, "flag:").replace(/独立开关[:：]/g, "switch:").replace(/全局存储[:：]/g, "global:");

  map = {}; list = [];
  MotaActionFunctions.pattern.replaceEnemyList.forEach(function (v) {
    map[v[1]] = v[0]; list.push(v[1]);
  });
  str = str.replace(new RegExp("(enemy:|怪物[:：])([a-zA-Z0-9_]+)[:：](" + list.join("|") + ")", "g"), function (a, b, c, d) {
    return map[d] ? ("enemy:" + c + ":" + map[d]) : d;
  }).replace(/怪物[:：]/g, "enemy:");

  str = str.replace(/图块I[dD][:：]/g, "blockId:").replace(/图块类别[:：]/g, "blockCls:").replace(/装备孔[:：]/g, "equip:");

  return str;
}

}