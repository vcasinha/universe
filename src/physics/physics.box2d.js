(function(){
	
	window.b2Vec2 = Box2D.Common.Math.b2Vec2;
	window.b2BodyDef = Box2D.Dynamics.b2BodyDef;
	window.b2Body = Box2D.Dynamics.b2Body;
	window.b2FixtureDef = Box2D.Dynamics.b2FixtureDef;
	window.b2Fixture = Box2D.Dynamics.b2Fixture;
	window.b2World = Box2D.Dynamics.b2World;
	window.b2MassData = Box2D.Collision.Shapes.b2MassData;
	window.b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape;
	window.b2CircleShape = Box2D.Collision.Shapes.b2CircleShape;
	window.b2DebugDraw = Box2D.Dynamics.b2DebugDraw;

	
	var Physics = function(){
		this.id = 'physics';
		this.$parent.apply(this);
	};
	
	O.create(Physics, 'universe.unit');
	
	Physics.prototype.init = function(settings){
		this.settings = O.extend({}, this.settingsDefault, settings);
		
		console.log("physics.construct", this.settings);

		this.dtRemaining = 0;
		this.stepAmount = this.settings.stepAmount || 1 / 60;
		this.scale = this.settings.scale || 100;
		
		var gravity = new b2Vec2(this.settings.gravity.x, this.settings.gravity.y);
		this.world = new b2World(gravity, true);
		//this.debug();
		this.engine = this.findByID('engine');

		var self = this;
		var timer = 0;
		this.engine.on('engine.tick', function(dt){
			self.world.Step(self.stepAmount, 8, 3);
			self.trigger('physics.update');
		});
	}
	
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

	O.set('universe.physics.box2d', Physics);
})();