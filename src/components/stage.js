(function(){
	"use strict";

    var Stage = function(){
	    this.$parent.apply(this, arguments);
	    //console.log('stage.construct');
	    
	    var self = this;
        this.currentScene = undefined;
        this.scenes = {};
        this.actions = [];
        this.children = [];
        this.plugins = [];
        
        this.renderObject = new PIXI.DisplayObjectContainer();
        window.call_count = 0;
    };

	Stage.prototype.update = function(dt){
/*
		for(var i = 0;i < self.actions.length;i++){
			var action = self.actions[i];
			action.update(delta);
			if(action.finished === true){
				//console.log("action.remove", action);
				self.removeAction(action);
			}
		}
*/
		call_count = 0;
		//Update children
/*
		for(var i = 0;i < this.children.length;i++){
			var child = this.children[i];
			if(child.update){
				call_count++;
				child.update(dt);
				console.log('call', child.id);
			}
		}
*/

		window.avg = call_count;
		//Update plugins
		for(var i = 0;i < this.plugins.length;i++){
			var plugin = this.plugins[i];
			if(plugin.update){
				plugin.update(dt);
			}
		}
	};

	Stage.prototype.getByID = function(id){
		for(var i = 0;i < this.children.length;i++){
			var child = this.children[i];
			if(child.id == id){
				return child;
			}
		}
	};

    Stage.prototype.init = function(settings){
		this.components.renderer.addChild(this.renderObject);
		this.settings = O.extend({}, this.defaultSettings, settings);
		
		//console.log('stage init', this.settings);
    };

    Stage.prototype.addPlugin = function(plugin){
    	//console.log('stage.addPlugin', plugin.id);
		if(this.plugins.indexOf(plugin) !== -1){
			return;
		}
		
		this.plugins.push(plugin);
    };

    Stage.prototype.removePlugin = function(plugin){
	    //console.log('stage.removePlugin', plugin.id);
		for(var i = 0;i < this.plugins.length;i++){
			if(this.plugins[i] === plugin){
				this.plugins.splice(i, 1);
			}
		}
    };

	Stage.prototype.addChild = function(child){
		//console.log('stage.addChild', child.id);
		if(this.children.indexOf(child) !== -1){
			return;
		}
		
		this.children.push(child);
	};

	Stage.prototype.removeChild = function(child){
		for(var i = 0;i < this.children.length;i++){
			if(this.children[i] === child){
				this.children.splice(i, 1);
				child.parent = undefined;
			}
		}
	}

	Stage.prototype.setScene = function(index){
		//console.log('stage.setScene', index);
		
		if(this.currentScene){
			this.currentScene.destroy();
			this.removeChild(this.currentScene);
		}
		
		this.currentScene = this.scenes[index];
		if(!this.currentScene){
			return;
		}
		
		this.addChild(this.currentScene);
		this.renderObject.addChild(this.currentScene.renderObject);
		this.currentScene.init(this.components);
	};

	Stage.prototype.addScene = function(index, scene){
		//console.log('stage.addScene', index);
		this.scenes[index] = scene;
		
		return scene;
	};

	Stage.prototype.getScene = function(index){
		return this.scenes[index];
	};

	Stage.prototype.addAction = function(action_settings){
		var action = O('stage.action', action_settings);
		this.actions.push(action);
		
		return this;
	};
	
	Stage.prototype.removeAction = function(action){
		for(var i = 0;i < this.actions.length;i++){
			if(this.actions[i] === action){
				this.actions.splice(i, 1);
			}
		}
		return this;
	};
	
	Stage.prototype.defaultSettings = {};
	
	O.create(Stage, 'component');
	
    O.set('stage', Stage);
})();