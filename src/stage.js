(function(){
	"use strict";
	
    var default_settings = {

    };

    var Stage = function(){
	    this.id = 'stage';
	    this.type = 'component';
	    console.log('stage.construct');
	    O.exec('stage.layer', this);
	    
	    this.link = {
		    engine: 'engine',
		    renderer: 'renderer'
	    };
	    
	    var self = this;
        
        this.scenes = {};
        this.actions = [];
        this.resetChannel('connected');
        
        this.on('connected', function(){
	        console.log('Stage connected');
	        this.renderer.renderObject.addChild(this.renderObject);
	        this.engine.on('engine.tick', function(delta){
				self.trigger('stage.tick');
				for(var i = 0;i < self.actions.length;i++){
					var action = self.actions[i];
					action.update(delta);
					if(action.finished === true){
						//console.log("action.remove", action);
						self.removeAction(action);
					}
				}
			});
        });
    };

    Stage.prototype.init = function(settings){
		
		this.settings = O.extend({}, default_settings, settings);
		
		console.log('stage init', this.settings);
    };

	Stage.prototype.addScene = function(index, scene_name){
		var scene = O(scene_name);
		scene.connect(this);
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

	Stage.prototype.render = function(delta){
		this.renderer.render(this.stage);	
	};

    O.create(Stage, 'stage.layer');

    O.set('universe.stage', Stage);
})();