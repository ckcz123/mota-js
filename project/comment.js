comment = 
{
    "items" : {
        'items':{
            'cls': "只能取keys items constants tools\n$range(thiseval in ['keys','items','constants','tools'])$end", 
            'name': '名称', 
            'text': '道具在道具栏中显示的描述'
        },
        'itemEffect':'cls为items的即捡即用类物品的效果,执行时会对这里的字符串执行eval()',
        'itemEffectTip':'cls为items的即捡即用类物品,在获得时左上角额外显示的文字,执行时会对这里的字符串执行eval()得到字符串'
    },
    "enemys" : {
        'name': '名称', 
        'hp': '生命值', 
        'atk': '攻击力', 
        'def': '防御力', 
        'money': '金币', 
        'experience': '经验', 
        'special': '特殊属性\n1:先攻,2:魔攻,3:坚固,4:2连击,5:3连击,6:n连击,7:破甲,8:反击,9:净化,10:模仿,11:吸血,12:中毒,13:衰弱,14:诅咒,15:领域,16:夹击,17:仇恨,18:阻击,19:自爆,20:无敌\n多个属性例如用[1,4,11]表示先攻2连击吸血\n模仿怪的攻防设为0就好\n', 
        'value': '特殊属性的数值\n领域怪需要加value表示领域伤害的数值\n吸血怪需要在后面添加value代表吸血比例', 
        'zoneSquare': '领域怪zoneSquare代表是否九宫格伤害',
        'range': 'range可选，代表领域伤害的范围；不加默认为1\n$range(thiseval==~~thiseval &&thiseval>0)$end',
        'bomb':' 加入 "bomb": false 代表该怪物不可被炸弹或圣锤炸掉$range(thiseval in [true,false])$end',
        'point': 'point可以在打败怪物后进行加点，详见文档说明\n$range(thiseval==~~thiseval && thiseval>0)$end',
        'n': '多连击需要在后面指定n代表是几连击\n$range(thiseval==~~thiseval &&thiseval>0)$end',
    }
}