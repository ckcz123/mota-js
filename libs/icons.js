function icons() {
	
}

icons.prototype.init = function() {
	this.icons = {
		'heros': {
			'hero1': {
				'down': {'loc': {'iconLoc': 0, 'stop': 0, 'leftFoot': 1, 'rightFoot': 2}, 'size': 32},
				'left': {'loc': {'iconLoc': 1, 'stop': 0, 'leftFoot': 1, 'rightFoot': 2}, 'size': 32},
				'right': {'loc': {'iconLoc': 2, 'stop': 0, 'leftFoot': 1, 'rightFoot': 2}, 'size': 32},
				'up': {'loc': {'iconLoc': 3, 'stop': 0, 'leftFoot': 1, 'rightFoot': 2}, 'size': 32}
			}
		},
		'empty': {
			'empty': {'size': 32}
		},
		'terrains': {
			'blackFloor': {'loc': 0, 'size': 32},
			'yellowWall': {'loc': 1, 'size': 32},
			'whiteWall': {'loc': 2, 'size': 32},
			'blueWall': {'loc': 3, 'size': 32},
			'starWall': {'loc': 4, 'size': 32},
			'lavaWall': {'loc': 5, 'size': 32},
			'downFloor': {'loc': 6, 'size': 32},
			'upFloor': {'loc': 7, 'size': 32},
			'cavity': {'loc': 8, 'size': 32},
			'store1-left': {'loc': 9, 'size': 32},
			'store1-right': {'loc': 10, 'size': 32},
			'store2-left': {'loc': 11, 'size': 32},
			'store2-right': {'loc': 12, 'size': 32},
			'store3-left': {'loc': 13, 'size': 32},
			'store3-right': {'loc': 14, 'size': 32}
		},
		'animates': {
			'star': {'loc': 0, 'size': 32},
			'lava': {'loc': 1, 'size': 32},
			'water': {'loc': 2, 'size': 32},
			'yellowDoor': {'loc': 3, 'size': 32},
			'blueDoor': {'loc': 4, 'size': 32},
			'redDoor': {'loc': 5, 'size': 32},
			'greenDoor': {'loc': 6, 'size': 32},
			'flowerDoor': {'loc': 7, 'size': 32},
			'blueWallDoor': {'loc': 8, 'size': 32},
			'yellowWallDoor': {'loc': 9, 'size': 32},
			'whiteWallDoor': {'loc': 10, 'size': 32},
			'ironDoor': {'loc': 11, 'size': 32},
			'lavaDoor': {'loc': 12, 'size': 32},
			'grayLavaDoor': {'loc': 13, 'size': 32},
			'starDoor': {'loc': 14, 'size': 32},
			'mockBlueWallDoor': {'loc': 15, 'size': 32},
			'mockYellowWallDoor': {'loc': 16, 'size': 32},
			'mockWhiteWallDoor': {'loc': 17, 'size': 32},
			'iceYellowWallDoor': {'loc': 18, 'size': 32}
		},
		'npcs': {
			'oldPaPa': {'loc': 0, 'size': 32},
			'chapman': {'loc': 1, 'size': 32},
			'thief': {'loc': 2, 'size': 32},
			'faerie': {'loc': 3, 'size': 32},
			'magician': {'loc': 4, 'size': 32}
		},
		'enemys': {
			'greenSlm': {'loc': 0, 'size': 32},
			'redSlm': {'loc': 1, 'size': 32},
			'blackSlm': {'loc': 2, 'size': 32},
			'kingSlm': {'loc': 3, 'size': 32},
			'blueBat': {'loc': 4, 'size': 32},
			'bigBlueBat': {'loc': 5, 'size': 32},
			'redBat': {'loc': 6, 'size': 32},
			'mingLingKing': {'loc': 7, 'size': 32},
			'skull': {'loc': 8, 'size': 32},
			'skullWarrior': {'loc': 9, 'size': 32},
			'skullCaptain': {'loc': 10, 'size': 32},
			'steelSkull': {'loc': 11, 'size': 32},
			'orcish': {'loc': 12, 'size': 32},
			'orcishCaption': {'loc': 13, 'size': 32},
			'stoneman': {'loc': 14, 'size': 32},
			'greenGhost': {'loc': 15, 'size': 32},
			'blueMagician': {'loc': 16, 'size': 32},
			'redMagician': {'loc': 17, 'size': 32},
			'brownWizard': {'loc': 18, 'size': 32},
			'redWizard': {'loc': 19, 'size': 32},
			'yellowGuard': {'loc': 20, 'size': 32},
			'blueGuard': {'loc': 21, 'size': 32},
			'redGuard': {'loc': 22, 'size': 32},
			'silverWeiHander': {'loc': 23, 'size': 32},
			'steelWarrior': {'loc': 24, 'size': 32},
			'yellowKnight': {'loc': 25, 'size': 32},
			'redKnight': {'loc': 26, 'size': 32},
			'blackKnight': {'loc': 27, 'size': 32},
			'blockKing': {'loc': 28, 'size': 32},
			'yellowKing': {'loc': 29, 'size': 32},
			'greenMagicGuard': {'loc': 30, 'size': 32},
			'blueKnight': {'loc': 31, 'size': 32},
			'goldSlm': {'loc': 32, 'size': 32},
			'poisonSkullWarrior': {'loc': 33, 'size': 32},
			'poisonBat': {'loc': 34, 'size': 32},
			'steelStoneman': {'loc': 35, 'size': 32},
			'skullMagician': {'loc': 36, 'size': 32},
			'skullKing': {'loc': 37, 'size': 32},
			'skullWizard': {'loc': 38, 'size': 32},
			'redSkullCaption': {'loc': 39, 'size': 32},
			'badHero': {'loc': 40, 'size': 32},
			'diablo': {'loc': 41, 'size': 32},
			'diabloGuard': {'loc': 42, 'size': 32},
			'goldHornSlm': {'loc': 43, 'size': 32},
			'zenoKing': {'loc': 44, 'size': 32},
			'blueMagicGuard': {'loc': 45, 'size': 32},
			'blackMagician': {'loc': 46, 'size': 32},
			'silverSlm': {'loc': 47, 'size': 32},
			'swordEmperor': {'loc': 48, 'size': 32},
			'whiteHornSlm': {'loc': 49, 'size': 32},
			'badPrincess': {'loc': 50, 'size': 32},
			'badFearie': {'loc': 51, 'size': 32},
			'grayMagician': {'loc': 52, 'size': 32},
			'redZweiHander': {'loc': 53, 'size': 32},
			'whiteGhost': {'loc': 54, 'size': 32},
			'poisonOrcish': {'loc': 55, 'size': 32}
		},
		'items': {
			'yellowKey': {'loc': 0, 'size': 32},
			'blueKey': {'loc': 1, 'size': 32},
			'redKey': {'loc': 2, 'size': 32},
			'greenKey': {'loc': 3, 'size': 32}
		}
	}
}

icons.prototype.getIcons = function(iconName) {
	if(iconName == undefined) {
		return this.icons;
	}
	return this.icons[iconName];
}

main.instance.icons = new icons();