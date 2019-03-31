function items() {
	
}

items.prototype.init = function() {
	this.items = {
		'yellowKey': {'cls': 'key', 'name': '黄钥匙'},
		'blueKey': {'cls': 'key', 'name': '蓝钥匙'},
		'redKey': {'cls': 'key', 'name': '红钥匙'},
		'greenKey': {'cls': 'key', 'name': '绿钥匙'}
	}
}

items.prototype.getItems = function(itemName) {
	if(itemName == undefined) {
		return this.items;
	}
	return this.items[itemsName];
}

main.instance.items = new items();