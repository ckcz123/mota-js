var events_c12a15a8_c380_4b28_8144_256cba95f760 = 
{
	"commonEvent": {
		"加点事件": [
			{
				"type": "comment",
				"text": "flag:point表示当前应该的加点数值"
			},
			{
				"type": "choices",
				"choices": [
					{
						"text": "攻击+${1*flag:point}",
						"action": [
							{
								"type": "setValue",
								"name": "status:atk",
								"value": "status:atk+1*flag:point"
							}
						]
					},
					{
						"text": "防御+${2*flag:point}",
						"action": [
							{
								"type": "setValue",
								"name": "status:def",
								"value": "status:def+2*flag:point"
							}
						]
					},
					{
						"text": "生命+${200*flag:point}",
						"action": [
							{
								"type": "setValue",
								"name": "status:hp",
								"value": "status:hp+200*flag:point"
							}
						]
					}
				]
			},
			{
				"type": "setValue",
				"name": "flag:point",
				"value": "null"
			}
		],
		"毒衰咒处理": [
			{
				"type": "comment",
				"text": "获得毒衰咒效果，flag:debuff为要获得的类型"
			},
			{
				"type": "switch",
				"condition": "flag:debuff",
				"caseList": [
					{
						"case": "'poison'",
						"action": [
							{
								"type": "comment",
								"text": "获得毒效果"
							},
							{
								"type": "if",
								"condition": "!flag:poison",
								"true": [
									{
										"type": "setValue",
										"name": "flag:poison",
										"value": "true"
									}
								],
								"false": []
							}
						]
					},
					{
						"case": "'weak'",
						"action": [
							{
								"type": "comment",
								"text": "获得衰效果"
							},
							{
								"type": "if",
								"condition": "!flag:weak",
								"true": [
									{
										"type": "setValue",
										"name": "flag:weak",
										"value": "true"
									},
									{
										"type": "if",
										"condition": "core.values.weakValue>=1",
										"true": [
											{
												"type": "comment",
												"text": ">=1：直接扣数值"
											},
											{
												"type": "setValue",
												"name": "status:atk",
												"value": "status:atk-core.values.weakValue"
											},
											{
												"type": "setValue",
												"name": "status:def",
												"value": "status:def-core.values.weakValue"
											}
										],
										"false": [
											{
												"type": "comment",
												"text": "<1：扣比例"
											},
											{
												"type": "setValue",
												"name": "flag:equip_atk_buff",
												"value": "core.getFlag('equip_atk_buff',1)-core.values.weakValue"
											},
											{
												"type": "setValue",
												"name": "flag:equip_def_buff",
												"value": "core.getFlag('equip_def_buff',1)-core.values.weakValue"
											}
										]
									}
								],
								"false": []
							}
						]
					},
					{
						"case": "'curse'",
						"action": [
							{
								"type": "comment",
								"text": "获得咒效果"
							},
							{
								"type": "if",
								"condition": "!flag:curse",
								"true": [
									{
										"type": "setValue",
										"name": "flag:curse",
										"value": "true"
									}
								],
								"false": []
							}
						]
					}
				]
			},
			{
				"type": "setValue",
				"name": "flag:debuff",
				"value": "null"
			}
		]
	}
}