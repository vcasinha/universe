(function(){
	var Plugin = function(entity, settings){
		//console.log('plugin instance', entity, settings);
		this.entity = entity;
		this.transform = entity.transform;
		this.settings = O.extend({}, this.defaultSettings, settings);
	};
	
	Plugin.prototype.start = function(){};
	Plugin.prototype.stop = function(){};
	
	O.create(Plugin);
	O.set('plugin', Plugin);
})();