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
	
	Entity.prototype.init = function(components){
		//console.log('entity.init', this.id);
		
		this.components = components;
		
        this.started = true;

		//Start this plugin
        if(this.start){
            this.start();
        }

		//Initialize plugins
		for(var i = 0;i < this.plugins.length;i++){
			var plugin = this.plugins[i];
            //console.log('entity.init.plugins', this.id, plugin.id);
			plugin.init(this.components);
		}
	};
	
	Entity.prototype.destroy = function(){
		//console.log('entity.destroy', this.id);
		
        if(this.stop){
            this.stop();
        }
		
        for(var i = 0;i < this.plugins.length;i++){
            this.plugins[i].destroy();
        }

		if(this.parent){
			this.parent.removeChild(this);
		}
	
		for(var i = 0;i < this.children.length;i++){
			var child = this.children[i];
			child.destroy();
		}	
	};
	
	Entity.prototype.getByID = function(id){
		for(var i = 0;i < this.children.length;i++){
			var child = this.children[i];
			if(child.id === id){
				return child;
			}
		}
	};
	
	Entity.prototype.addChild = function(child){
		if(this.children.indexOf(child) !== -1){
			return;
		}
		
		//console.log('entity.addChild', child.id);
		this.components.stage.addChild(child);

		this.renderObject.addChild(child.renderObject);
		if(child.parent){
			child.parent.removeChild(child);
		}
		
		child.parent = this;
		
		this.children.push(child);
		if(this.started === true){
			child.init(this.components);
		}
	};

	Entity.prototype.removeChild = function(child){
		for(var i = 0;i < this.children.length;i++){
			if(child === this.children[i]){
				this.children.splice(i, 1);
				this.renderObject.removeChild(child.renderObject);
				child.parent = undefined;
			}
		}
	};

	Entity.prototype.defaultSettings = {};

	O.set('entity', Entity);
})();