(function(){
	var Plugin = function(entity, settings){
		this.id = this.id || 'plugin';
		//console.log('plugin instance', entity, settings);
		this.entity = entity;
		this.transform = entity.transform;
		this.settings = O.extend({}, this.defaultSettings, settings);
	};
	
	//Initialize plugin
	Plugin.prototype.init = function(components){
		this.components = components;
		this.components.stage.addPlugin(this);
		this.start();
	};
	
	//Destroy plugin
	Plugin.prototype.destroy = function(){
		//console.log('plugin.destroy', this.id)
		this.stop();
		this.components.stage.removePlugin(this);
	};
	
	Plugin.prototype.start = function(){};
	Plugin.prototype.stop = function(){};
	
	Plugin.prototype.defaultSettings = {};
	
	O.create(Plugin);
	O.set('plugin', Plugin);
})();