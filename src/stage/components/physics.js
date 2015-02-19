(function(){
	var Physics = function(){
        this.physics = this.ctx.physics;
        
        this.parent.velocity = this.parent.velocity || O.i('vec2');
        
        this.settings.body.data = this.parent;
        //console.log('physics.construct.position', this.settings);
		this.rigidBody = this.physics.createBody(this.settings.body);

		this.parent.broadcast(this.rigidBody);
        
        this.rigidBody.on('rigidbody.position.update', function(position){
			this.parent.position.set(position);
        }.bind(this));
        
        this.rigidBody.on('rigidbody.rotation.update', function(rotation){
			this.parent.rotation = rotation;
        }.bind(this));
        
        this.rigidBody.on('rigidbody.velocity.update', function(velocity){
			this.parent.velocity.set(velocity);
        }.bind(this));
    };
    
    Physics.prototype.classes = ['stage.addon'];
	
    Physics.prototype.applyImpulse = function(impulse){
	    this.rigidBody.body.ApplyImpulse(impulse, this.rigidBody.body.GetWorldCenter());
    };
	
    Physics.prototype.applyForce = function(force){
	    this.rigidBody.body.ApplyForce(force, this.rigidBody.body.GetWorldCenter());
    };
	
	Physics.prototype.defaultSettings = {
        body: {
            shape:'circle', 
            radius: 10, 
            friction: 0.5, 
            density: 5,
            restitution: 0.5
        }
	};
    
    Physics.prototype.collision = function(callback){
		var listener = new Box2D.Dynamics.b2ContactListener();
		listener.PostSolve = callback;
		this.physics.world.SetContactListener(listener);
		return listener;
    };
    
	O.register('addon.physics', Physics);
})();