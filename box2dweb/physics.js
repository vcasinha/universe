(function(){
	var Physics = function(ctx){
		var start = function(settings){
			var settings = settings.physics || {
				gravity: {
					x: 0.0,
					y: 100.0
				}
			};
			
			this.dtRemaining = 0;
			this.stepAmount = settings.stepAmount || 1/60;
			this.scale = settings.scale || 10;
			
			var gravity = new b2Vec2(settings.gravity.x || 0.0, settings.gravity.y || 10.0);
			this.world = new b2World(gravity, true);
			//this.debug();
			
		}.bind(this);
		
		var stop = function(){
			
		}.bind(this);
		
		var update = function(dt){
			this.update(dt);
		}.bind(this);
		
		ctx.once('start', start);
		ctx.on('update', update);
		ctx.once('stop', stop);
	};
	
	Physics.prototype.classes = ['o.events', 'engine.object'];
	
	Physics.prototype.update = function(dt){
		this.dtRemaining += dt;
		while (this.dtRemaining > this.stepAmount) {
			this.dtRemaining -= this.stepAmount;
			this.world.Step(this.stepAmount,
			8, // velocity iterations
			3); // position iterations
		} 
		this.trigger('physics.update');
	};
	
	Physics.prototype.debug = function(){
		this.debugDraw = new b2DebugDraw();
		var canvas_context = this.ctx.renderer.getElement().getContext("2d");
		console.log("physics.debug.canvas", canvas_context);
		this.debugDraw.SetSprite(canvas_context);
		this.debugDraw.SetDrawScale(10);
		this.debugDraw.SetFillAlpha(0.5);
		this.debugDraw.SetLineThickness(1.0);
		this.debugDraw.SetFlags(b2DebugDraw.e_shapeBit | b2DebugDraw.e_jointBit);
		this.world.SetDebugDraw(this.debugDraw);
	};
	
	Physics.prototype.getGravity = function(){
		return this.world.GetGravity();
	};
	
	Physics.prototype.handleContact = function(extension){
		var b2Listener = Box2D.Dynamics.b2ContactListener;
		
		//Add listeners for contact
		var listener = new b2Listener;
		O.extend(listener, extension);
		
		this.world.SetContactListener(listener);
	}
	
	Physics.prototype.createBody = function(settings){
		if(settings.x)settings.x /= this.scale;
		if(settings.y)settings.y /= this.scale;
		if(settings.width)settings.width /= this.scale;
		if(settings.height)settings.height /= this.scale;
		if(settings.radius)settings.radius /= this.scale;
		
		return O.instance('physics.body', this.world, settings);
	}
	
	Physics.prototype.attachBody = function(entity, settings){
		entity.body = this.createBody(settings).body;
		entity.body.SetUserData(entity);
		
		this.on('physics.update', function(){
			var position = entity.body.GetPosition();
			var angle = entity.body.GetAngle();
			
			entity.position.x = position.x * this.scale;// * this.scale;
			entity.position.y = position.y * this.scale;// * this.scale;
			entity.rotation = angle;
		}.bind(this));
	};
	
	O.register('engine.physics.box2d', Physics);
})();