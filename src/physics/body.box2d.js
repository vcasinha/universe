(function(){
	var default_settings = {
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
	
	var Body = function (settings){
		var self = this;
		
		Entity.apply(this);
		
		this.id = 'body';
		
		this.settings = O.extend({}, default_settings, settings);
		//console.log('body.construct', this.settings);
		
		this.position = O('vector2', this.settings.position);
		this.velocity = O('vector2');
		this.rotation = this.settings.rotation;
		this.locked = false;
		
		var debug_shape = new PIXI.Graphics();
		debug_shape.position = this.position;
		
		switch(settings.shape){
			case 'circle':
				debug_shape.beginFill(0x006600);
				debug_shape.lineStyle(1, 0x000000);
				debug_shape.drawCircle(0, 0, settings.radius);
				
			break;
			case 'box':
				debug_shape.beginFill(0x006600);
				debug_shape.lineStyle(1, 0x000000);
				debug_shape.drawRect(-settings.width/2, -settings.height/2, settings.width, settings.height);
			break;
		}
		
        this.on('position.update', function(position){
	        self.position.set(position);
            self.body.SetPosition(new b2Vec2(position.x / self.settings.scale, position.y / self.settings.scale));
        });
        
        this.on('velocity.update', function(velocity){
	        //console.log('rigidbody.velocity.update', velocity);
            self.body.SetLinearVelocity(new b2Vec2(velocity.x, velocity.y));
        });
		
		this.on('ready', function(){
			self.scale = self.ctx.physics.scale;
			
			console.log('Body ready (Scale)', self.scale);
			self.world = self.ctx.physics.world;
			self.settings.scale = self.ctx.physics.settings.scale || 100;
			//console.log("rigidbody.construct", this.settings);
			
			self.createBody();
	        
	        self.ctx.renderer.physics_debug.addChild(debug_shape);
	        
	        if(self.settings.type === 'static'){
		        return false;
	        }
	        
	        this.ctx.physics.on('physics.update', function(){
		        var velocity = O('vector2', self.body.GetLinearVelocity());
		        velocity.multiply(self.settings.scale);
		        self.trigger('rigidbody.velocity.update', velocity);
		        
	            var position = O('vector2', self.body.GetPosition());
	            position.multiply(self.settings.scale);
	            
	            position.x = parseInt(position.x);
	            position.y = parseInt(position.y);

				var rotation = self.body.GetAngle();
	            debug_shape.rotation = rotation;
	            
	            self.position.set(position);
	            self.rotation = rotation;
	            self.trigger('rigidbody.update', position, rotation);
	        });
	    });
	};
 
	var Entity = O.get('universe.entity');
	O.create(Body, Entity);
	
	Body.prototype.createBody = function(){
		//console.log('createBody', this.settings);
		// Create the definition
		this.definition = new b2BodyDef();
		
		this.definition = O.extend({}, this.definitionDefaults, this.definition);
		this.definition.userData = this.settings.data || "NONE";
		this.definition.position = new b2Vec2(this.position.x / this.settings.scale, this.position.y / this.settings.scale);
		this.settings.vx = this.settings.vx / this.settings.scale || 0;
		this.settings.vy = this.settings.vy / this.settings.scale || 0;
		this.definition.linearVelocity = new b2Vec2(this.settings.vx, this.settings.vy);
		
		this.definition.type = this.settings.type == "static" ? b2Body.b2_staticBody : b2Body.b2_dynamicBody;
		 
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
		 
		switch (this.settings.shape) {
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
				this.fixtureDef.shape.SetAsBox(this.settings.width/2, this.settings.height/2);
			break;
		}
		 
		this.body.CreateFixture(this.fixtureDef);
	};
	
    Body.prototype.applyImpulse = function(impulse){
	    this.body.ApplyImpulse(impulse, this.body.GetWorldCenter());
    };
	
    Body.prototype.applyForce = function(force){
	    this.body.ApplyForce(force, this.body.GetWorldCenter());
    };
	
	O.set('physics.body.box2d', Body);
})();