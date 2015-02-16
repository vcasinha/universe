(function(){
	var Physics = function(){
		var init = function(settings){
			this.dtRemaining = 0;
			this.stepAmount = this.settings.stepAmount || 1 / 60;
			this.scale = this.settings.scale || 100;
			
			var gravity = new b2Vec2(this.settings.gravity.x || 0.0, this.settings.gravity.y || 10.0);
			this.world = new b2World(gravity, true);
			//this.debug();
			
		}.bind(this);

		var stop = function(){
			this.ctx.off('update', update);
		}.bind(this);
		
		var update = function(dt){
			this.update(dt);
		}.bind(this);
		
		this.ctx.once('init', init);
		this.ctx.on('update', update);
		this.ctx.once('stop', stop);
	};
	
	Physics.prototype.classes = ['engine.component', 'o.events'];
	
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
		return O.instance('physics.body.box2d', this.world, settings);
	}
	
	O.register('component.physics.box2d', Physics);
})();