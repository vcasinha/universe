(function(){
	var Stage = function(ctx){
		console.log("stage.construct", this.settings);
		this.children = [];
		
		this.anchor = O.i('vec2', {x: 1.5, y: 1.5});
		
		var step = this.settings.step || 1/60;
		var current_step = 0;
		var time_before = new Date().getTime();

		this.ctx.once('init', function(){
            console.log('stage.init');
            this.renderContainer = O.i('engine.layer');
            this.renderContainer.anchor = this.anchor;
            this.ctx.renderer.add(this.renderContainer);
            
			var callback = function(contact, impulse){
		        
		        //this.rigidBody.applyImpulse({x: 0.5 - Math.random(), y: 0.5 - Math.random()});
	
				var bodyA = contact.GetFixtureA().GetBody().GetUserData();
				var bodyB = contact.GetFixtureB().GetBody().GetUserData();
				
				if(bodyA.trigger){
					bodyA.trigger('collision', contact, impulse);
				}
				
				if(bodyB.trigger){
					bodyB.trigger('collision', contact, impulse);
				}
				
	/*	 
				if (bodyA.contact) {
					bodyA.contact(contact, impulse, true)
				}
				if (bodyB.contact) {
					bodyB.contact(contact, impulse, false)
				}
	*/
			}.bind(this);
			this.ctx.physics.handleContact({PostSolve:callback});
            
		}.bind(this));
		
		ctx.on('engine.update', function(dt){
			ctx.trigger('stage.update', dt);
		});
	};
	
	Stage.prototype.classes = ['engine.component', 'o.events'];
	
	Stage.prototype.width = function(){
		return this.ctx.renderer.width;
	};
	
	Stage.prototype.height = function(){
		return this.ctx.renderer.height;
	};
	
	Stage.prototype.reset = function(){
		console.log('stage.reset');
		this.children.forEach(function(child){
			child.trigger('stop');
		});
		
		this.children = [];
	};
	
	Stage.prototype.add = function(child){
		if(typeof child !== 'object'){
			console.warn("stage.add Invalid object", typeof child, child);
			throw("Object is undefined invalid");
		}
        
		this.children.push(child);
		
		return this;
	};
	
	Stage.prototype.remove = function(child){
	    var index = this.children.indexOf(child);
	    
	    if(index > -1){
		    array.splice(index, 1);
	    }
        
        return this;
    };
	
	Stage.prototype.settingsDefault = {
		step: 1/60
	};

	O.register('component.stage', Stage);
})();