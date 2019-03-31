function events() {
	
}

events.prototype.init = function() {
	this.events = {
		'battle': function(data, core, callback){
			core.playSound('floor', 'mp3'); 
			core.rmBlock('event', data.x, data.y);
			callback();
		},
		'changeFloor': function(data, core, callback) {
			core.changeFloor(data.event.data.floorId, data.event.data.heroLoc);
		},
		'getItem': function(data, core, callback) {
			core.getItem(data.event.id, 1, data.x, data.y);
		}
	}
}

events.prototype.getEvents = function(eventName) {
	if(eventName == undefined) {
		return this.events;
	}
	return this.events[eventName];
}

main.instance.events = new events();