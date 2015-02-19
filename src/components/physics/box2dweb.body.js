(function(){
	var Body = function (ctx, details) {
		this.ctx = ctx;
		this.world = this.ctx.physics.world;

		this.settings = O.extend({}, this.defaultSettings, details);
		this.settings.scale = this.ctx.physics.scale || 100;
		//console.log("rigidbody.construct", this.settings);
		
		this.position = O.i('vec2', this.settings.position);
		this.velocity = O.i('vec2');
		this.angle = 0;
		this.locked = false;
		
		this.createBody();
        
        this.on('position.update', function(position){
	        this.position.set(position);
            this.body.SetPosition(new b2Vec2(position.x / this.settings.scale, position.y / this.settings.scale));
        });
        
        this.on('velocity.update', function(velocity){
	        //console.log('rigidbody.velocity.update', velocity);
            this.body.SetLinearVelocity(new b2Vec2(velocity.x, velocity.y));
        });
        
        this.ctx.physics.on('physics.update', function(){
	        var velocity = O.i('vec2', this.body.GetLinearVelocity());
	        velocity.multiply(this.settings.scale);
	        this.trigger('rigidbody.velocity.update', velocity);
	        
            var position = O.i('vec2', this.body.GetPosition());
            position.multiply(this.settings.scale);
            
            position.x = parseInt(position.x);
            position.y = parseInt(position.y);
            //rateLimit.message('physics.update', body_position.x, body_position.y);
            
            //console.log('position.update', this.position.x, this.position.y);
            if(this.position.compare(position) === false){
                this.position.set(position);
                this.trigger('rigidbody.position.update', position);
                //rateLimit.message('physics.update', position.x, position.y, this.settings.scale);
            }

            var angle = this.body.GetAngle();
            if(this.angle != angle){
                this.angle = angle;
                this.trigger('rigidbody.rotation.update', angle);
            }
        }.bind(this));
	};
 
	Body.prototype.classes = ['o.events'];
	
	Body.prototype.createBody = function(){
		var details = this.settings;
		
		// Create the definition
		this.definition = new b2BodyDef();
		
		this.definition = O.extend({}, this.definitionDefaults, this.definition);
		this.definition.userData = this.settings.data || "NONE";
		this.definition.position = new b2Vec2(this.position.x / this.settings.scale, this.position.y / this.settings.scale);
		this.settings.vx = this.settings.vx / this.settings.scale || 0;
		this.settings.vy = this.settings.vy / this.settings.scale || 0;
		this.definition.linearVelocity = new b2Vec2(this.settings.vx, this.settings.vy);
		
		this.definition.type = details.type == "static" ? b2Body.b2_staticBody : b2Body.b2_dynamicBody;
		 
		// Create the Body
		this.body = this.world.CreateBody(this.definition);
		 
		// Create the fixture
		this.fixtureDef = new b2FixtureDef();
		var f_settings = {
			density: this.settings.density,
			friction: this.settings.friction,
			restitution: this.settings.restitution
		};
		O.extend(this.fixtureDef, this.settings.fixtureDefaults, f_settings);
		 
		this.settings.shape = this.settings.shape || this.settings.defaults.shape;
		 
		switch (details.shape) {
			case "circle":
				this.settings.radius = (this.settings.radius / this.settings.scale) || this.settings.defaults.radius;
				this.fixtureDef.shape = new b2CircleShape(this.settings.radius);
			break;
			case "polygon":
				this.fixtureDef.shape = new b2PolygonShape();
				this.fixtureDef.shape.SetAsArray(this.settings.points, details.points.length);
			break;
			case "box":
			default:
				this.settings.width = (this.settings.width / this.settings.scale) || this.settings.defaults.width;
				this.settings.height = (this.settings.height / this.settings.scale) || this.settings.defaults.height;
				 
				this.fixtureDef.shape = new b2PolygonShape();
				this.fixtureDef.shape.SetAsBox(this.settings.width, this.settings.height);
			break;
		}
		 
		this.body.CreateFixture(this.fixtureDef);
	};
	
	Body.prototype.defaultSettings = {
		scale: 100,
		position: {
			x: 0,
			y: 0,
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
	
	O.register('physics.rigidbody.box2d', Body);
})();