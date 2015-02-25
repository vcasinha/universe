(function(){
	var Entity = function(settings){
		this.id = this.id || 'entity';
		//console.log('entity.contruct', this.id);
		this.settings = O.extend({}, this.defaultSettings, settings);
		
		this.started = false;
		this.children = [];
		this.plugins = [];
		this.renderObject = new PIXI.DisplayObjectContainer();
	};
	
	Entity.prototype._update = function(dt){
		if(this.update){
			this.update(dt);
		}
			
		for(var i = 0;i < this.children.length;i++){
			var child = this.children[i];
			child._update(dt);
		}
		
/*
		for(var i = 0;i < this.plugins.length;i++){
			var plugin = this.plugins[i];
			if(plugin.update){
				plugin.update(dt);
			}
		}
*/
	};
	
	Entity.prototype.start = function(){};
	Entity.prototype.stop = function(){};
	
	Entity.prototype._start = function(){
		//console.log('entity.start', this.id);
		for(var i = 0;i < this.plugins.length;i++){
			var plugin = this.plugins[i];
			if(plugin.start){
				plugin.start();
			}
		}
		
		this.start();
		
		if(this.logic && this.logic.start){
			this.logic.start();
		}
		
		for(var i = 0;i < this.children.length;i++){
			var child = this.children[i];
			child._start();
		}
		this.started = true;
	};
	
	Entity.prototype._stop = function(){
		for(var i = 0;i < this.children.length;i++){
			var child = this.children[i];
			child._stop();
		}
		
		for(var i = 0;i < this.plugins.length;i++){
			this.plugins[i].stop();
		}
		
		this.stop();
	};
	
	Entity.prototype.getByID = function(id){
		for(var i = 0;i < this.children.length;i++){
			var child = this.children[i];
			if(child.id === id){
				return child;
			}
		}
	};
	
	Entity.prototype.setComponents = function(components){
		this.components = components;
		console.log('plugin', this.plugins);
		for(var i = 0;i < this.plugins.length;i++){
			
			var plugin = this.plugins[i];
			plugin.components = this.components;
		}
		
		for(var i = 0;i < this.children.length;i++){
			var child = this.children[i];
			child.setComponents(this.components);
		}
	};
	
	Entity.prototype.addChild = function(child){
		//console.log('entity.addChild', child);
		if(child.parent){
			child.parent.removeChild(child);
		}
		
		child.parent = this;
		child.setComponents(this.components);
		
		this.children.push(child);
		this.renderObject.addChild(child.renderObject);
		if(this.started === true){
			child._start();
		}
	};

	Entity.prototype.removeChild = function(child){
		for(var i = 0;i < this.children.length;i++){
			if(child === this.children[i]){
				child._stop();
				this.children.splice(i, 1);
				this.renderObject.removeChild(child.renderObject);
				child.parent = undefined;
			}
		}
	};

	Entity.prototype.defaultSettings = {};

	O.set('entity', Entity);
})();