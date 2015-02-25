(function(){
	"use strict";
	
    var default_settings = {

    };

    var Stage = function(){
	    this.$parent.apply(this, arguments);
	    console.log('stage.construct');
	    
	    var self = this;
        this.currentScene = undefined;
        this.scenes = {};
        this.actions = [];
        this.children = [];
        
        this.renderObject = new PIXI.DisplayObjectContainer();
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
		
		for(var i = 0;i < this.children.length;i++){
			var child = this.children[i];
			if(child.update){
				child._update(dt);
			}
		}
	};

	Stage.prototype.getByID = function(id){
		for(var i = 0;i < this.children.length;i++){
			var child = this.children[i];
			console.log('stage.getByID', id == child.id);
			if(child.id == id){
				return child;
			}
		}
	};

    Stage.prototype.init = function(settings){
		this.components.renderer.addChild(this.renderObject);
		this.settings = O.extend({}, default_settings, settings);
		
		console.log('stage init', this.settings);
    };

	Stage.prototype.addChild = function(child){
		//console.log('stage.addChild', this.engine);
		child.setComponents(this.components);
		this.renderObject.addChild(child.renderObject);
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
		if(this.currentScene){
			this.currentScene.stop();
			this.removeChild(this.currentScene);
		}
		
		this.currentScene = this.scenes[index];
		if(this.currentScene){
			this.addChild(this.currentScene);
		}
		
		this.currentScene._start();
	};

	Stage.prototype.addScene = function(index, scene){
		console.log('stage.addScene', index);
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
	O.create(Stage, 'component');
	
    O.set('stage', Stage);
})();