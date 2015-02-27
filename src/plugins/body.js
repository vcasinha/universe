(function(){
	"use strict";
	
	var RigidBody = function(){
        this.id = this.id || 'rigidBody.plugin';
		this.$parent.apply(this, arguments);
		
		this.require_update = false;
		
		this.joints = [];
		//console.log('body.construct', this);
		
		this.position = this.entity.transform.position;
		this.velocity = this.entity.transform.velocity;
		this.rotation = this.entity.transform.rotation;

		//Debug shape
		if(this.entity.debug){
			console.log('body.construct DEBUG physics shape');
			this.debug_shape = new PIXI.Sprite();
			this.debug_shape.position = this.position;
			this.debug_shape.anchor.set(0.5, 0.5);
			if(this.settings.body.shape === 'circle'){
				this.debug_shape.setTexture(O('circle', this.settings.body.radius, 0x009900));
			}
			else{
				this.debug_shape.setTexture(O('box', this.settings.body.width, this.settings.body.height, 0x009900));
			}
		}

	};

	RigidBody.prototype.start = function(){
		//console.log('body.start', this);
		this.physics = this.components.physics;
		this.scale = this.physics.scale;
		
		this.settings.body.data = this.entity;
		
		this.body = this.physics.createBody(this.position, this.settings.body);
		//console.log(this.body);
        
        if(this.debug_shape){
	        this.components.renderer.physics.addChild(this.debug_shape);
        }
	};

	RigidBody.prototype.stop = function(){
		this.physics.removeBody(this.body);
		this.body = undefined;
        if(this.debug_shape){
	        this.components.renderer.physics.removeChild(this.debug_shape);
	        this.debug_shape = undefined;
        }
        
        this.physics = undefined;
	};

	RigidBody.prototype.update = function(){
/*
        var velocity = O('vector2', this.body.GetLinearVelocity());
        velocity.multiply(this.settings.scale);
        this.velocity.copy(velocity);
        
        var position = O('vector2', this.body.GetPosition());
        position.multiply(this.settings.scale);
        this.position.x = parseInt(position.x);
        this.position.y = parseInt(position.y);
		
		this.rotation = this.body.GetAngle();
*/
	};

    RigidBody.prototype.applyImpulse = function(impulse){
	    this.body.ApplyImpulse(impulse, this.body.GetWorldCenter());
    };
	
    RigidBody.prototype.applyForce = function(force){
	    this.body.ApplyForce(force, this.body.GetWorldCenter());
    };
	
    RigidBody.prototype.getVelocity = function(){
    	return this.body.GetLinearVelocity();
    };

	O.create(RigidBody, 'plugin');
	
	O.set('plugin.body', RigidBody);
})();