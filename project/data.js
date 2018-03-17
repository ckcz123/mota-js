data_a1e2fb4a_e986_4524_b0da_9b7ba7c0874d = 
{
	"main" : {
		"floorIds" : [ 
			"sample0", "sample1", "sample2"
		],
		"images" : [
			"bg.jpg",
		],
		"animates" : [ 
			"hand", "sword", "zone", "yongchang",
		],
		"bgms" : [ 
			'bgm.mp3', 'qianjin.mid', 'star.mid',
		],
		"sounds" : [ 
			'floor.mp3', 'attack.ogg', 'door.ogg', 'item.ogg', 'zone.ogg'
		],
		"bgmRemote" : false,
		"startBackground" : "bg.jpg",
		"startLogoStyle" : "color: black",
		"levelChoose" : [["简单","Easy"],["普通","Normal"],["困难","Hard"],["噩梦","Hell"]],
	},
	"firstData" : {
		"title": "魔塔样板",
		"name": "template",
		"version": "Ver 2.0",
		"floorId": "sample0",
		"hero": { 
			"name": "阳光",
			'lv': 1,
			"hpmax": 9999,
			"hp": 1000,
			"atk": 100,
			"def": 100,
			"mdef": 100,
			"money": 100,
			"experience": 0,
			"items": { 
				"keys": {
					"yellowKey": 0,
					"blueKey": 0,
					"redKey": 0
				},
				"constants": {},
				"tools": {}
			},
			"flyRange": [],
			"loc": {"direction": "up", "x": 6, "y": 10},
			"flags": { 
				"poison": false,
				"weak": false,
				"curse": false,
			},
			"steps": 0,
		},
		"startText": [ 
			"Hi，欢迎来到 HTML5 魔塔样板！\n\n本样板由艾之葵制作，可以让你在不会写任何代码\n的情况下也能做出属于自己的H5魔塔！",
			"这里游戏开始时的剧情。\n定义在data.js的startText处。\n\n你可以在这里写上自己的内容。",
			"赶快来试一试吧！"
		],
		"shops": [
			{
				"id": "moneyShop1",
				"name": "贪婪之神",
				"icon": "blueShop",
				"textInList": "1F金币商店",
				"use": "money",
				"need": "20+10*times*(times+1)",
				"text": "勇敢的武士啊，给我${need}金币就可以：",
				"choices": [
					{"text": "生命+800", "effect": "status:hp+=800"},
					{"text": "攻击+4", "effect": "status:atk+=4"},
					{"text": "防御+4", "effect": "status:def+=4"},
					{"text": "魔防+10", "effect": "status:mdef+=10"}
				]
			},
			{
				"id": "expShop1",
				"name": "经验之神",
				"icon": "pinkShop",
				"textInList": "1F经验商店",
				"use": "experience",
				"need": "-1",
				"text": "勇敢的武士啊，给我若干经验就可以：",
				"choices": [
					{"text": "等级+1", "need": "100", "effect": "status:lv+=1;status:hp+=1000;status:atk+=7;status:def+=7"},
					{"text": "攻击+5", "need": "30", "effect": "status:atk+=5"},
					{"text": "防御+5", "need": "30", "effect": "status:def+=5"},
				]
			}
		],
		"levelUp": [ 
		    {},
		    {"need": 20, "name": "第二级", "effect": "status:hp+=2*(status:atk+status:def);status:atk+=10;status:def+=10"},
		    {"need": 40, "effect": function () {
			core.insertAction("恭喜升级！");
			core.status.hero.hp *= 2;
			core.status.hero.atk += 100;
			core.status.hero.def += 100;
		}},
		]
	},
	
	"values" : {
		"lavaDamage": 100,
		"poisonDamage": 10,
		"weakValue": 20,
		"redJewel": 3,
		"blueJewel": 3,
		"greenJewel": 5,
		"redPotion": 100,
		"bluePotion": 250,
		"yellowPotion": 500,
		"greenPotion": 800,
		"sword0": 0,
		"shield0": 0,
		"sword1": 10,
		"shield1": 10,
		"sword2": 20,
		"shield2": 20,
		"sword3": 40,
		"shield3": 40,
		"sword4": 80,
		"shield4": 80,
		"sword5": 160,
		"shield5": 160,
		"moneyPocket": 500,
		'breakArmor': 0.9,
		'counterAttack': 0.1,
		'purify': 3,
		'hatred': 2,
		'animateSpeed': 300,
	},
	
	"flags" : {
		"enableFloor": true,
		"enableLv": false,
		"enableHPMax": false,
		"enableMDef": true,
		"enableMoney": true,
		"enableExperience": false,
		"enableLevelUp": false,
		"enableDebuff": false,
		"flyNearStair": true,
		"pickaxeFourDirections": true,
		"bombFourDirections": true,
		"bigKeyIsBox": false,
		"equipment": true,
		"enableDeleteItem": true,
		"enableAddPoint": false,
		"enableNegativeDamage": true,
		"hatredDecrease": true,
		"betweenAttackCeil": false,
		"startDirectly": false,
		"canOpenBattleAnimate": true,
		"showBattleAnimateConfirm": true,
		"battleAnimate": true,
		"displayEnemyDamage": true,
		"displayExtraDamage": true,
		"enableGentleClick": true,
		"potionWhileRouting": false,
		"enableViewMaps": true,
		"portalWithoutTrigger": true,
		"enableMoveDirectly": true,
	}
}