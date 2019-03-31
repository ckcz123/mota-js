function maps() {
	
}

maps.prototype.init = function() {
	this.maps = {
		'MT001': {
			'title': '魔塔1层',
			'blocks': [
				{
					'x': 0, 
					'y': 0,
					'fg': {'cls': 'animates', 'id': 'lava', 'animate': 4, 'noPass': true}
				},
				{
					'x': 1, 
					'y': 0,
					'event': {'cls': 'enemys', 'id': 'skullCaptain', 'trigger': 'battle', 'animate': 2, 'noPass': true}
				},
				{
					'x': 2, 
					'y': 0,
					'event': {'cls': 'npcs', 'id': 'oldPaPa', 'animate': 2, 'noPass': true}
				},
				{
					'x': 3, 
					'y': 0,
					'event': {'cls': 'enemys', 'id': 'steelSkull', 'trigger': 'battle', 'animate': 2, 'noPass': true}
				},
				{
					'x': 3, 
					'y': 3,
					'event': {'cls': 'terrains', 'id': 'yellowWall', 'noPass': true}
				},
				{
					'x': 4, 
					'y': 3,
					'event': {'cls': 'terrains', 'id': 'yellowWall', 'noPass': true}
				},
				{
					'x': 6, 
					'y': 3,
					'event': {'cls': 'terrains', 'id': 'yellowWall', 'noPass': true}
				},
				{
					'x': 7, 
					'y': 3,
					'event': {'cls': 'terrains', 'id': 'yellowWall', 'noPass': true}
				},
				{
					'x': 8, 
					'y': 3,
					'event': {'cls': 'terrains', 'id': 'yellowWall', 'noPass': true}
				},
				{
					'x': 8, 
					'y': 4,
					'event': {'cls': 'terrains', 'id': 'yellowWall', 'noPass': true}
				},
				{
					'x': 8, 
					'y': 5,
					'event': {'cls': 'terrains', 'id': 'yellowWall', 'noPass': true}
				},
				{
					'x': 8, 
					'y': 6,
					'event': {'cls': 'terrains', 'id': 'yellowWall', 'noPass': true}
				},
				{
					'x': 8, 
					'y': 7,
					'event': {'cls': 'terrains', 'id': 'yellowWall', 'noPass': true}
				},
				{
					'x': 8, 
					'y': 8,
					'event': {'cls': 'terrains', 'id': 'yellowWall', 'noPass': true}
				},
				{
					'x': 7, 
					'y': 8,
					'event': {'cls': 'terrains', 'id': 'yellowWall', 'noPass': true}
				},
				{
					'x': 6, 
					'y': 8,
					'event': {'cls': 'terrains', 'id': 'yellowWall', 'noPass': true}
				},
				{
					'x': 5, 
					'y': 8,
					'event': {'cls': 'terrains', 'id': 'yellowWall', 'noPass': true}
				},
				{
					'x': 4, 
					'y': 8,
					'event': {'cls': 'terrains', 'id': 'yellowWall', 'noPass': true}
				},
				{
					'x': 3, 
					'y': 8,
					'event': {'cls': 'terrains', 'id': 'yellowWall', 'noPass': true}
				},
				{
					'x': 3, 
					'y': 7,
					'event': {'cls': 'terrains', 'id': 'yellowWall', 'noPass': true}
				},
				{
					'x': 3, 
					'y': 5,
					'event': {'cls': 'terrains', 'id': 'yellowWall', 'noPass': true}
				},
				{
					'x': 3, 
					'y': 4,
					'event': {'cls': 'terrains', 'id': 'yellowWall', 'noPass': true}
				},
				{
					'x': 7,
					'y': 7,
					'event': {'cls': 'terrains', 'id': 'upFloor', 'trigger': 'changeFloor', 'data': {'floorId': 'MT002', 'heroLoc': {'direction': 'down', 'x': 7, 'y': 7}}}
				},
				{
					'x': 1,
					'y': 6,
					'event': {'cls': 'items', 'id': 'yellowKey', 'trigger': 'getItem'}
				}
			]
		},
		'MT002': {
			'title': '魔塔2层',
			'blocks': [
				{
					'x': 7,
					'y': 7,
					'event': {'cls': 'terrains', 'id': 'downFloor', 'trigger': 'changeFloor', 'data': {'floorId': 'MT001', 'heroLoc': {'direction': 'down', 'x': 7, 'y': 7}}}
				},
				{
					'x': 5,
					'y': 5,
					'event': {'cls': 'items', 'id': 'yellowKey', 'trigger': 'getItem'}
				},
				{
					'x': 4,
					'y': 5,
					'event': {'cls': 'items', 'id': 'yellowKey', 'trigger': 'getItem'}
				},
				{
					'x': 3,
					'y': 5,
					'event': {'cls': 'items', 'id': 'blueKey', 'trigger': 'getItem'}
				},
				{
					'x': 2,
					'y': 5,
					'event': {'cls': 'items', 'id': 'redKey', 'trigger': 'getItem'}
				},
				{
					'x': 7,
					'y': 6,
					'event': {'cls': 'items', 'id': 'greenKey', 'trigger': 'getItem'}
				}
			]
		}
	};
}

maps.prototype.getMaps = function(mapName) {
	if(mapName == undefined) {
		return this.maps;
	}
	return this.maps[mapName];
}

main.instance.maps = new maps();