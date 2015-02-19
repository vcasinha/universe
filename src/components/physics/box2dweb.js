(function(){
	var Physics = function(){		
		this.ctx.once('init', function(settings){
			console.log("physics.construct", this.settings);

			this.dtRemaining = 0;
			this.stepAmount = this.settings.stepAmount || 1 / 60;
			this.scale = this.settings.scale || 100;
			
			var gravity = new b2Vec2(this.settings.gravity.x, this.settings.gravity.y);
			
			this.world = new b2World(gravity, true);
			//this.debug();
			
		}.bind(this));
		
		this.ctx.on('engine.update', function(dt){
			this.world.Step(this.stepAmount,
				8, // velocity iterations
				3); // position iterations
			
			//rateLimit.message('physics.update');
			this.trigger('physics.update');
		}.bind(this));
		this.ctx.once('stop', stop);
	};
	
	Physics.prototype.classes = ['engine.component', 'o.events'];
	
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
		return O.instance('physics.rigidbody.box2d', this.ctx, settings);
	}
	
	Physics.prototype.settingsDefault = {
		gravity: {
			x: 0,
			y: 0.1
		}
	};
	O.register('component.physics.box2d', Physics);
})();