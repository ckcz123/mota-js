//不允许缺省的标记
INT_CHECK = '999843861743683';
IdString_CHECK = 'this_id_must_be_inputted';
EvalString_CHECK = 'this_value_must_be_inputted';

motaActionBlocks_4a3632a9_8716_48b3_bf55_4ebbc4ff040c = [
  {
    "type": "evalstring_e",
    "message0": "%1",
    "args0": [
      {
        "type": "field_input",
        "name": "EvalString",
        "text": "EvalString"
      }
    ],
    "inputsInline": true,
    "output": null,
    "colour": 330,
    "tooltip": "",
    "helpUrl": "",
    "generFunc": function(block) {
      var text_evalstring = block.getFieldValue('EvalString');
      var code = text_evalstring;
      return [code, Blockly.JavaScript.ORDER_ATOMIC];
    }
  },
  {
    "type": "evalstring_all_e",
    "message0": "%1 %2",
    "args0": [
      {
        "type": "field_dropdown",
        "name": "IdString",
        "options": [
          [
            "status",
            "status"
          ],
          [
            "item",
            "item"
          ],
          [
            "flag",
            "flag"
          ]
        ]
      },
      {
        "type": "field_input",
        "name": "EvalString",
        "text": "hp"
      }
    ],
    "inputsInline": true,
    "output": null,
    "colour": 330,
    "tooltip": "",
    "helpUrl": "",
    "generFunc": function(block) {
      var dropdown_idstring = block.getFieldValue('IdString');
      var text_evalstring = block.getFieldValue('EvalString');
      var code = dropdown_idstring+':'+text_evalstring;
      return [code, Blockly.JavaScript.ORDER_ATOMIC];
    }
  },
  {
    "type": "event_m",
    "message0": "事件 %1 %2",
    "args0": [
      {
        "type": "input_dummy"
      },
      {
        "type": "input_statement",
        "name": "actionList",
        "check": "actionList"
      }
    ],
    "colour": 260,
    "tooltip": "编辑魔塔的事件",
    "helpUrl": "https://ckcz123.github.io/mota-js/#/event",
    "generFunc": function(block) {
      var statements_actionlist = Blockly.JavaScript.statementToCode(block, 'actionList');
      var code = statements_actionlist;
      return code;
    }
  },
  {
    "type": "actionlist",
    "message0": "动作集合 %1 %2",
    "args0": [
      {
        "type": "input_dummy"
      },
      {
        "type": "input_statement",
        "name": "ACTIONS",
        "check": "statement"
      }
    ],
    "previousStatement": "actionList",
    "colour": 120,
    "tooltip": "构成事件的动作集合",
    "helpUrl": "https://ckcz123.github.io/mota-js/#/event",
    "generFunc": function(block) {
      var statements_actions = Blockly.JavaScript.statementToCode(block, 'ACTIONS');
      var code = '[\n'+statements_actions+']\n';
      return code;
    }
  },
  {
    "type": "text_s_1",
    "message0": "显示文章: %1",
    "args0": [
      {
        "type": "field_input",
        "name": "Evalstring",
        "text": "欢迎使用事件编辑器"
      }
    ],
    "previousStatement": "statement",
    "nextStatement": "statement",
    "colour": 160,
    "tooltip": "text：显示一段文字（剧情）",
    "helpUrl": "https://ckcz123.github.io/mota-js/#/event?id=text%ef%bc%9a%e6%98%be%e7%a4%ba%e4%b8%80%e6%ae%b5%e6%96%87%e5%ad%97%ef%bc%88%e5%89%a7%e6%83%85%ef%bc%89",
    "generFunc": function(block) {
      var text_evalstring = block.getFieldValue('Evalstring')||EvalString_CHECK;
      var code = '"'+text_evalstring+'",\n';
      return code;
    }
  },
  {
    "type": "text_s_2",
    "message0": "标题 %1 图像 %2 : %3",
    "args0": [
      {
        "type": "field_input",
        "name": "EvalString",
        "text": "小妖精"
      },
      {
        "type": "field_input",
        "name": "IdString",
        "text": "fairy"
      },
      {
        "type": "field_input",
        "name": "Evalstring_1",
        "text": "欢迎使用事件编辑器"
      }
    ],
    "previousStatement": "statement",
    "nextStatement": "statement",
    "colour": 160,
    "tooltip": "text：显示一段文字（剧情）,标题和图像均可为空,图像输id",
    "helpUrl": "https://ckcz123.github.io/mota-js/#/event?id=text%ef%bc%9a%e6%98%be%e7%a4%ba%e4%b8%80%e6%ae%b5%e6%96%87%e5%ad%97%ef%bc%88%e5%89%a7%e6%83%85%ef%bc%89",
    "generFunc": function(block) {
      var text_evalstring = block.getFieldValue('EvalString');
      var text_idstring = block.getFieldValue('IdString');
      var text_evalstring_1 = block.getFieldValue('Evalstring_1')||EvalString_CHECK;
      var title='';
      if (text_evalstring==''){
        if (text_idstring=='')title='';
        else title='\t['+text_idstring+']';
      } else {
        if (text_idstring=='')title='\t['+text_evalstring+']';
        else title='\t['+text_evalstring+','+text_idstring+']';
      }
      var code =  '"'+title+text_evalstring_1+'",\n';
      return code;
    }
  },
  {
    "type": "tip_s",
    "message0": "显示提示: %1",
    "args0": [
      {
        "type": "field_input",
        "name": "EvalString",
        "text": "这段话将在左上角以气泡形式显示"
      }
    ],
    "previousStatement": "statement",
    "nextStatement": "statement",
    "colour": 160,
    "tooltip": "tip：显示一段提示文字",
    "helpUrl": "https://ckcz123.github.io/mota-js/#/event?id=tip%ef%bc%9a%e6%98%be%e7%a4%ba%e4%b8%80%e6%ae%b5%e6%8f%90%e7%a4%ba%e6%96%87%e5%ad%97",
    "generFunc": function(block) {
      var text_evalstring = block.getFieldValue('EvalString')||EvalString_CHECK;
      var code = '{"type": "tip", "text": "'+text_evalstring+'"},\n';
      return code;
    }
  },
  {
    "type": "setvalue_s",
    "message0": "变量操作: 名称 %1 值 %2",
    "args0": [
      {
        "type": "input_value",
        "name": "EvalString"
      },
      {
        "type": "input_value",
        "name": "EvalString_1"
      }
    ],
    "inputsInline": true,
    "previousStatement": "statement",
    "nextStatement": "statement",
    "colour": 160,
    "tooltip": "setValue：设置勇士的某个属性、道具个数，或某个变量/Flag的值",
    "helpUrl": "https://ckcz123.github.io/mota-js/#/event?id=text%ef%bc%9a%e6%98%be%e7%a4%ba%e4%b8%80%e6%ae%b5%e6%96%87%e5%ad%97%ef%bc%88%e5%89%a7%e6%83%85%ef%bc%89",
    "generFunc": function(block) {
      var value_evalstring = Blockly.JavaScript.valueToCode(block, 'EvalString', Blockly.JavaScript.ORDER_NONE)||EvalString_CHECK;
      var value_evalstring_1 = Blockly.JavaScript.valueToCode(block, 'EvalString_1', Blockly.JavaScript.ORDER_NONE)||EvalString_CHECK;
      var code = '{"type": "setValue", "name": "'+value_evalstring+'", "value": "'+value_evalstring_1+'"},\n';
      return code;
    }
  },
  {
    "type": "show_s",
    "message0": "显示事件 x %1 ,y %2 楼层 %3 动画时间 %4",
    "args0": [
      {
        "type": "field_number",
        "name": "INT",
        "value": 0,
        "min": 0,
        "max": 12,
        "precision": 1
      },
      {
        "type": "field_number",
        "name": "INT_1",
        "value": 0,
        "min": 0,
        "max": 12,
        "precision": 1
      },
      {
        "type": "field_input",
        "name": "IdString",
        "text": ""
      },
      {
        "type": "field_input",
        "name": "INT_2",
        "text": ""
      }
    ],
    "inputsInline": true,
    "previousStatement": "statement",
    "nextStatement": "statement",
    "colour": 160,
    "tooltip": "show: 将一个禁用事件启用,楼层和动画时间可不填",
    "helpUrl": "https://ckcz123.github.io/mota-js/#/event?id=show-%e5%b0%86%e4%b8%80%e4%b8%aa%e7%a6%81%e7%94%a8%e4%ba%8b%e4%bb%b6%e5%90%af%e7%94%a8",
    "generFunc": function(block) {
      var number_int = block.getFieldValue('INT')||INT_CHECK;
      var number_int_1 = block.getFieldValue('INT_1')||INT_CHECK;
      var text_idstring = block.getFieldValue('IdString');
      var text_int_2 = block.getFieldValue('INT_2');
      text_idstring = text_idstring && (', "floorId": "'+text_idstring+'"');
      text_int_2 = text_int_2 && (', "time": '+text_int_2);
      var code = '{"type": "show", "loc": ['+number_int+','+number_int_1+']'+text_idstring+''+text_int_2+'},\n';
      return code;
    }
  },
  {
    "type": "hide_s",
    "message0": "隐藏事件 x %1 ,y %2 楼层 %3 动画时间 %4",
    "args0": [
      {
        "type": "field_input",
        "name": "INT",
        "text": ""
      },
      {
        "type": "field_input",
        "name": "INT_1",
        "text": ""
      },
      {
        "type": "field_input",
        "name": "IdString",
        "text": ""
      },
      {
        "type": "field_input",
        "name": "INT_2",
        "text": ""
      }
    ],
    "inputsInline": true,
    "previousStatement": "statement",
    "nextStatement": "statement",
    "colour": 160,
    "tooltip": "hide: 将一个启用事件禁用,所有参数均可不填,代表禁用事件自身",
    "helpUrl": "https://ckcz123.github.io/mota-js/#/event?id=hide-%e5%b0%86%e4%b8%80%e4%b8%aa%e5%90%af%e7%94%a8%e4%ba%8b%e4%bb%b6%e7%a6%81%e7%94%a8",
    "generFunc": function(block) {
      var text_int = block.getFieldValue('INT');
      var text_int_1 = block.getFieldValue('INT_1');
      var text_idstring = block.getFieldValue('IdString');
      var text_int_2 = block.getFieldValue('INT_2');
      var floorstr = '';
      if (text_int && text_int_1)
      floorstr = ', "loc": ['+text_int+','+text_int_1+']'
      text_idstring = text_idstring && (', "floorId": "'+text_idstring+'"');
      text_int_2 = text_int_2 && (', "time": '+text_int_2);
      var code = '{"type": "hide"'+floorstr+text_idstring+''+text_int_2+'},\n';
      return code;
    }
  },
  {
    "type": "trigger_s",
    "message0": "触发事件 x %1 ,y %2",
    "args0": [
      {
        "type": "field_number",
        "name": "INT",
        "value": 0,
        "min": 0,
        "max": 12,
        "precision": 1
      },
      {
        "type": "field_number",
        "name": "INT_1",
        "value": 0,
        "min": 0,
        "max": 12,
        "precision": 1
      }
    ],
    "inputsInline": true,
    "previousStatement": "statement",
    "nextStatement": "statement",
    "colour": 160,
    "tooltip": "trigger: 立即触发另一个地点的事件",
    "helpUrl": "https://ckcz123.github.io/mota-js/#/event?id=trigger-%e7%ab%8b%e5%8d%b3%e8%a7%a6%e5%8f%91%e5%8f%a6%e4%b8%80%e4%b8%aa%e5%9c%b0%e7%82%b9%e7%9a%84%e4%ba%8b%e4%bb%b6",
    "generFunc": function(block) {
      var number_int = block.getFieldValue('INT')||INT_CHECK;
      var number_int_1 = block.getFieldValue('INT_1')||INT_CHECK;
      var code = '{"type": "trigger", "loc": ['+number_int+','+number_int_1+']},\n';
      return code;
    }
  },
  {
    "type": "revisit_s",
    "message0": "重启当前事件",
    "inputsInline": true,
    "previousStatement": "statement",
    "nextStatement": "statement",
    "colour": 160,
    "tooltip": "revisit: 立即重启当前事件",
    "helpUrl": "https://ckcz123.github.io/mota-js/#/event?id=revisit-%e7%ab%8b%e5%8d%b3%e9%87%8d%e5%90%af%e5%bd%93%e5%89%8d%e4%ba%8b%e4%bb%b6",
    "generFunc": function(block) {
      var code = '{"type": "revisit"},\n';
      return code;
    }
  },
  {
    "type": "exit_s",
    "message0": "立刻结束当前事件",
    "inputsInline": true,
    "previousStatement": "statement",
    "nextStatement": "statement",
    "colour": 160,
    "tooltip": "exit: 立刻结束当前事件",
    "helpUrl": "https://ckcz123.github.io/mota-js/#/event?id=exit-%e7%ab%8b%e5%88%bb%e7%bb%93%e6%9d%9f%e5%bd%93%e5%89%8d%e4%ba%8b%e4%bb%b6",
    "generFunc": function(block) {
      var code = '{"type": "exit"},\n';
      return code;
    }
  },
  {
    "type": "update_s",
    "message0": "更新状态栏和地图显伤",
    "inputsInline": true,
    "previousStatement": "statement",
    "nextStatement": "statement",
    "colour": 160,
    "tooltip": "update: 立刻更新状态栏和地图显伤",
    "helpUrl": "https://ckcz123.github.io/mota-js/#/event?id=update-%e7%ab%8b%e5%88%bb%e6%9b%b4%e6%96%b0%e7%8a%b6%e6%80%81%e6%a0%8f%e5%92%8c%e5%9c%b0%e5%9b%be%e6%98%be%e4%bc%a4",
    "generFunc": function(block) {
      var code = '{"type": "update"},\n';
      return code;
    }
  },
  {
    "type": "sleep_s",
    "message0": "等待 %1 毫秒",
    "args0": [
      {
        "type": "field_number",
        "name": "INT",
        "value": 500,
        "min": 0,
        "precision": 1
      }
    ],
    "inputsInline": true,
    "previousStatement": "statement",
    "nextStatement": "statement",
    "colour": 160,
    "tooltip": "sleep: 等待多少毫秒",
    "helpUrl": "https://ckcz123.github.io/mota-js/#/event?id=sleep-%e7%ad%89%e5%be%85%e5%a4%9a%e5%b0%91%e6%af%ab%e7%a7%92",
    "generFunc": function(block) {
      var number_int = block.getFieldValue('INT')||INT_CHECK;
      var code = '{"type": "sleep", "time": '+number_int+'},\n';
      return code;
    }
  },
  {
    "type": "battle_s",
    "message0": "强制战斗 %1",
    "args0": [
      {
        "type": "field_input",
        "name": "IdString",
        "text": "greenSlime"
      }
    ],
    "inputsInline": true,
    "previousStatement": "statement",
    "nextStatement": "statement",
    "colour": 160,
    "tooltip": "battle: 强制战斗",
    "helpUrl": "https://ckcz123.github.io/mota-js/#/event?id=battle-%e5%bc%ba%e5%88%b6%e6%88%98%e6%96%97",
    "generFunc": function(block) {
      var text_idstring = block.getFieldValue('IdString')||IdString_CHECK;
      var code = '{"type": "battle", "id": "'+text_idstring+'"},\n';
      return code;
    }
  },
  {
    "type": "opendoor_s",
    "message0": "开门 x %1 ,y %2 楼层 %3",
    "args0": [
      {
        "type": "field_number",
        "name": "INT",
        "value": 0,
        "min": 0,
        "max": 12,
        "precision": 1
      },
      {
        "type": "field_number",
        "name": "INT_1",
        "value": 0,
        "min": 0,
        "max": 12,
        "precision": 1
      },
      {
        "type": "field_input",
        "name": "IdString",
        "text": ""
      }
    ],
    "inputsInline": true,
    "previousStatement": "statement",
    "nextStatement": "statement",
    "colour": 160,
    "tooltip": "openDoor: 开门,楼层可不填表示当前层",
    "helpUrl": "https://ckcz123.github.io/mota-js/#/event?id=opendoor-%e5%bc%80%e9%97%a8",
    "generFunc": function(block) {
      var number_int = block.getFieldValue('INT')||INT_CHECK;
      var number_int_1 = block.getFieldValue('INT_1')||INT_CHECK;
      var text_idstring = block.getFieldValue('IdString');
      // TODO: Assemble JavaScript into code variable.
      text_idstring = text_idstring && (', "floorId": "'+text_idstring+'"');
      var code = '{"type": "openDoor", "loc": ['+number_int+','+number_int_1+']'+text_idstring+'},\n';
      return code;
    }
  },
  {
    "type": "changefloor_s",
    "message0": "楼层切换 %1 x %2 ,y %3 朝向 %4 动画时间 %5",
    "args0": [
      {
        "type": "field_input",
        "name": "IdString",
        "text": "MT1"
      },
      {
        "type": "field_number",
        "name": "INT",
        "value": 0,
        "min": 0,
        "max": 12,
        "precision": 1
      },
      {
        "type": "field_number",
        "name": "INT_1",
        "value": 0,
        "min": 0,
        "max": 12,
        "precision": 1
      },
      {
        "type": "field_dropdown",
        "name": "EvalString",
        "options": [
          [
            "不变",
            ""
          ],
          [
            "上",
            "up"
          ],
          [
            "下",
            "down"
          ],
          [
            "左",
            "left"
          ],
          [
            "右",
            "right"
          ]
        ]
      },
      {
        "type": "field_input",
        "name": "INT_2",
        "text": ""
      }
    ],
    "inputsInline": true,
    "previousStatement": "statement",
    "nextStatement": "statement",
    "colour": 160,
    "tooltip": "changeFloor: 楼层切换,动画时间可不填",
    "helpUrl": "https://ckcz123.github.io/mota-js/#/event?id=changefloor-%e6%a5%bc%e5%b1%82%e5%88%87%e6%8d%a2",
    "generFunc": function(block) {
      var text_idstring = block.getFieldValue('IdString')||IdString_CHECK;
      var number_int = block.getFieldValue('INT')||INT_CHECK;
      var number_int_1 = block.getFieldValue('INT_1')||INT_CHECK;
      var dropdown_evalstring = block.getFieldValue('EvalString');
      var text_int_2 = block.getFieldValue('INT_2');
      dropdown_evalstring = dropdown_evalstring && (', "direction": "'+dropdown_evalstring+'"');
      text_int_2 = text_int_2 && (', "time": '+text_int_2);
      var code = '{"type": "changeFloor", "floorId": "'+text_idstring+'"，"loc": ['+number_int+', '+number_int_1+']'+dropdown_evalstring+text_int_2+' },\n';
      return code;
    }
  },
  {
    "type": "changepos_s_1",
    "message0": "位置切换 x %1 ,y %2 朝向 %3",
    "args0": [
      {
        "type": "field_number",
        "name": "INT",
        "value": 0,
        "min": 0,
        "max": 12,
        "precision": 1
      },
      {
        "type": "field_number",
        "name": "INT_2",
        "value": 0,
        "min": 0,
        "max": 12,
        "precision": 1
      },
      {
        "type": "field_dropdown",
        "name": "EvalString",
        "options": [
          [
            "不变",
            ""
          ],
          [
            "上",
            "up"
          ],
          [
            "下",
            "down"
          ],
          [
            "左",
            "left"
          ],
          [
            "右",
            "right"
          ]
        ]
      }
    ],
    "inputsInline": true,
    "previousStatement": "statement",
    "nextStatement": "statement",
    "colour": 160,
    "tooltip": "changePos: 当前位置切换",
    "helpUrl": "https://ckcz123.github.io/mota-js/#/event?id=changepos-%e5%bd%93%e5%89%8d%e4%bd%8d%e7%bd%ae%e5%88%87%e6%8d%a2%e5%8b%87%e5%a3%ab%e8%bd%ac%e5%90%91",
    "generFunc": function(block) {
      var number_int = block.getFieldValue('INT')||INT_CHECK;
      var number_int_2 = block.getFieldValue('INT_2')||INT_CHECK;
      var dropdown_evalstring = block.getFieldValue('EvalString');
      dropdown_evalstring = dropdown_evalstring && (', "direction": "'+dropdown_evalstring+'"');
      var code = '{"type": "changePos", "loc": ['+number_int+','+number_int_2+']'+dropdown_evalstring+'},\n';
      return code;
    }
  },
  {
    "type": "changepos_s_2",
    "message0": "勇士转向 %1",
    "args0": [
      {
        "type": "field_dropdown",
        "name": "EvalString",
        "options": [
          [
            "上",
            "up"
          ],
          [
            "下",
            "down"
          ],
          [
            "左",
            "left"
          ],
          [
            "右",
            "right"
          ]
        ]
      }
    ],
    "inputsInline": true,
    "previousStatement": "statement",
    "nextStatement": "statement",
    "colour": 160,
    "tooltip": "changePos: 勇士转向",
    "helpUrl": "https://ckcz123.github.io/mota-js/#/event?id=changepos-%e5%bd%93%e5%89%8d%e4%bd%8d%e7%bd%ae%e5%88%87%e6%8d%a2%e5%8b%87%e5%a3%ab%e8%bd%ac%e5%90%91",
    "generFunc": function(block) {
      var dropdown_evalstring = block.getFieldValue('EvalString')||EvalString_CHECK;
      var code = '{"type": "changePos", "direction": "'+dropdown_evalstring+'"},\n';
      return code;
    }
  },
  {
    "type": "openshop_s",
    "message0": "打开全局商店 %1",
    "args0": [
      {
        "type": "field_input",
        "name": "IdString",
        "text": "shop1"
      }
    ],
    "inputsInline": true,
    "previousStatement": "statement",
    "nextStatement": "statement",
    "colour": 160,
    "tooltip": "全局商店",
    "helpUrl": "https://ckcz123.github.io/mota-js/#/event?id=%e5%85%a8%e5%b1%80%e5%95%86%e5%ba%97",
    "generFunc": function(block) {
      var text_idstring = block.getFieldValue('IdString')||IdString_CHECK;
      var code = '{"type": "openShop", "id": "'+text_idstring+'"},\n';
      return code;
    }
  },
  {
    "type": "disableshop_s",
    "message0": "禁用全局商店 %1",
    "args0": [
      {
        "type": "field_input",
        "name": "IdString",
        "text": "shop1"
      }
    ],
    "inputsInline": true,
    "previousStatement": "statement",
    "nextStatement": "statement",
    "colour": 160,
    "tooltip": "全局商店",
    "helpUrl": "https://ckcz123.github.io/mota-js/#/event?id=%e5%85%a8%e5%b1%80%e5%95%86%e5%ba%97",
    "generFunc": function(block) {
      var text_idstring = block.getFieldValue('IdString')||IdString_CHECK;
      var code = '{"type": "disableShop", "id": "'+text_idstring+'"},\n';
      return code;
    }
  },
  {
    "type": "setfg_s_1",
    "message0": "更改画面色调 %1 %2 %3 %4 动画时间 %5",
    "args0": [
      {
        "type": "field_number",
        "name": "INT",
        "value": 255,
        "min": 0,
        "max": 255,
        "precision": 1
      },
      {
        "type": "field_number",
        "name": "INT_1",
        "value": 255,
        "min": 0,
        "max": 255,
        "precision": 1
      },
      {
        "type": "field_number",
        "name": "INT_2",
        "value": 255,
        "min": 0,
        "max": 255,
        "precision": 1
      },
      {
        "type": "field_number",
        "name": "EvalString",
        "value": 1,
        "min": 0,
        "max": 1,
        "precision": 0.001
      },
      {
        "type": "field_input",
        "name": "INT_3",
        "text": ""
      }
    ],
    "inputsInline": true,
    "previousStatement": "statement",
    "nextStatement": "statement",
    "colour": 160,
    "tooltip": "setFg: 更改画面色调,动画时间可不填",
    "helpUrl": "https://ckcz123.github.io/mota-js/#/event?id=setfg-%e6%9b%b4%e6%94%b9%e7%94%bb%e9%9d%a2%e8%89%b2%e8%b0%83",
    "generFunc": function(block) {
      var number_int = block.getFieldValue('INT')||INT_CHECK;
      var number_int_1 = block.getFieldValue('INT_1')||INT_CHECK;
      var number_int_2 = block.getFieldValue('INT_2')||INT_CHECK;
      var number_evalstring = block.getFieldValue('EvalString')||EvalString_CHECK;
      var text_int_3  = block.getFieldValue('INT_3');
      text_int_3  = text_int_3  && (', "time": '+text_int_3 );
      var code = '{"type": "setFg", "color": ['+number_int+','+number_int_1+','+number_int_2+','+number_evalstring+']'+text_int_3 +'},\n';
      return code;
    }
  },
  {
    "type": "setfg_s_2",
    "message0": "恢复画面色调  动画时间 %1",
    "args0": [
      {
        "type": "field_input",
        "name": "INT",
        "text": ""
      }
    ],
    "inputsInline": true,
    "previousStatement": "statement",
    "nextStatement": "statement",
    "colour": 160,
    "tooltip": "setFg: 恢复画面色调,动画时间可不填",
    "helpUrl": "https://ckcz123.github.io/mota-js/#/event?id=setfg-%e6%9b%b4%e6%94%b9%e7%94%bb%e9%9d%a2%e8%89%b2%e8%b0%83",
    "generFunc": function(block) {
      var text_int  = block.getFieldValue('INT');
      text_int  = text_int  && (', "time": '+text_int );
      var code = '{"type": "setFg"'+text_int +'},\n';
      return code;
    }
  },
  {
    "type": "move_s",
    "message0": "移动事件 x %1 ,y %2 动画时间 %3 立刻消失 %4 移动序列 %5",
    "args0": [
      {
        "type": "field_input",
        "name": "INT",
        "text": ""
      },
      {
        "type": "field_input",
        "name": "INT_1",
        "text": ""
      },
      {
        "type": "field_input",
        "name": "INT_2",
        "text": ""
      },
      {
        "type": "field_checkbox",
        "name": "EvalString",
        "checked": true
      },
      {
        "type": "field_input",
        "name": "EvalString_1",
        "text": "上右3下2左上左2"
      }
    ],
    "inputsInline": true,
    "previousStatement": "statement",
    "nextStatement": "statement",
    "colour": 160,
    "tooltip": "move: 让某个NPC/怪物移动,位置可不填代表当前事件",
    "helpUrl": "https://ckcz123.github.io/mota-js/#/event?id=move-%e8%ae%a9%e6%9f%90%e4%b8%aanpc%e6%80%aa%e7%89%a9%e7%a7%bb%e5%8a%a8",
    "generFunc": function(block) {
      var text_int = block.getFieldValue('INT');
      var text_int_1 = block.getFieldValue('INT_1');
      var text_int_2 = block.getFieldValue('INT_2');
      var checkbox_evalstring = block.getFieldValue('EvalString') == 'TRUE';
      var text_evalstring_1 = block.getFieldValue('EvalString_1')||EvalString_CHECK;
      var floorstr = '';
      if (text_int && text_int_1)
      floorstr = ', "loc": ['+text_int+','+text_int_1+']'
      text_int_2 = text_int_2 && (', "time": '+text_int_2);
      var code = '{"type": "move"'+floorstr+''+text_int_2+', "steps": '+JSON.stringify(moveStepParser_2ac833aa_9115_48fc_b816_08cc229bb4d0(text_evalstring_1))+', "immediateHide": '+checkbox_evalstring+'},\n';
      return code;
    }
  },
  {
    "type": "movehero_s",
    "message0": "移动勇士  动画时间 %1 移动序列 %2",
    "args0": [
      {
        "type": "field_input",
        "name": "INT",
        "text": ""
      },
      {
        "type": "field_input",
        "name": "EvalString",
        "text": "上右3下2左上左2"
      }
    ],
    "inputsInline": true,
    "previousStatement": "statement",
    "nextStatement": "statement",
    "colour": 160,
    "tooltip": "moveHero：移动勇士,用这种方式移动勇士的过程中将无视一切地形，无视一切事件，中毒状态也不会扣血",
    "helpUrl": "https://ckcz123.github.io/mota-js/#/event?id=movehero%ef%bc%9a%e7%a7%bb%e5%8a%a8%e5%8b%87%e5%a3%ab",
    "generFunc": function(block) {
      var text_int = block.getFieldValue('INT');
      var text_evalstring = block.getFieldValue('EvalString')||EvalString_CHECK;
      text_int = text_int && (', "time": '+text_int);
      var code = '{"type": "moveHero"'+text_int+', "steps": '+JSON.stringify(moveStepParser_2ac833aa_9115_48fc_b816_08cc229bb4d0(text_evalstring))+'},\n';
      return code;
    }
  },
  {
    "type": "playbgm_s",
    "message0": "播放背景音乐: %1",
    "args0": [
      {
        "type": "field_input",
        "name": "EvalString",
        "text": "bgm.mp3"
      }
    ],
    "previousStatement": "statement",
    "nextStatement": "statement",
    "colour": 160,
    "tooltip": "playBgm: 播放背景音乐",
    "helpUrl": "https://ckcz123.github.io/mota-js/#/event?id=playbgm-%e6%92%ad%e6%94%be%e8%83%8c%e6%99%af%e9%9f%b3%e4%b9%90",
    "generFunc": function(block) {
      var text_evalstring = block.getFieldValue('EvalString')||EvalString_CHECK;
      var code = '{"type": "playBgm", "name": "'+text_evalstring+'"},\n';
      return code;
    }
  },
  {
    "type": "pausebgm_s",
    "message0": "暂停背景音乐",
    "previousStatement": "statement",
    "nextStatement": "statement",
    "colour": 160,
    "tooltip": "pauseBgm: 暂停背景音乐",
    "helpUrl": "https://ckcz123.github.io/mota-js/#/event?id=pausebgm-%e6%9a%82%e5%81%9c%e8%83%8c%e6%99%af%e9%9f%b3%e4%b9%90",
    "generFunc": function(block) {
      var code = '{"type": "pauseBgm"},\n';
      return code;
    }
  },
  {
    "type": "resumebgm_s",
    "message0": "恢复背景音乐",
    "previousStatement": "statement",
    "nextStatement": "statement",
    "colour": 160,
    "tooltip": "resumeBgm: 恢复背景音乐",
    "helpUrl": "https://ckcz123.github.io/mota-js/#/event?id=resumebgm-%e6%81%a2%e5%a4%8d%e8%83%8c%e6%99%af%e9%9f%b3%e4%b9%90",
    "generFunc": function(block) {
      var code = '{"type": "resumeBgm"},\n';
      return code;
    }
  },
  {
    "type": "playsound_s",
    "message0": "播放音效: %1",
    "args0": [
      {
        "type": "field_input",
        "name": "EvalString",
        "text": "item.ogg"
      }
    ],
    "previousStatement": "statement",
    "nextStatement": "statement",
    "colour": 160,
    "tooltip": "playSound: 播放音效",
    "helpUrl": "https://ckcz123.github.io/mota-js/#/event?id=playsound-%e6%92%ad%e6%94%be%e9%9f%b3%e6%95%88",
    "generFunc": function(block) {
      var text_evalstring = block.getFieldValue('EvalString')||EvalString_CHECK;
      var code = '{"type": "playSound", "name": "'+text_evalstring+'"},\n';
      return code;
    }
  },
  {
    "type": "win_s",
    "message0": "游戏胜利, 原因: %1",
    "args0": [
      {
        "type": "field_input",
        "name": "EvalString",
        "text": ""
      }
    ],
    "previousStatement": "statement",
    "nextStatement": "statement",
    "colour": 160,
    "tooltip": "win: 获得胜利, 该事件会显示获胜页面，并重新游戏",
    "helpUrl": "https://ckcz123.github.io/mota-js/#/event?id=win-%e8%8e%b7%e5%be%97%e8%83%9c%e5%88%a9",
    "generFunc": function(block) {
      var text_evalstring = block.getFieldValue('EvalString');
      var code = '{"type": "win", "reason": "'+text_evalstring+'"},\n';
      return code;
    }
  },
  {
    "type": "lose_s",
    "message0": "游戏失败, 原因: %1",
    "args0": [
      {
        "type": "field_input",
        "name": "EvalString",
        "text": ""
      }
    ],
    "previousStatement": "statement",
    "nextStatement": "statement",
    "colour": 160,
    "tooltip": "lose: 游戏失败, 该事件会显示失败页面，并重新开始游戏",
    "helpUrl": "https://ckcz123.github.io/mota-js/#/event?id=lose-%e6%b8%b8%e6%88%8f%e5%a4%b1%e8%b4%a5",
    "generFunc": function(block) {
      var text_evalstring = block.getFieldValue('EvalString');
      var code = '{"type": "lose", "reason": "'+text_evalstring+'"},\n';
      return code;
    }
  },
  {
    "type": "if_s",
    "message0": "如果 %1 %2 否则 %3 %4",
    "args0": [
      {
        "type": "input_value",
        "name": "EvalString"
      },
      {
        "type": "input_statement",
        "name": "actionList",
        "check": "actionList"
      },
      {
        "type": "input_dummy"
      },
      {
        "type": "input_statement",
        "name": "actionList_1",
        "check": "actionList"
      }
    ],
    "inputsInline": true,
    "previousStatement": "statement",
    "nextStatement": "statement",
    "colour": 160,
    "tooltip": "if: 条件判断",
    "helpUrl": "https://ckcz123.github.io/mota-js/#/event?id=if-%e6%9d%a1%e4%bb%b6%e5%88%a4%e6%96%ad",
    "generFunc": function(block) {
      var value_evalstring = Blockly.JavaScript.valueToCode(block, 'EvalString', Blockly.JavaScript.ORDER_NONE)||EvalString_CHECK;
      var statements_actionlist = Blockly.JavaScript.statementToCode(block, 'actionList')||'[]';
      var statements_actionlist_1 = Blockly.JavaScript.statementToCode(block, 'actionList_1')||'[]';
      // TODO: Assemble JavaScript into code variable.
      var code = ['{"type": "if", "condition": "',value_evalstring,'",\n',
        '"true": \n',statements_actionlist,',\n',
        '"false": \n',statements_actionlist_1,'\n',
      '},\n'].join('');
      return code;
    }
  },
  {
    "type": "choices_s",
    "message0": "选项 %1 %2 %3",
    "args0": [
      {
        "type": "field_input",
        "name": "EvalString",
        "text": "提示文字:选择一种钥匙"
      },
      {
        "type": "input_dummy"
      },
      {
        "type": "input_statement",
        "name": "choicesContextList",
        "check": "choicesContext"
      }
    ],
    "previousStatement": "statement",
    "nextStatement": "statement",
    "colour": 160,
    "tooltip": "choices: 给用户提供选项",
    "helpUrl": "https://ckcz123.github.io/mota-js/#/event?id=choices-%e7%bb%99%e7%94%a8%e6%88%b7%e6%8f%90%e4%be%9b%e9%80%89%e9%a1%b9",
    "generFunc": function(block) {
      var text_evalstring = block.getFieldValue('EvalString')||EvalString_CHECK;
      var statements_choicescontextlist = Blockly.JavaScript.statementToCode(block, 'choicesContextList')||'[]';
      // TODO: Assemble JavaScript into code variable.
      var code = ['{"type": "choices", "text": "',text_evalstring,'", "choices": [\n',
        statements_choicescontextlist,
      ']},\n'].join('');
      return code;
    }
  },
  {
    "type": "choicescontext",
    "message0": "子选项 %1 %2 %3",
    "args0": [
      {
        "type": "field_input",
        "name": "EvalString",
        "text": "提示文字:红钥匙"
      },
      {
        "type": "input_dummy"
      },
      {
        "type": "input_statement",
        "name": "actionList",
        "check": "actionList"
      }
    ],
    "previousStatement": "choicesContext",
    "nextStatement": "choicesContext",
    "colour": 120,
    "tooltip": "选项的选择",
    "helpUrl": "https://ckcz123.github.io/mota-js/#/event?id=choices-%e7%bb%99%e7%94%a8%e6%88%b7%e6%8f%90%e4%be%9b%e9%80%89%e9%a1%b9",
    "generFunc": function(block) {
      var text_evalstring = block.getFieldValue('EvalString')||EvalString_CHECK;
      var statements_actionlist = Blockly.JavaScript.statementToCode(block, 'actionList')||'[]';
      // TODO: Assemble JavaScript into code variable.
      var code = '{"text": "'+text_evalstring+'", "action": '+statements_actionlist+'},\n';
      return code;
    }
  },
  {
    "type": "function_s",
    "message0": "自定义JS脚本: %1",
    "args0": [
      {
        "type": "field_input",
        "name": "EvalString",
        "text": "alert(core.getStatus(\"atk\"));"
      }
    ],
    "previousStatement": "statement",
    "nextStatement": "statement",
    "colour": 160,
    "tooltip": "function: 自定义JS脚本",
    "helpUrl": "https://ckcz123.github.io/mota-js/#/event?id=function-%e8%87%aa%e5%ae%9a%e4%b9%89js%e8%84%9a%e6%9c%ac",
    "generFunc": function(block) {
      var text_evalstring = block.getFieldValue('EvalString');
      var code = '{"type": "function", "function": function(){\n'+text_evalstring+'\n}},\n';
      return code;
    }
  }
];


moveStepParser_2ac833aa_9115_48fc_b816_08cc229bb4d0 = function(stepString){
  //stepString='上右3下2左上左2'
  var route = stepString.replace(/上/g,'U').replace(/下/g,'D').replace(/左/g,'L').replace(/右/g,'R');

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
    }
  }
  return ans;
}