(function(){
  
  editor_file = {};

  editor_file.getFloorFileList = function(editor,callback){
    if (!isset(callback)) throw('未设置callback');
    var fs = editor.fs;
    fs.readdir('libs/project/floors',function(err, data){
      callback([data,err]);
    });
  }
  //callback([Array<String>,err:String])
  editor_file.loadFloorFile = function(editor,filename,callback){
    //filename不含'/'不含'.js'
    if (!isset(callback)) throw('未设置callback');
    var fs = editor.fs;
    fs.readFile('libs/project/floors/'+filename+'.js','utf-8',function(err, data){
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
      editor.currentfloorData = floorData;
      callback(null)
    });
  }
  //callback(err:String)
  editor_file.saveFloorFile = function(editor,callback){
    if (!isset(callback)) throw('未设置callback');
    if (!isset(editor.currentFloorId) || !isset(editor.currentfloorData)) {
      callback('未选中文件或无数据');
    }
    var filename = 'libs/project/floors/' + editor.currentFloorId + '.js';
    var datastr = ['main.floors.' , editor.currentFloorId , '=\n{'];
    for(var ii in editor.currentfloorData)
    if (editor.currentfloorData.hasOwnProperty(ii)) {
      if (ii=='map')
        datastr=datastr.concat(['\n"',ii,'": [\n',formatMap(editor.currentfloorData[ii]),'\n],']);
      else
        datastr=datastr.concat(['\n"',ii,'": ',JSON.stringify(editor.currentfloorData[ii],null,4),',']);
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
    if (!isset(editor.currentfloorData)) {
      callback('无数据');
    }
    editor.currentfloorData.floorId=saveAsFilename;
    editor.currentFloorId=saveAsFilename;
    editor_file.saveFloorFile(editor,callback);
  }
  //callback(err:String)

  ////////////////////////////////////////////////////////////////////

  editor_file.changeIdAndIdnum = function(editor,id,idnum,info,callback){
    if (!isset(callback)) throw('未设置callback');
    //检查maps中是否有重复的idnum或id
    var change = -1;
    for(var ii in core.maps.blocksInfo){
      if (ii==idnum) {
        if (info.idnum==idnum){change=ii;break;}//修改id
        callback('idnum重复了');
        return;
      }
      if (core.maps.blocksInfo[ii].id==id) {
        if (info.id==id){change=ii;break;}//修改idnum
        callback('id重复了');
        return;
      }
    }
    if (change!=-1 && change!=idnum){//修改idnum
      core.maps.blocksInfo[idnum] = core.maps.blocksInfo[change];
      delete(core.maps.blocksInfo[change]);
    } else if (change==idnum) {//修改id
      var oldid = core.maps.blocksInfo[idnum].id;
      core.maps.blocksInfo[idnum].id = id;
      for(var ii in core.icons.icons){
        if (ii.hasOwnProperty(oldid)){
          ii[id]=ii[oldid];
          delete(ii[oldid]);
        }
      }
    } else {//创建新的
      core.maps.blocksInfo[idnum]={'cls': info.images, 'id':id};
      core.icons.icons[info.images][id]=info.y;
    }
    
    throw('尚未实现:save(core.maps.blocksInfo,map.js);save(core.icons.icons,icons.js);')
    callback(null);
  }
  //callback(err:String)
  editor_file.editItem = function(editor,id,obj,callback){
    //obj形式同callback的obj,为null或undefined时只查询不修改
    if (!isset(callback)) throw('未设置callback');
    callback(
      {'items':{'cls': 'items', 'name': '红宝石'},'itemEffect':'core.status.hero.atk += core.values.redJewel','itemEffectTip':"'，攻击+'+core.values.redJewel"},
      {'items':'','itemEffect':'','itemEffectTip':''},
      null);
      //只有items.cls是items的才有itemEffect和itemEffectTip,keys和constants和tools只有items
  }
  /*
  <<
  {'items':{'cls': 'items', 'name': '红宝石'},'itemEffect':'core.status.hero.atk += core.values.redJewel','itemEffectTip':"'，攻击+'+core.values.redJewel"}
  ==
  [
    ["change","['items']['name']","红宝石的新名字"],
    ["add","['items']['新的和name同级的属性']",123],
    ["change","['itemEffectTip']","'，攻击力+'+core.values.redJewel"],
  ]
  >>
  'yellowKey': {'cls': 'keys' \*只能取keys items constants tools\n$range(thiseval in ['keys','items','constants','tools'])\n*\ , 'name': '黄钥匙'}

  $range((function(){typeof(thiseval)==typeof(0)||})())
  if( 注释.indexof('$range(')!= -1){
    thiseval = 新值;
    evalstr = 注释.split('$range')[1].split('\n')[0];
    if(eval(evalstr) !== true)alert('不在取值范围内')
  }
  */

  //callback(obj,commentObj,err:String)
  editor_file.editEnemy = function(editor,id,obj,callback){
    //obj形式同callback的obj,为null或undefined时只查询不修改
    if (!isset(callback)) throw('未设置callback');
    callback(
      {'name': '初级巫师', 'hp': 100, 'atk': 120, 'def': 0, 'money': 16, 'experience': 0, 'special': 15, 'value': 100, "bomb": false},
      {'name': '名称', 'hp': '生命值', 'atk': '攻击力', 'def': '防御力', 'money': '金币', 'experience': '经验', 'special': '特殊属性\n1:先攻,2:魔攻,3:坚固,4:2连击,5:3连击,6:4连击,7:破甲,8:反击,9:净化,10:模仿,11:吸血,12:中毒,13:衰弱,14:诅咒,15:领域,16:夹击,17:仇恨\n多个属性例如用010411表示先攻2连击吸血\n模仿怪的攻防设为0就好\n', 'value': '特殊属性的数值\n领域怪需要加value表示领域伤害的数值\n吸血怪需要在后面添加value代表吸血比例', 'bomb':' 加入 "bomb": false 代表该怪物不可被炸弹或圣锤炸掉'},
      null);
  }
  //callback(obj,commentObj,err:String)

  ////////////////////////////////////////////////////////////////////  

  editor_file.editLoc = function(editor,x,y,obj,callback){
    //obj形式同callback的obj,为null或undefined时只查询不修改
    if (!isset(callback)) throw('未设置callback');
    callback(
      {"events":['\t[老人,man]这些是本样板支持的所有的道具。\n\n道具分为三类：items, constants, tools。\nitems 为即捡即用类道具，例如宝石、血瓶、剑盾等。\nconstants 为永久道具，例如怪物手册、楼层传送器、幸运金币等。\ntools 为消耗类道具，例如破墙镐、炸弹、中心对称飞行器等。\n\n后两类道具在工具栏中可以看到并使用。', '\t[老人,man]有关道具效果，定义在items.js中。\n目前大多数道具已有默认行为，如有自定义的需求则需在items.js中修改代码。', '\t[老人,man]constants 和 tools 各最多只允许12种，多了会导致图标溢出。', '\t[老人,man]拾取道具结束后可触发 afterGetItem 事件。\n\n有关事件的各种信息在下一层会有更为详细的说明。', {'type': 'hide', 'time': 500}],"changeFloor":"","afterBattle":"","afterGetItem":"","afterOpenDoor":""},
      {"events":['', '', '', '', {'type': '', 'time': ' // 消失 \n // 守着门的老人 '}],"changeFloor":"","afterBattle":"","afterGetItem":"","afterOpenDoor":""},
      null);
  }
  //callback(obj,commentObj,err:String)

  ////////////////////////////////////////////////////////////////////  

  editor_file.editFloor = function(editor,obj,callback){
    //obj形式同callback的obj,为null或undefined时只查询不修改
    if (!isset(callback)) throw('未设置callback');
    callback(
      {'floorId': 'sample0', 'title': '样板 0 层', 'name': '0', 'canFlyTo': True, 'canUseQuickShop': True, 'defaultGround': 'ground', 'firstArrive': ['\t[样板提示]首次到达某层可以触发 firstArrive 事件，该事件可类似于RMXP中的“自动执行脚本”。\n\n本事件支持一切的事件类型，常常用来触发对话，例如：', '\t[hero]我是谁？我从哪来？我又要到哪去？', '\t[仙子,fairy]你问我...？我也不知道啊...', '本层主要对道具、门、怪物等进行介绍，有关事件的各种信息在下一层会有更为详细的说明。']},
      {'floorId': '// 这里需要改楼层名，请和文件名及下面的floorId保持完全一致 // 楼层唯一标识符仅能由字母、数字、下划线组成，且不能由数字开头 // 推荐用法：第20层就用MT20，第38层就用MT38，地下6层就用MT_6（用下划线代替负号），隐藏3层用MT3h（h表示隐藏），等等 \n // 楼层唯一标识符，需要和名字完全一致 ', 'title': ' // 楼层中文名 ', 'name': ' // 显示在状态栏中的层数 ', 'canFlyTo': ' // 该楼能否被楼传器飞到（不能的话在该楼也不允许使用楼传器） ', 'canUseQuickShop': ' // 该层是否允许使用快捷商店 ', 'defaultGround': ' // 默认地面的图块ID（terrains中） \n // 地图数据，需要是13x13，建议使用地图生成器来生成 ', 'firstArrive': ['', '', '', ' // 该楼的所有可能事件列表 \n // 守着道具的老人 ']},
      null);
  }
  //callback(obj,commentObj,err:String)

  ////////////////////////////////////////////////////////////////////



  editor_file.editTower = function(editor,obj,callback){
    //obj形式同callback的obj,为null或undefined时只查询不修改
    if (!isset(callback)) throw('未设置callback');
    callback(
      {'main': {'useCompress': False, 'floorIds': ['sample0', 'sample1', 'sample2', 'test']}, 'firstData': {'title': '魔塔样板', 'name': 'template', 'version': 'Ver 1.0.0 (Beta)', 'floorId': 'sample0', 'hero': {'name': '阳光', 'lv': 1, 'hp': 2000, 'atk': 100, 'def': 100, 'mdef': 100, 'money': 100, 'experience': 0, 'items': {'keys': {'yellowKey': 0, 'blueKey': 0, 'redKey': 0}, 'constants': {}, 'tools': {}}, 'flyRange': [], 'loc': {'direction': 'up', 'x': 6, 'y': 10}, 'flags': {'poison': False, 'weak': False, 'curse': False}}, 'startText': ['Hi，欢迎来到 HTML5 魔塔样板！\n\n本样板由艾之葵制作，可以让你在不会写任何代码\n的情况下也能做出属于自己的H5魔塔！', '这里游戏开始时的剧情。\n定义在data.js的startText处。\n\n你可以在这里写上自己的内容。', '赶快来试一试吧！'], 'shops': {'moneyShop1': {'name': '贪婪之神', 'icon': 'blueShop', 'textInList': '1F金币商店', 'use': 'money', 'need': '20+10*times*(times+1)', 'text': '勇敢的武士啊，给我${need}金币就可以：', 'choices': [{'text': '生命+800', 'effect': 'status:hp+=800'}, {'text': '攻击+4', 'effect': 'status:atk+=4'}, {'text': '防御+4', 'effect': 'status:def+=4'}, {'text': '魔防+10', 'effect': 'status:mdef+=10'}]}, 'expShop1': {'name': '经验之神', 'icon': 'pinkShop', 'textInList': '1F经验商店', 'use': 'experience', 'need': '-1', 'text': '勇敢的武士啊，给我若干经验就可以：', 'choices': [{'text': '等级+1', 'need': '100', 'effect': 'status:lv+=1;status:hp+=1000;status:atk+=7;status:def+=7'}, {'text': '攻击+5', 'need': '30', 'effect': 'status:atk+=5'}, {'text': '防御+5', 'need': '30', 'effect': 'status:def+=5'}]}}, 'levelUp': [{}, {'need': 20, 'name': '第二级', 'effect': 'status:hp+=2*(status:atk+status:def);status:atk+=10;status:def+=10'}, {'need': 40, 'effect': 'function () {\n                core.drawText("恭喜升级！");\n                core.status.hero.hp *= 2;\n                core.status.hero.atk += 100;\n                core.status.hero.def += 100;\n            }'}]}, 'values': {'HPMAX': 999999, 'lavaDamage': 100, 'poisonDamage': 10, 'weakValue': 20, 'redJewel': 3, 'blueJewel': 3, 'greenJewel': 5, 'redPotion': 100, 'bluePotion': 250, 'yellowPotion': 500, 'greenPotion': 800, 'sword1': 10, 'shield1': 10, 'sword2': 20, 'shield2': 20, 'sword3': 40, 'shield3': 40, 'sword4': 80, 'shield4': 80, 'sword5': 160, 'shield5': 160, 'moneyPocket': 500, 'breakArmor': 0.9, 'counterAttack': 0.1, 'purify': 3, 'hatred': 2, 'animateSpeed': 500}, 'flags': {'enableNegativeDamage': True, 'enableFloor': False, 'enableLv': True, 'enableMDef': True, 'enableMoney': True, 'enableExperience': True, 'enableLevelUp': False, 'enableDebuff': True, 'flyNearStair': True, 'pickaxeFourDirections': True, 'bombFourDirections': True, 'bigKeyIsBox': False, 'startDirectly': False, 'canOpenBattleAnimate': True, 'showBattleAnimateConfirm': True, 'battleAnimate': True, 'displayEnemyDamage': True, 'displayExtraDamage': False, 'enableGentleClick': True, 'portalWithoutTrigger': True, 'potionWhileRouting': False}},
      {'main': {'useCompress': ' // 是否使用压缩文件 // 当你即将发布你的塔时，请使用“JS代码压缩工具”将所有js代码进行压缩，然后将这里的useCompress改为true。 // 请注意，只有useCompress是false时才会读取floors目录下的文件，为true时会直接读取libs目录下的floors.min.js文件。 // 如果要进行剧本的修改请务必将其改成false。 \n // 在这里按顺序放所有的楼层；其顺序直接影响到楼层传送器的顺序和上楼器/下楼器的顺序 ', 'floorIds': ['', '', '', '']}, 'firstData': {'title': ' // 游戏名，将显示在标题页面以及切换楼层的界面中 ', 'name': ' // 游戏的唯一英文标识符。由英文、数字、下划线组成，不能超过20个字符。 ', 'version': ' // 当前游戏版本；版本不一致的存档不能通用。 ', 'floorId': ' // 初始楼层ID \n // 勇士初始数据 ', 'hero': {'name': ' // 勇士名；可以改成喜欢的 ', 'lv': ' // 初始等级，该项必须为正整数 ', 'hp': ' // 初始生命值 ', 'atk': ' // 初始攻击 ', 'def': ' // 初始防御 ', 'mdef': ' // 初始魔防 ', 'money': ' // 初始金币 ', 'experience': ' // 初始经验 \n // 初始道具个数 ', 'items': {'keys': {'yellowKey': '', 'blueKey': '', 'redKey': ''}, 'constants': '', 'tools': ''}, 'flyRange': ' // 初始可飞的楼层；一般留空数组即可 ', 'loc': {'direction': '', 'x': '', 'y': ' // 勇士初始位置 \n // 游戏过程中的变量或flags '}, 'flags': {'poison': ' // 毒 ', 'weak': ' // 衰 ', 'curse': ' // 咒 \n // 游戏开始前剧情。如果无剧情直接留一个空数组即可。 '}}, 'startText': ['', '', ' // 定义全局商店（即快捷商店） \n // 商店唯一ID '], 'shops': {'moneyShop1': {'name': ' // 商店名称（标题） ', 'icon': ' // 商店图标，blueShop为蓝色商店，pinkShop为粉色商店 ', 'textInList': ' // 在快捷商店栏中显示的名称 ', 'use': ' // 商店所要使用的。只能是"money"或"experience"。 ', 'need': ' // 商店需要的金币/经验数值；可以是一个表达式，以times作为参数计算。 // 这里用到的times为该商店的已经的访问次数。首次访问该商店时times的值为0。 // 上面的例子是50层商店的计算公式。你也可以写任意其他的计算公式，只要以times作为参数即可。 // 例如： "need": "25" 就是恒定需要25金币的商店； "need": "20+2*times" 就是第一次访问要20金币，以后每次递增2金币的商店。 // 如果是对于每个选项有不同的计算公式，写 "need": "-1" 即可。可参见下面的经验商店。 ', 'text': ' // 显示的文字，需手动加换行符。可以使用${need}表示上面的need值。 \n // 商店的选项 ', 'choices': [{'text': '', 'effect': ' // 如果有多个effect以分号分开，参见下面的经验商店 '}, {'text': '', 'effect': ''}, {'text': '', 'effect': ''}, {'text': '', 'effect': ' // effect只能对status和item进行操作，不能修改flag值。 // 必须是X+=Y的形式，其中Y可以是一个表达式，以status:xxx或item:xxx为参数 // 其他effect样例： // "item:yellowKey+=1" 黄钥匙+1 // "item:pickaxe+=3" 破墙镐+3 // "status:hp+=2*(status:atk+status:def)" 将生命提升攻防和的数值的两倍 \n // 商店唯一ID '}]}, 'expShop1': {'name': '', 'icon': '', 'textInList': '', 'use': ' // 该商店使用的是经验进行计算 ', 'need': ' // 如果是对于每个选项所需要的数值不同，这里直接写-1，然后下面选项里给定具体数值 ', 'text': ' // 在choices中写need，可以针对每个选项都有不同的需求。 // 这里的need同样可以以times作为参数，比如 "need": "100+20*times" ', 'choices': [{'text': '', 'need': '', 'effect': ' // 多个effect直接以分号分开即可。如上面的意思是生命+1000，攻击+7，防御+7。 '}, {'text': '', 'need': '', 'effect': ''}, {'text': '', 'need': '', 'effect': ' // 经验升级所需要的数值，是一个数组 '}]}}, 'levelUp': [' // 第一项为初始等级，可以简单留空，也可以写name // 每一个里面可以含有三个参数 name, need, effect // need为所需要的经验数值，是一个正整数。请确保need所需的依次递增 // name为该等级的名称，也可以省略代表使用系统默认值；本项将显示在状态栏中 // effect为本次升级所执行的操作，可由若干项组成，由分号分开 // 其中每一项写法和上面的商店完全相同，同样必须是X+=Y的形式，Y是一个表达式，同样可以使用status:xxx或item:xxx代表勇士的某项数值/道具个数 ', {'need': '', 'name': '', 'effect': ' // 先将生命提升攻防和的2倍；再将攻击+10，防御+10 // effect也允许写一个function，代表本次升级将会执行的操作 '}, {'need': '', 'effect': ' // 依次往下写需要的数值即可 \n // 各种数值；一些数值可以在这里设置 \n /****** 角色相关 ******/ '}]}, 'values': {'HPMAX': ' // HP上限；-1则无上限 ', 'lavaDamage': ' // 经过血网受到的伤害 ', 'poisonDamage': ' // 中毒后每步受到的伤害 ', 'weakValue': ' // 衰弱状态下攻防减少的数值 /****** 道具相关 ******/ ', 'redJewel': ' // 红宝石加攻击的数值 ', 'blueJewel': ' // 蓝宝石加防御的数值 ', 'greenJewel': ' // 绿宝石加魔防的数值 ', 'redPotion': ' // 红血瓶加血数值 ', 'bluePotion': ' // 蓝血瓶加血数值 ', 'yellowPotion': ' // 黄血瓶加血数值 ', 'greenPotion': ' // 绿血瓶加血数值 ', 'sword1': ' // 铁剑加攻数值 ', 'shield1': ' // 铁盾加防数值 ', 'sword2': ' // 银剑加攻数值 ', 'shield2': ' // 银盾加防数值 ', 'sword3': ' // 骑士剑加攻数值 ', 'shield3': ' // 骑士盾加防数值 ', 'sword4': ' // 圣剑加攻数值 ', 'shield4': ' // 圣盾加防数值 ', 'sword5': ' // 神圣剑加攻数值 ', 'shield5': ' // 神圣盾加防数值 ', 'moneyPocket': ' // 金钱袋加金币的数值 /****** 怪物相关 ******/ ', 'breakArmor': ' // 破甲的比例（战斗前，怪物附加角色防御的x%作为伤害） ', 'counterAttack': ' // 反击的比例（战斗时，怪物每回合附加角色攻击的x%作为伤害，无视角色防御） ', 'purify': ' // 净化的比例（战斗前，怪物附加勇士魔防的x倍作为伤害） ', 'hatred': ' // 仇恨属性中，每杀死一个怪物获得的仇恨值 /****** 系统相关 ******/ ', 'animateSpeed': ' // 动画时间 \n // 系统FLAG，在游戏运行中中请不要修改它。 \n /****** 角色状态相关 ******/ '}, 'flags': {'enableNegativeDamage': ' // 是否支持负伤害（回血） ', 'enableFloor': ' // 是否在状态栏显示当前楼层 ', 'enableLv': ' // 是否在状态栏显示当前等级 ', 'enableMDef': ' // 是否在状态栏及战斗界面显示魔防（护盾） ', 'enableMoney': ' // 是否在状态栏、怪物手册及战斗界面显示金币 ', 'enableExperience': ' // 是否在状态栏、怪物手册及战斗界面显示经验 ', 'enableLevelUp': ' // 是否允许等级提升（进阶）；如果上面enableExperience为false，则此项恒视为false ', 'enableDebuff': ' // 是否涉及毒衰咒；如果此项为false则不会在状态栏中显示毒衰咒的debuff ////// 上述的几个开关将直接影响状态栏的显示效果 ////// /****** 道具相关 ******/ ', 'flyNearStair': ' // 是否需要在楼梯边使用传送器 ', 'pickaxeFourDirections': ' // 使用破墙镐是否四个方向都破坏；如果false则只破坏面前的墙壁 ', 'bombFourDirections': ' // 使用炸弹是否四个方向都会炸；如果false则只炸面前的怪物（即和圣锤等价） ', 'bigKeyIsBox': ' // 如果此项为true，则视为钥匙盒，红黄蓝钥匙+1；若为false，则视为大黄门钥匙 /****** 系统相关 ******/ ', 'startDirectly': ' // 点击“开始游戏”后是否立刻开始游戏而不显示难度选择界面 ', 'canOpenBattleAnimate': ' // 是否允许用户开启战斗过程；如果此项为false，则下面两项均强制视为false ', 'showBattleAnimateConfirm': ' // 是否在游戏开始时提供“是否开启战斗动画”的选项 ', 'battleAnimate': ' // 是否默认显示战斗动画；用户可以手动在菜单栏中开关 ', 'displayEnemyDamage': ' // 是否地图怪物显伤；用户可以手动在菜单栏中开关 ', 'displayExtraDamage': ' // 是否地图高级显伤（领域、夹击等）；用户可以手动在菜单栏中开关 ', 'enableGentleClick': ' // 是否允许轻触（获得面前物品） ', 'portalWithoutTrigger': ' // 经过楼梯、传送门时是否能“穿透”。穿透的意思是，自动寻路得到的的路径中间经过了楼梯，行走时是否触发楼层转换事件 ', 'potionWhileRouting': ' // 寻路算法是否经过血瓶；如果该项为false，则寻路算法会自动尽量绕过血瓶 '}},
      null);
  }
  //callback(obj,commentObj,err:String)

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
})();