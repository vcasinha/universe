(function(){
	
	var Context = function(settings){
		this.settings = settings;
		this.components = {
			
		};
		
		for(var i in settings.components){
			this.loadComponent(i, settings.components[i]);
		}
	};
	
	Context.prototype.classes = ['o.events'];
	Context.prototype.loadComponent = function(name, object_name){
		var settings = this.settings[name] || {};
		//console.log('context.loadComponent', name, object_name, settings);
		
		var component = O.instance(object_name, this, settings);
		this.components[name] = this[name] = component;
		
		return component;
	}
	
	O.register('engine.context', Context);
})(O);