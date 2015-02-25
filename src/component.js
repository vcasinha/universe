(function(){
	var Component = function(settings, components){
		//console.log('component.construct', settings.component, settings);
		this.components = components;
		this.settings = O.extend({}, this.defaultSettings, settings);
	};
	
	Component.prototype.init = function(){};
	Component.prototype.update = function(){};
	
	O.set('component', Component);
})();