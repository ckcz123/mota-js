http://127.0.0.1:1055/_docs/#/blocksdemo

方便测试用

这种写法不会生成按钮
```js
'run';
return bg.parseList(['行内']);
// return bg.parse(['asdasd','df'],'event')+'<br>'+bg.parseList(['asfewg','sty']);
```
并且是行内的

这种写法之后的版本会补一个按钮'添加到常用事件', 目前先这样吧

``` MotaAction.event
[
    '显示文章',
    '...'
]
```

``` MotaAction.shop
      [{
        "id": "shop1",
        "text": "\t[贪婪之神,moneyShop]勇敢的武士啊, 给我${20+2*flag:shop1}金币就可以：", 
        "textInList": "1F金币商店",  
        "choices": [ 
          {"text": "生命+800", "need": "status:money>=20+2*flag:shop1", "action": [
            {"type": "setValue", "name": "status:money", "operator": "-=", "value": "20+2*flag:shop1"},
            {"type": "setValue", "name": "flag:shop1", "operator": "+=", "value": "1"},
            {"type": "setValue", "name": "status:hp", "operator": "+=", "value": "800"}
          ]}
        ]
      },{
        "id": "itemShop",
        "item": true,
        "textInList": "道具商店",
        "choices": [
          {"id": "yellowKey", "number": 10, "money": 10}
        ]
      },{
        "id": "keyShop1",
        "textInList": "回收钥匙商店",
        "commonEvent": "回收钥匙商店",
        "args": ""
      }]
```

``` MotaAction.action
'显示文章'
```

``` MotaAction
['MotaAction.action的anction可以省略','只写MotaAction']
```