(function(){
	"use strict";
	
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
		this.$parent.apply(this, arguments);
		this.bodies = [];
		this.joints = [];
		this.id = 'physics';
	};
	
	Physics.prototype.init = function(){
		console.log("physics.init", this.settings);

		this.dtRemaining = 0;
		this.stepAmount = this.settings.stepAmount || 1 / 60;
		this.scale = this.settings.scale || 100;
		
		var gravity = new b2Vec2(this.settings.gravity.x / this.scale, this.settings.gravity.y / this.scale);
		this.world = new b2World(gravity, true);

		var self = this;
		var timer = 0;
		
		this.handleContact({
			BeginContact: function(contact){
				var entityA = contact.GetFixtureA().GetBody().GetUserData();
				if(entityA.logic){
					entityA.logic.exec('beginContact', entityB, contact);
				}
				
				var entityB = contact.GetFixtureB().GetBody().GetUserData();
				if(entityB.logic){
					entityB.logic.exec('beginContact', entityA, contact);
				}
			},
			EndContact: function(contact){
				var entityA = contact.GetFixtureA().GetBody().GetUserData();
				if(entityA.logic){
					entityA.logic.exec('endContact', entityB, contact);
				}
				
				var entityB = contact.GetFixtureB().GetBody().GetUserData();
				if(entityB.logic){
					entityB.logic.exec('endContact', entityA, contact);
				}
			},
			PostSolve: function(contact, impulse){
				var force = impulse.normalImpulses[0] * self.scale;
				var entityA = contact.GetFixtureA().GetBody().GetUserData();
				if(entityA.logic){
					entityA.logic.exec('contactForce', entityB, force);
				}
				
				var entityB = contact.GetFixtureB().GetBody().GetUserData();
				if(entityB.logic){
					entityB.logic.exec('contactForce', entityA, force);
				}
			}
		});
	};
	
	Physics.prototype.handleContact = function(extension){
		console.log('physics.handleContact', extension);
		var b2Listener = Box2D.Dynamics.b2ContactListener;
		
		//Add listeners for contact
		var listener = new b2Listener;
		O.extend(listener, extension);
		
		this.world.SetContactListener(listener);
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
	
	Physics.prototype.update = function(dt){
		this.world.Step(this.stepAmount, 8, 3);
		for(var i = 0;i < this.bodies.length;i++){
			var body = this.bodies[i];
			var object = body.GetUserData();
	        var velocity = O('vector2', body.GetLinearVelocity());
	        velocity.multiply(this.settings.scale);
	        object.transform.velocity.copy(velocity);
	        
	        var position = O('vector2', body.GetPosition());
	        position.multiply(this.settings.scale);
	        object.transform.position.x = parseInt(position.x);
	        object.transform.position.y = parseInt(position.y);
			object.transform.rotation = body.GetAngle();
			if(object.sprite){
				object.sprite.sprite.rotation = object.transform.rotation;
			}
		}
		
/*
		for(var i = 0;i < this.joints.length;i++){
			var joint = this.joints[i];
			var object = joint.GetUserData();
	        var velocity = O('vector2', joint.GetLinearVelocity());
	        velocity.multiply(this.settings.scale);
	        object.transform.velocity.copy(velocity);
	        
	        var position = O('vector2', joint.GetPosition());
	        position.multiply(this.settings.scale);
	        object.transform.position.x = parseInt(position.x);
	        object.transform.position.y = parseInt(position.y);
			object.transform.rotation = joint.GetAngle();
			if(object.sprite){
				object.sprite.sprite.rotation = object.transform.rotation;
			}
		}
*/
	};
	
	Physics.prototype.getGroundBody = function(){
		return this.world.GetGroundBody();
	};

	Physics.prototype.getGravity = function(){
		return this.world.GetGravity();
	};

	Physics.prototype.removeBody = function(body){
		for(var i = 0;i < this.bodies.length;i++){
			if(this.bodies[i] === body){
				this.bodies.splice(i, 1);
				this.world.DestroyBody(body);
			}
		}
	};

	Physics.prototype.createBody = function(position, body_settings){
		var bodyDefinition = new b2BodyDef();
		
		O.extend(bodyDefinition, this.settings.definitionDefaults, bodyDefinition);
		bodyDefinition.userData = body_settings.data || undefined;
		
		bodyDefinition.position = new b2Vec2(position.x / this.scale, position.y / this.scale);
		
		if(body_settings.velocity){
			var velocity = body_settings.velocity;
			bodyDefinition.linearVelocity = new b2Vec2(velocity.x / this.scale, velocity.y / this.scale);
		}
		
		bodyDefinition.type = body_settings.type == "static" ? b2Body.b2_staticBody : b2Body.b2_dynamicBody;
		var body = this.world.CreateBody(bodyDefinition);
		
		// Create the fixture
		var fixtureDefinition = new b2FixtureDef();
		fixtureDefinition.density = body_settings.density || this.settings.fixtureDefaults.density;
		fixtureDefinition.friction = body_settings.friction || this.settings.fixtureDefaults.friction;
		fixtureDefinition.restitution = body_settings.restitution || this.settings.fixtureDefaults.restitution;
		 
		var shape = body_settings.shape || this.settings.defaults.shape;
		 
		switch(shape) {
			case "circle":
				body_settings.radius = (body_settings.radius / this.settings.scale) || this.settings.defaults.radius;
				fixtureDefinition.shape = new b2CircleShape(body_settings.radius);
			break;
			case "polygon":
				fixtureDefinition.shape = new b2PolygonShape();
				fixtureDefinition.shape.SetAsArray(body_settings.points, details.points.length);
			break;
			case "box":
			default:
				var width = (body_settings.width / this.settings.scale) || this.settings.defaults.width;
				var height = (body_settings.height / this.settings.scale) || this.settings.defaults.height;
				 
				fixtureDefinition.shape = new b2PolygonShape();
				fixtureDefinition.shape.SetAsBox(width / 2, height / 2);
			break;
		}
		 
		body.CreateFixture(fixtureDefinition);
		
		this.bodies.push(body);
		
		return body;
	}
	
	Physics.prototype.createJoint = function(settings){
		console.log('physics.createJoint', settings);
		var joint_definition = undefined;
		switch(settings.type){
			case 'distance':
/*
				settings.from.position = settings.from.position || settings.from.GetWorldCenter();
				settings.to.position = settings.to.position || settings.to.GetWorldCenter();
*/
			
				joint_definition = new Box2D.Dynamics.Joints.b2DistanceJointDef();
			    joint_definition.bodyA = settings.from;
			    joint_definition.bodyB = settings.to;
			    //connect the centers - center in local coordinate - relative to body is 0,0
			    joint_definition.localAnchorA = settings.from.position || new b2Vec2(0, 0);
			    joint_definition.localAnchorB = settings.to.position || new b2Vec2(0, 0);
			    //length of joint
			    joint_definition.length = settings.length / this.scale;
			    joint_definition.collideConnected = settings.collide || true;
			break;
			case 'mouse':
				joint_definition = new Box2D.Dynamics.Joints.b2MouseJointDef();
				joint_definition.bodyA = settings.to;
				joint_definition.bodyB = settings.from;
				joint_definition.target = new b2Vec2(settings.target.x / this.scale, settings.target.y / this.scale);
				joint_definition.maxForce = 100000;
				joint_definition.collideConnected = settings.collide || true;
			break;
		}
		
		var joint = this.world.CreateJoint(joint_definition);
		this.joints.push(joint);
		
		//console.log('physics.createJoint joint', joint);
		
		return joint;
	};
	
	Physics.prototype.removeJoint = function(joint){
		for(var i = 0;i < this.joints.length;i++){
			if(this.joints[i] === joint){
				this.joints.splice(i, 1);
			}
		}
		
		this.world.DestroyJoint(joint);
	};
	
	Physics.prototype.defaultSettings = {
		scale: 100,
		gravity: {
			x: 0,
			y: 0
		},
		defaults: {
			shape: "box",
			width: 5,
			height: 5,
			radius: 2.5
		},
		fixtureDefaults:{
			density: 2,
			friction: 1,
			restitution: 0.2
		},
		definitionDefaults: {
			active: true,
			allowSleep: true,
			angle: 0,
			angularVelocity: 0,
			awake: true,
			bullet: false,
			fixedRotation: false
		}
	};
	
	O.create(Physics, 'component');

	O.set('physics.box2d', Physics);
})();