/*! Universe 2015-02-15 */
(function(){
	var Application = function(settings){
		
	};
	
	Application.prototype.init = function(settings){
		this.engine = new Engine(settings);
		this.engine.init();
		
		this.ctx = this.engine.ctx;
		
		var stage_element = $('#stage');
		stage_element.append(this.engine.getElement());
		
		var fs = function(){
			this.engine.handleFullScreen();
			stage_element.off('click', fs);
		}.bind(this);
		
		stage_element.click(fs);
		
		this.engine.handleResize(stage_element.width(),stage_element.height());
		
		$(window).on('resize', function(){
			this.engine.handleResize(stage_element.width(),stage_element.height());
		}.bind(this));
		
	};
	
	Application.prototype.start = function(){
		this.engine.start();
	};
	
	Application.prototype.stop = function(){
		this.engine.stop();
	};
	
	Application.prototype.togglePause = function(){
		//Pause audio too
		this.engine.paused = !this.engine.paused;
	};
	
	O.register('engine.application', Application);
})();
(function(Engine){
    var Component = function(ctx, settings){
	    this.ctx = ctx;
        this.settings = O.extend({}, this.default_settings, settings);
        
        var update = function(dt){
            this.update(dt);
        }.bind(this);
        
        var stop = function(){
            ctx.off('component.update', update);
        }.bind(this);
        
        ctx.on('component.update', update);
        ctx.once('stop', stop);
    };

    Component.prototype.classes = [];
    Component.prototype.settings_default = {
        name: 'Unnamed component',
        version: '0.0',
        paused: false
    };
    Component.prototype.update = function(){};
    Component.prototype.shutdown = function(){};
    
    O.register('engine.component', Component);

})();
(function(){
    var AudioManager = function(ctx){
        window.AudioContext = window.AudioContext || window.webkitAudioContext;
        this.audioContext = new AudioContext();
    };

	AudioManager.prototype.classes = ['engine.component'];
	
    AudioManager.prototype.load = function(asset){
        var settings = {
	        onload: function(){
		        this.set(asset.name, sound);
                //console.log("audio.load.decode", asset.name, asset);
                this.ctx.trigger('audio.loaded.' + asset.name, asset);

			}.bind(this)
        };
        
        settings.urls = (typeof asset.location === 'string') ? [asset.location] : asset.location;
		var sound = new Howl(settings);
		//console.log("HOWL", sound);
    };

    O.register('component.audio.howl', AudioManager);
})();
(function(Engine){
	var Data = function(){
		this.statesLogic = [];
		this.bootState = null;
		this.current_state = null;
		this.states = {};
		this.paused = false;
	};

	Data.prototype.classes = ['engine.component'];
	
	O.register('component.data', Data);

})();
(function(Engine){
	var Loader = function(){
		this.queue = [];
	};
	
	Loader.prototype.classes = ['engine.component'];
	
	Loader.prototype.queueList = function(list){
		list.forEach(function(asset){
			this.queueAsset(asset);
		}.bind(this));
	};

	Loader.prototype.queueAsset = function(asset){		
		for(var i in this.queue){
			if(this.queue[i].name == asset.name){
				//console.warn("assets.queueAsset.replace", asset.name, asset);
				this.queue[i] = asset;
				return this;
			}
		}

		//Force asset type to be lower case
		asset.type = asset.type.toLowerCase();
		
		//console.log("loader.queueAsset", asset.name, asset.type);
		
		this.queue.push(asset);
		return this;
	};
	
	Loader.prototype.load = function(list, callback){
		this.queueList(list);
		this.processQueue();
		if(typeof callback == 'function'){
			this.ctx.once('assets.loaded', callback);
		}
		return this;
	};
	
	Loader.prototype.processQueue = function(){
		this.queue.forEach(function(asset){
			//console.log("loader.load", asset.name, asset.location);
			
			this.ctx.once(asset.type + '.loaded.' + asset.name, function(asset){
				//console.log("loader.load.asset.loaded", asset.name, asset);
				this.removeFromQueue(asset);
				//console.log("Queue", this.queue);
				if(this.queue.length === 0){
					
					this.ctx.trigger('assets.loaded');
				}
			}.bind(this));
			
			switch(asset.type){
				case 'image':
					this.handlePIXI(asset);
				break;
				case 'audio':
					this.handleAudio(asset);
				break;
				default: 
					throw "loader.load.invalid asset type " + asset.type;
				break;
			}
		}.bind(this));

		return this;
	};
	
	Loader.prototype.handlePIXI = function(asset){
		var loaderByType = {
			'image': PIXI.ImageLoader,
			'json': PIXI.JsonLoader,
			'atlas': PIXI.AtlasLoader,
			'anim': PIXI.SpineLoader,
			'font': PIXI.BitmapFontLoader
		};
		//console.log("loader.handlePIXI.load", asset.name);
		var Constructor = loaderByType[asset.type];
		if(!Constructor)
			throw new Error(asset.type + ' is an unsupported file type');

		var loader = new Constructor(asset.location, false);
		loader.on('loaded', function(){
			this.ctx.renderer.assets.set(asset.name, asset);
			//console.log("loader.handlePIXI.loaded", asset.name, asset);
			this.ctx.trigger(asset.type + '.loaded.' + asset.name, asset);
		}.bind(this));

		loader.load();
	};

	Loader.prototype.handleAudio = function(asset){
		//console.log("loader.handleAudio", asset.name);
		this.ctx.audio.load(asset);
	};

	Loader.prototype.removeFromQueue = function(asset){
		this.queue.splice(this.queue.indexOf(asset), 1);
		return this;
	};
	
	O.register('component.loader', Loader);
	
})();
(function(){
	var Body = function (world, details) {
		this.details = details = details || {};
		//console.log("physics.body.construct", details);
		// Create the definition
		this.definition = new b2BodyDef();
		 
		// Set up the definition
		for (var k in this.definitionDefaults) {
			this.definition[k] = details[k] || this.definitionDefaults[k];
		}
		this.definition.position = new b2Vec2(details.x || 0, details.y || 0);
		this.definition.linearVelocity = new b2Vec2(details.vx || 0, details.vy || 0);
		this.definition.userData = details.userdata;
		this.definition.type = details.type == "static" ? b2Body.b2_staticBody : b2Body.b2_dynamicBody;
		 
		// Create the Body
		this.body = world.CreateBody(this.definition);
		 
		// Create the fixture
		this.fixtureDef = new b2FixtureDef();
			for (var l in this.fixtureDefaults) {
			this.fixtureDef[l] = details[l] || this.fixtureDefaults[l];
		};
		 
		 
		details.shape = details.shape || this.defaults.shape;
		 
		switch (details.shape) {
			case "circle":
				details.radius = details.radius || this.defaults.radius;
				this.fixtureDef.shape = new b2CircleShape(details.radius);
			break;
			case "polygon":
				this.fixtureDef.shape = new b2PolygonShape();
				this.fixtureDef.shape.SetAsArray(details.points, details.points.length);
			break;
			case "box":
			default:
				console.log("box", details);
				details.width = details.width || this.defaults.width;
				details.height = details.height || this.defaults.height;
				 
				this.fixtureDef.shape = new b2PolygonShape();
				this.fixtureDef.shape.SetAsBox(details.width, details.height);
			break;
		}
		 
		this.body.CreateFixture(this.fixtureDef);
	};
 
 
	Body.prototype.defaults = {
		shape: "box",
		width: 5,
		height: 5,
		radius: 2.5
	};
	 
	Body.prototype.fixtureDefaults = {
		density: 2,
		friction: 1,
		restitution: 0.2
	};
	 
	Body.prototype.definitionDefaults = {
		active: true,
		allowSleep: true,
		angle: 0,
		angularVelocity: 0,
		awake: true,
		bullet: false,
		fixedRotation: false
	};
	
	O.register('physics.body.box2d', Body);
})();
(function(){
	var Physics = function(){
		var init = function(settings){
			this.dtRemaining = 0;
			this.stepAmount = this.settings.stepAmount || 1 / 60;
			this.scale = this.settings.scale || 10;
			
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
		if(settings.x)settings.x /= this.scale;
		if(settings.y)settings.y /= this.scale;
		if(settings.width)settings.width /= this.scale;
		if(settings.height)settings.height /= this.scale;
		if(settings.radius)settings.radius /= this.scale;
		
		return O.instance('physics.body.box2d', this.world, settings);
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
	
	O.register('component.physics.box2d', Physics);
})();
(function(PIXI){
	PIXI.Point.prototype.mulScalar = function(scalar){
		this.x *= scalar;
		this.y *= scalar;
	};
	
	PIXI.Point.prototype.from = function(point){
		this.set(point.x, point.y);
	};
	
	PIXI.Point.prototype.add = function(point){
		this.set(this.x + point.x, this.y + point.y);
	};
	
	PIXI.Point.prototype.sub = function(point){
		this.set(this.x - point.x, this.y - point.y);
	};
	
	var RendererPixi = function(ctx, settings){
		console.log('renderer.pixi.start', this.settings);

		var update = function(){
			this.renderer.render(this.stage);
		}.bind(this);
		
		var init = function(){
			// create an new instance of a pixi stage
			this.stage = new PIXI.Stage(settings.background || 0x000000, settings.interactive);
	
			// create a renderer instance.
			this.renderer = PIXI.autoDetectRenderer(settings.width, settings.height, settings.renderer);
		}.bind(this);
		
		var stop = function(){
			ctx.off('update', update);
		}.bind(this);
		
		ctx.once('init', init);
		ctx.on('update', update);
		ctx.once('stop', stop);
		
		this.assets = new O;
	};

	RendererPixi.prototype.classes = ['engine.component'];
	
	RendererPixi.prototype.getElement = function(){
		return this.renderer.view;
	};
	
	RendererPixi.prototype.resize = function(width, height){
	    this.width = width;
	    this.height = height;
	    
	    if(this.renderer){
		    this.renderer.resize(this.width, this.height);
		}
	};
	
	RendererPixi.prototype.layer = function(){
		return new PIXI.DisplayObjectContainer();
	};
	
	RendererPixi.prototype.createGroup = function(){
		return new PIXI.DisplayObjectContainer();
	}
	
	RendererPixi.prototype.getTexture = function(name){
		var asset = this.assets.get(name);
		if(asset === undefined){
			throw("Asset not loaded " + name);
		}
		
		//console.log("renderer.pixi.texture", name, asset);
		return PIXI.Texture.fromImage(asset.location);
	};
	
	RendererPixi.prototype.getAnimationTextures = function(settings){
		var width = settings.width;
		var height = settings.height;
		
		var textures = [];
		//console.log("renderer.getAnimationTextures", settings);
		var frame_count = settings.frameCount || 0;
		
		var texture = this.getTexture(settings.name);
		var current_frame = 0;
		for(var y = settings.y || 0;y < texture.height;y += height){
			for(var x = settings.x || 0;x < texture.width;x += width){
				if(x + width > texture.width || y + height > texture.width){
					continue;
				}
				
				current_frame++;
				
				var frame_rect = new PIXI.Rectangle(x, y, width, height);
				var frame_crop = frame_rect.clone();
				var frame_trim = null;
				
				var frame = new PIXI.Texture(texture, frame_rect, frame_crop, frame_trim);
				textures.push(frame);
				//console.log(frame_count, current_frame);
				if(frame_count && frame_count == current_frame){
					break;
				}
			}
		}
		
		return textures;
	}
	
	RendererPixi.prototype.getAnimation = function(settings){
		var textures = this.getAnimationTextures(settings);
		var animation = new PIXI.MovieClip(textures);
		
		return animation;
	};
	
	RendererPixi.prototype.getSprite = function(name){
		var texture;
		//console.log("renderer.pixi.sprite", name);
		if(name !== undefined){
			texture = this.getTexture(name);
		}
		
		return new PIXI.Sprite(texture);
	}
	
	RendererPixi.prototype.requestFullScreen = function(){
		//console.log("renderer.pixi.requestFullScreen", this);
		if(this.renderer.view.webkitRequestFullScreen) {
			this.renderer.view.webkitRequestFullScreen();
		}
		else{
			this.renderer.view.mozRequestFullScreen();
		}
	};
	
	RendererPixi.prototype.add = function(child){
		//console.log("renderer.pixi.add", child);
		return this.stage.addChild(child);
	};
	
	RendererPixi.prototype.remove = function(child){
		//console.log("renderer.pixi.add", child);
		return this.stage.removeChild(child);
	};
	
	O.register('component.renderer.pixi', RendererPixi);
})(PIXI);
(function(){
	var Stage = function(){
		console.log("component.construct");
		this.objects = {};
		
		var step = this.settings.step || 1/60;
		var current_step = 0;
		var time_before = new Date().getTime();
		var update = function(dt){
			if(dt < current_step){
				current_step -= dt;
				return false;
			}
			time_now = new Date().getTime();
			time_delta = (time_now - time_before) / 1000;
			time_before = time_now;
			
			//Update listeners
			
			this.trigger('update', time_delta);
			this.trigger('addon.update', time_delta);
			
			//Update attached objects
			this.update(time_delta / 1000);
			current_step = step;
			
		}.bind(this);
		
		var init = function(){
			this.start();
			this.reset();
		}.bind(this);
		
		var stop = function(){
			this.stop();
			this.ctx.off('update', update);
		}.bind(this);

		this.ctx.once('init', init);
		this.ctx.once('stop', stop);
		this.ctx.on('update', update);
	};
	
	Stage.prototype.classes = ['engine.component', 'o.events'];
	
	Stage.prototype.width = function(){
		return this.ctx.renderer.width;
	};
	
	Stage.prototype.height = function(){
		return this.ctx.renderer.height;
	};
	
	Stage.prototype.start = function(){
		this.container = this.ctx.renderer.layer();
		this.ctx.renderer.add(this.container);
	};
	
	Stage.prototype.stop = function(){
		for(var id in this.objects){
			this.objects[id].stop();
			delete this.objects[i];
		}
	};
	
	Stage.prototype.reset = function(){
		this.stop();
		this.entities = {};
	};
	
	Stage.prototype.get = function(object_name){
		return this.objects[object_name];
	};
	
	Stage.prototype.createAdd = function(user_settings){		
		var default_settings = {
			instance: 'stage.object',
		};
		
		var settings = O.extend({}, default_settings, user_settings);
		
		console.log('stage.createAdd', settings);
		var object = O.instance(settings.instance, this, settings);
		this.add(object);

		return object;
	};
	
	Stage.prototype.add = function(object){
		var id = object.getID();
		if(id === undefined){
			console.warn("stage.add Object ID is undefined", object);
			throw("Object ID is undefined");
		}
		
		console.log('stage.add', id, this.objects);
		this.objects[id] = object;
		
		return this;
	};
	
	Stage.prototype.remove = function(id){
		if(typeof id === 'object'){
			id = object.getID();
		}
		
		var object = this.get(id);
		if(object){
			object.stop();
			delete this.objects[id];
		}

		return this;
	};
	
	Stage.prototype.update = function(dt){
/*
	    if(dt < this.step){
		    this.step -= dt;
	    }
	    else{
		    var show = true;
		    this.step = 1;
	    }
*/
	    
/*
		for(var id in this.objects){
			this.objects[id].update(dt);
		}
*/
	};
	/*
	Stage.prototype.createContainer = function(){
		return this.ctx.renderer.layer();
	};
	
	Stage.prototype.createSprite = function(name, settings){
		if(typeof name === 'object' && settings === undefined){
			settings = name;
			name = undefined;
		}
		
		var default_settings = {
			anchor: {
				x: 0.5,
				y: 0.5
			},
			interactive: false,
		};
		
		var settings = $.extend({}, default_settings, settings);
		
		//console.log("stage.createSprite", name, settings);
		var element = this.ctx.renderer.sprite(name);
		this.container.addChild(element);
		
		if(settings.x && settings.y){
			element.position.x = settings.x;
			element.position.y = settings.y;
		}
		
		if(settings.width){
			element.width = settings.width;
		}
		
		if(settings.height){
			element.height = settings.height;
		}
		
		element.interactive = settings.interactive;
		
		element.anchor.x = settings.anchor.x;
		element.anchor.y = settings.anchor.y;
		
		if(typeof settings.physics === 'object'){
			this.ctx.stage.attachBody(element, settings.physics);
		}
		
		return element;
	};
	
	Stage.prototype.createBody = function(settings){
		var default_settings = {
			type: 'static',
			friction: 0.5	
		};
		
		return this.ctx.physics.createBody(O.extend({}, default_settings, settings));
	};
	
	Stage.prototype.attachBody = function(entity, settings){
		settings.x = entity.x;
		settings.y = entity.y;
		if(!settings.shape || settings.shape == 'box'){
			settings.width = entity.width;
			settings.height = entity.height;
			console.log("stage.attachBody.custom", settings);
		}
		
		this.ctx.physics.attachBody(entity, settings);
	};
	
	Stage.prototype.graphics = function(){
		//console.log('stage.graphics');
		var element = new PIXI.Graphics();
		this.container.addChild(element);
		
		return element;
	};
	*/
	O.register('component.stage', Stage);
})();
(function(Engine){
	var StateMachine = function(){
		console.log("component.state.construct");

		this.statesLogic = [];
		this.bootState = null;
		this.current_state = null;
		this.states = {};
		this.paused = false;
		
		var step = this.settings.step || 1/30;
		var current_step = 0;
		
		var update = function(dt){
			if(dt < current_step){
				current_step -= dt;
				return false;
			}

// 			console.log("state update");
			this.update(dt);
			current_step = step;
			
		}.bind(this);
		
		var init = function(){
			console.log("component.state.init", this.settings);
			for(var i in this.settings.states){
				var state = this.settings.states[i];
				this.addState(state, 'sm.' + state);
			}
		}.bind(this);
		
		var stop = function(){
			this.ctx.off('update', update);
		}.bind(this);
		
		var start = function(){
			this.start(this.settings.boot || 'boot');
		}.bind(this);
		
		this.ctx.once('init', init);
		this.ctx.once('start', start);
		this.ctx.on('update', update);
		this.ctx.once('stop', stop);
	};

	StateMachine.prototype.classes = ['engine.component'];

	StateMachine.prototype.changeTo = function(state_name){
		this.stop();
		this.start(state_name);
	};
	
	StateMachine.prototype.addState = function(state_name, state_object){
		this.states[state_name] = state_object;
	};
	
	StateMachine.prototype.stop = function(){
		if(this.currentState){
			console.log('state.stop', this.currentState.name);
			this.currentState.instance.stop();
		}
		
		return this;
	};
	
	StateMachine.prototype.start = function(state_name){
		if(this.currentState){
			this.stop();
		}
		
		console.log('state.start', state_name);
		var state = this.states[state_name];
		var state_instance = O.instance(state, this.ctx);
		
		if(state_instance === undefined){
			throw("Undefined state " + state_name);
		}
		
		this.currentState = {
			name: state_name,
			instance: state_instance
		};
		
		this.currentState.instance.start();
	}
	
	StateMachine.prototype.update = function(dt){
		if(this.currentState){
			this.currentState.instance.update(dt);
		}
	};
	
	O.register('component.state', StateMachine);

})();
(function(){
	
	var Context = function(settings){
		this.settings = settings;
		this.components = {
			
		};
		
		for(var i in settings.components){
			this.loadComponent(i, settings.components[i]);
		}
	};
	
	Context.prototype.classes = ['o.events'];
	Context.prototype.loadComponent = function(name, object_name){
		var settings = this.settings[name] || {};
		//console.log('context.loadComponent', name, object_name, settings);
		
		var component = O.instance(object_name, this, settings);
		this.components[name] = this[name] = component;
		
		return component;
	}
	
	O.register('engine.context', Context);
})(O);
(function(Engine){
    var Component = function(ctx, settings){
	    this.ctx = ctx;
        this.settings = O.extend({}, this.default_settings, settings);
        
        var update = function(dt){
            this.update(dt);
        }.bind(this);
        
        var stop = function(){
            ctx.off('component.update', update);
        }.bind(this);
        
        ctx.on('component.update', update);
        ctx.once('stop', stop);
    };

    Component.prototype.classes = [];
    Component.prototype.settings_default = {
        name: 'Unnamed component',
        version: '0.0',
        paused: false
    };
    Component.prototype.update = function(){};
    Component.prototype.shutdown = function(){};
    
    O.register('engine.component', Component);

})();(function(){
	
	var Context = function(settings){
		this.settings = settings;
		this.components = {
			
		};
		
		for(var i in settings.components){
			this.loadComponent(i, settings.components[i]);
		}
	};
	
	Context.prototype.classes = ['o.events'];
	Context.prototype.loadComponent = function(name, object_name){
		var settings = this.settings[name] || {};
		//console.log('context.loadComponent', name, object_name, settings);
		
		var component = O.instance(object_name, this, settings);
		this.components[name] = this[name] = component;
		
		return component;
	}
	
	O.register('engine.context', Context);
})(O);(function(){
	var Engine = function(settings){
        this.isRunning = false,
		this.isPaused = false;
		this.components = [];

        this.settings = settings = O.extend(true, {}, this.settings_default, settings);

        console.log("engine.construct", settings);
		
		this.ctx = O.instance('engine.context', settings);
		console.log("engine.construct Initialize context");


        var time_previous = time_current = new Date().getTime();
        var time_delta = 0;
        var update = function(){
	        
            requestAnimationFrame(update);
            if(this.isRunning){
                time_current = new Date().getTime();
                time_delta = (time_current - time_previous) / 1000;
                
				this.ctx.trigger('update', time_delta, time_current);
                
                time_previous = time_current;
            }

        }.bind(this);
        
        var stop = function(){
	        this.ctx.off('start', start);
	        this.ctx.off('pause', pause);
	        this.ctx.off('stop', stop);
	        
        }.bind(this);
        
        var start = function(){
	        this.isRunning = true;
        }.bind(this);
        
        var pause = function(){
	        this.isRunning = false;
        }.bind(this);
        
        this.ctx.on('start', start);
        this.ctx.on('pause', pause);
        
        //Setup animation frame
        console.log("engine.construct Setup animation frame");
        requestAnimationFrame(update);
	};
	
	Engine.prototype.classes = ['o.events'];

    Engine.prototype.settings_default = {
	    components: {
		    renderer: 	'component.renderer.pixi',
		    audio: 		'component.audio.howl',
		    physics: 	'component.physics.box2dweb',
		    stage: 		'component.stage',
		    loader: 	'component.loader',
		    state: 		'component.state',
		    data: 		'component.data'
	    },
	    renderer: {
		    
	    }
    };

    Engine.prototype.loadComponent = function(name, object_name){
		this.ctx.loadComponent(name, object_name);
		
		return this;
    };

	Engine.prototype.init = function(){
		console.log("engine.init");
		this.ctx.trigger('init');
	};

	Engine.prototype.handleFullScreen = function(){
		return this.ctx.renderer.requestFullScreen.bind(this.ctx.renderer)
	};
	
	Engine.prototype.handleResize = function(width, height){
		this.ctx.renderer.resize(width, height);
	};

	Engine.prototype.getElement = function(){
		//console.log("engine.getElement", this.ctx.renderer.getElement());
		return this.ctx.renderer.getElement();
	};

	Engine.prototype.addState = function(name, state){
		//console.log("engine.addState", name);
		this.ctx.state.addState(name, state);
		
		return this;
	}

	Engine.prototype.start = function(){
		console.log("engine.start");
		this.ctx.trigger('start');
	};
	
	Engine.prototype.stop = function(){
		console.log("engine.stop");
		this.ctx.trigger('stop');
		return this;
	};
	
	Engine.prototype.update = function(){
		requestAnimationFrame(this.updateCallback);
		this.timeCurrent = new Date().getTime();
		this.timeDelta = (this.timeCurrent - this.timePrevious) / 1000;
		if(!this.paused){
			this.ctx.trigger('update', this.timeDelta);
			this.ctx.trigger('update.renderer');
		}
		
		this.timePrevious = this.timeCurrent;
	}

	O.register('engine', Engine);
	
	window.Engine = Engine;
})();

(function(Engine){
	var State = function(ctx){
		this.stage = ctx.stage;
		this.stage.reset();		
	};
	
	State.prototype.classes = ['engine.component']
	
	State.prototype.update = function(){
	};
	
	O.register('engine.state', State);
})(Engine);(function(){
	var Application = function(settings){
		
	};
	
	Application.prototype.init = function(settings){
		this.engine = new Engine(settings);
		this.engine.init();
		
		this.ctx = this.engine.ctx;
		
		var stage_element = $('#stage');
		stage_element.append(this.engine.getElement());
		
		var fs = function(){
			this.engine.handleFullScreen();
			stage_element.off('click', fs);
		}.bind(this);
		
		stage_element.click(fs);
		
		this.engine.handleResize(stage_element.width(),stage_element.height());
		
		$(window).on('resize', function(){
			this.engine.handleResize(stage_element.width(),stage_element.height());
		}.bind(this));
		
	};
	
	Application.prototype.start = function(){
		this.engine.start();
	};
	
	Application.prototype.stop = function(){
		this.engine.stop();
	};
	
	Application.prototype.togglePause = function(){
		//Pause audio too
		this.engine.paused = !this.engine.paused;
	};
	
	O.register('engine.application', Application);
})();(function(){
	var StagePhysics = function(){

    };
    
    StagePhysics.prototype.classes = ['stage.object'];
	StagePhysics.prototype.attachBody = function(settings){
		settings.x = entity.position.x;
		settings.y = entity.position.y;
		this.ctx.physics.attachBody(entity, settings);
	};
    
	O.register('addon.physics', StagePhysics);
})();(function(){
	var Animation = function(parent, sprite){
		this.sprite = this.settings.sprite;
		this.animations = {};
		this.currentAnimation = null;
		
		//console.log('animation.construct', sprite);
		//Handle events
		var step = 1 / 1;
		var time_remaining = 0;
		
		var update = function(dt){
			if(dt < time_remaining){
				time_remaining -= dt;
				return false;
			}
			
			if(this.currentAnimation){
				this.currentAnimation.currentFrame++;
				if(this.currentAnimation.currentFrame > this.currentAnimation.endFrame){
					this.currentAnimation.currentFrame = this.currentAnimation.startFrame;
				}
				time_remaining = 1 / this.currentAnimation.fps;
				this.sprite.setFrame(this.currentAnimation.currentFrame);
			}
		}.bind(this);
		
		var stop = function(){
			this.off(update);
		}.bind(this);
		
		parent.on('addon.update', update);
		parent.once('stop', stop);
		this.sprite.setFrame(0);
	};
	
	Animation.prototype.classes = ['stage.object'];
	
	Animation.prototype.add = function(animation){
		if(typeof animation !== 'object'){
			console.error("animation.add Invalida animation argument", animation);
			throw("");
		}
		
		animation.startFrame = this.sprite.frames.length;
		var frames = this.sprite.loadAnimation(animation);
		animation.endFrame = animation.startFrame + frames.length;
		animation.currentFrame = animation.startFrame;
		
		this.animations[animation.name] = animation;
	};
	
	Animation.prototype.play = function(name){
		if(typeof name !== 'string'){
			console.error('animation.play Invalid animation name argument', name);
			throw("");
		}
		
		this.currentAnimation = this.animations[name];
		this.currentAnimation.currentFrame = this.currentAnimation.startFrame;
		console.log("animation.play", this.currentAnimation);
	}
	
	O.register('addon.animation', Animation);
})();(function(){
	var StageSprite = function(stage, user_settings){
		this.frames = [];
		this.renderer = this.ctx.renderer;
		
		this.currentFrame = null;
		
		this.stage = stage;
		this.ctx = stage.ctx;
		
		var default_settings = {
			x: 0,
			y: 0,
			anchor: {
				x: 0.5, 
				y:0.5
			}
		};
		
		this.settings = O.extend({}, default_settings, user_settings);
		
		//console.log('stage.sprite.construct', this.id, this.settings, this.ctx);
		
		//Create sprite
		this.sprite = this.ctx.renderer.getSprite();
		this.ctx.renderer.add(this.sprite);
		
		this.sprite.anchor.set(this.settings.anchor.x, this.settings.anchor.y);
		this.sprite.position.set(this.settings.x, this.settings.y);
		this.position = this.sprite.position;
		this.scale = this.sprite.scale;
		
		this.sprite.interactive = true;
		this.sprite.buttonMode = true;
    };
    
    StageSprite.prototype.classes = ['stage.object'];
	StageSprite.prototype.loadFrame = function(name, index){
		index = index || this.frames.length;
		var texture = this.renderer.getTexture(name);
		this.frames[index] = texture;
		
		if(!this.frameCurrent){
			this.setFrame(0);	
		}
		
		return this;
	};
	
	StageSprite.prototype.nextFrame = function(){
		this.setFrame(this.currentFrame + 1);
	};
	
	StageSprite.prototype.setFrame = function(index){
		if(this.frames.length === 0){
			return this;
		}
		
		if(index > this.frames.length - 1){
			index = 0;
		}
		
		if(index < 0){
			index = this.frames.length - 1;
		}
		
		this.currentFrame = index;
		//console.log('sprite.setFrame', index, this.sprite);
		this.sprite.setTexture(this.frames[this.currentFrame]);
		
		return this;
	};
    
    StageSprite.prototype.loadAnimation = function(settings){
		var frames = this.renderer.getAnimationTextures(settings);
		console.log("sprite.loadAnimation", frames.length);
		for(var i in frames){
			this.frames.push(frames[i]);
		}
		
		return frames;
    };
    
	O.register('addon.sprite', StageSprite);
})();(function(){
	
	function uuid(){
		return parseInt(new Date().getTime()).toString(16);
	}
	
	var StageObject = function(stage, settings){
		this.stage = stage;
		this.ctx = stage.ctx;
		
		var default_settings = {
			id: uuid(),
			x: 0,
			y: 0,
			anchor: {
				x: 0.5, 
				y:0.5
			}
		};
		
		this.settings = O.extend({}, default_settings, settings);
		
		var update = function(){
			this.update();
		}.bind(this);
		
		var stop = function(){
			this.ctx.off('update', update);
		}.bind(this);
		
		this.ctx.on('update', update);
		this.ctx.once('stop', stop);
		//console.log('stage.object.construct', this.id, this.settings, this.ctx);
    };
    
    StageObject.prototype.classes = ['o.events'];
    
    StageObject.prototype.update = function(dt){
	    //this.trigger('update', dt);
    };
    
    StageObject.prototype.getID = function(){
	    return this.settings.id;
    }
    
    O.register('stage.object', StageObject);
})();(function(Engine){
	var Loader = function(){
		this.queue = [];
	};
	
	Loader.prototype.classes = ['engine.component'];
	
	Loader.prototype.queueList = function(list){
		list.forEach(function(asset){
			this.queueAsset(asset);
		}.bind(this));
	};

	Loader.prototype.queueAsset = function(asset){		
		for(var i in this.queue){
			if(this.queue[i].name == asset.name){
				//console.warn("assets.queueAsset.replace", asset.name, asset);
				this.queue[i] = asset;
				return this;
			}
		}

		//Force asset type to be lower case
		asset.type = asset.type.toLowerCase();
		
		//console.log("loader.queueAsset", asset.name, asset.type);
		
		this.queue.push(asset);
		return this;
	};
	
	Loader.prototype.load = function(list, callback){
		this.queueList(list);
		this.processQueue();
		if(typeof callback == 'function'){
			this.ctx.once('assets.loaded', callback);
		}
		return this;
	};
	
	Loader.prototype.processQueue = function(){
		this.queue.forEach(function(asset){
			//console.log("loader.load", asset.name, asset.location);
			
			this.ctx.once(asset.type + '.loaded.' + asset.name, function(asset){
				//console.log("loader.load.asset.loaded", asset.name, asset);
				this.removeFromQueue(asset);
				//console.log("Queue", this.queue);
				if(this.queue.length === 0){
					
					this.ctx.trigger('assets.loaded');
				}
			}.bind(this));
			
			switch(asset.type){
				case 'image':
					this.handlePIXI(asset);
				break;
				case 'audio':
					this.handleAudio(asset);
				break;
				default: 
					throw "loader.load.invalid asset type " + asset.type;
				break;
			}
		}.bind(this));

		return this;
	};
	
	Loader.prototype.handlePIXI = function(asset){
		var loaderByType = {
			'image': PIXI.ImageLoader,
			'json': PIXI.JsonLoader,
			'atlas': PIXI.AtlasLoader,
			'anim': PIXI.SpineLoader,
			'font': PIXI.BitmapFontLoader
		};
		//console.log("loader.handlePIXI.load", asset.name);
		var Constructor = loaderByType[asset.type];
		if(!Constructor)
			throw new Error(asset.type + ' is an unsupported file type');

		var loader = new Constructor(asset.location, false);
		loader.on('loaded', function(){
			this.ctx.renderer.assets.set(asset.name, asset);
			//console.log("loader.handlePIXI.loaded", asset.name, asset);
			this.ctx.trigger(asset.type + '.loaded.' + asset.name, asset);
		}.bind(this));

		loader.load();
	};

	Loader.prototype.handleAudio = function(asset){
		//console.log("loader.handleAudio", asset.name);
		this.ctx.audio.load(asset);
	};

	Loader.prototype.removeFromQueue = function(asset){
		this.queue.splice(this.queue.indexOf(asset), 1);
		return this;
	};
	
	O.register('component.loader', Loader);
	
})();(function(PIXI){
	PIXI.Point.prototype.mulScalar = function(scalar){
		this.x *= scalar;
		this.y *= scalar;
	};
	
	PIXI.Point.prototype.from = function(point){
		this.set(point.x, point.y);
	};
	
	PIXI.Point.prototype.add = function(point){
		this.set(this.x + point.x, this.y + point.y);
	};
	
	PIXI.Point.prototype.sub = function(point){
		this.set(this.x - point.x, this.y - point.y);
	};
	
	var RendererPixi = function(ctx, settings){
		console.log('renderer.pixi.start', this.settings);

		var update = function(){
			this.renderer.render(this.stage);
		}.bind(this);
		
		var init = function(){
			// create an new instance of a pixi stage
			this.stage = new PIXI.Stage(settings.background || 0x000000, settings.interactive);
	
			// create a renderer instance.
			this.renderer = PIXI.autoDetectRenderer(settings.width, settings.height, settings.renderer);
		}.bind(this);
		
		var stop = function(){
			ctx.off('update', update);
		}.bind(this);
		
		ctx.once('init', init);
		ctx.on('update', update);
		ctx.once('stop', stop);
		
		this.assets = new O;
	};

	RendererPixi.prototype.classes = ['engine.component'];
	
	RendererPixi.prototype.getElement = function(){
		return this.renderer.view;
	};
	
	RendererPixi.prototype.resize = function(width, height){
	    this.width = width;
	    this.height = height;
	    
	    if(this.renderer){
		    this.renderer.resize(this.width, this.height);
		}
	};
	
	RendererPixi.prototype.layer = function(){
		return new PIXI.DisplayObjectContainer();
	};
	
	RendererPixi.prototype.createGroup = function(){
		return new PIXI.DisplayObjectContainer();
	}
	
	RendererPixi.prototype.getTexture = function(name){
		var asset = this.assets.get(name);
		if(asset === undefined){
			throw("Asset not loaded " + name);
		}
		
		//console.log("renderer.pixi.texture", name, asset);
		return PIXI.Texture.fromImage(asset.location);
	};
	
	RendererPixi.prototype.getAnimationTextures = function(settings){
		var width = settings.width;
		var height = settings.height;
		
		var textures = [];
		//console.log("renderer.getAnimationTextures", settings);
		var frame_count = settings.frameCount || 0;
		
		var texture = this.getTexture(settings.name);
		var current_frame = 0;
		for(var y = settings.y || 0;y < texture.height;y += height){
			for(var x = settings.x || 0;x < texture.width;x += width){
				if(x + width > texture.width || y + height > texture.width){
					continue;
				}
				
				current_frame++;
				
				var frame_rect = new PIXI.Rectangle(x, y, width, height);
				var frame_crop = frame_rect.clone();
				var frame_trim = null;
				
				var frame = new PIXI.Texture(texture, frame_rect, frame_crop, frame_trim);
				textures.push(frame);
				//console.log(frame_count, current_frame);
				if(frame_count && frame_count == current_frame){
					break;
				}
			}
		}
		
		return textures;
	}
	
	RendererPixi.prototype.getAnimation = function(settings){
		var textures = this.getAnimationTextures(settings);
		var animation = new PIXI.MovieClip(textures);
		
		return animation;
	};
	
	RendererPixi.prototype.getSprite = function(name){
		var texture;
		//console.log("renderer.pixi.sprite", name);
		if(name !== undefined){
			texture = this.getTexture(name);
		}
		
		return new PIXI.Sprite(texture);
	}
	
	RendererPixi.prototype.requestFullScreen = function(){
		//console.log("renderer.pixi.requestFullScreen", this);
		if(this.renderer.view.webkitRequestFullScreen) {
			this.renderer.view.webkitRequestFullScreen();
		}
		else{
			this.renderer.view.mozRequestFullScreen();
		}
	};
	
	RendererPixi.prototype.add = function(child){
		//console.log("renderer.pixi.add", child);
		return this.stage.addChild(child);
	};
	
	RendererPixi.prototype.remove = function(child){
		//console.log("renderer.pixi.add", child);
		return this.stage.removeChild(child);
	};
	
	O.register('component.renderer.pixi', RendererPixi);
})(PIXI);(function(Engine){
	var StateMachine = function(){
		console.log("component.state.construct");

		this.statesLogic = [];
		this.bootState = null;
		this.current_state = null;
		this.states = {};
		this.paused = false;
		
		var step = this.settings.step || 1/30;
		var current_step = 0;
		
		var update = function(dt){
			if(dt < current_step){
				current_step -= dt;
				return false;
			}

// 			console.log("state update");
			this.update(dt);
			current_step = step;
			
		}.bind(this);
		
		var init = function(){
			console.log("component.state.init", this.settings);
			for(var i in this.settings.states){
				var state = this.settings.states[i];
				this.addState(state, 'sm.' + state);
			}
		}.bind(this);
		
		var stop = function(){
			this.ctx.off('update', update);
		}.bind(this);
		
		var start = function(){
			this.start(this.settings.boot || 'boot');
		}.bind(this);
		
		this.ctx.once('init', init);
		this.ctx.once('start', start);
		this.ctx.on('update', update);
		this.ctx.once('stop', stop);
	};

	StateMachine.prototype.classes = ['engine.component'];

	StateMachine.prototype.changeTo = function(state_name){
		this.stop();
		this.start(state_name);
	};
	
	StateMachine.prototype.addState = function(state_name, state_object){
		this.states[state_name] = state_object;
	};
	
	StateMachine.prototype.stop = function(){
		if(this.currentState){
			console.log('state.stop', this.currentState.name);
			this.currentState.instance.stop();
		}
		
		return this;
	};
	
	StateMachine.prototype.start = function(state_name){
		if(this.currentState){
			this.stop();
		}
		
		console.log('state.start', state_name);
		var state = this.states[state_name];
		var state_instance = O.instance(state, this.ctx);
		
		if(state_instance === undefined){
			throw("Undefined state " + state_name);
		}
		
		this.currentState = {
			name: state_name,
			instance: state_instance
		};
		
		this.currentState.instance.start();
	}
	
	StateMachine.prototype.update = function(dt){
		if(this.currentState){
			this.currentState.instance.update(dt);
		}
	};
	
	O.register('component.state', StateMachine);

})();(function(){
	var Body = function (world, details) {
		this.details = details = details || {};
		//console.log("physics.body.construct", details);
		// Create the definition
		this.definition = new b2BodyDef();
		 
		// Set up the definition
		for (var k in this.definitionDefaults) {
			this.definition[k] = details[k] || this.definitionDefaults[k];
		}
		this.definition.position = new b2Vec2(details.x || 0, details.y || 0);
		this.definition.linearVelocity = new b2Vec2(details.vx || 0, details.vy || 0);
		this.definition.userData = details.userdata;
		this.definition.type = details.type == "static" ? b2Body.b2_staticBody : b2Body.b2_dynamicBody;
		 
		// Create the Body
		this.body = world.CreateBody(this.definition);
		 
		// Create the fixture
		this.fixtureDef = new b2FixtureDef();
			for (var l in this.fixtureDefaults) {
			this.fixtureDef[l] = details[l] || this.fixtureDefaults[l];
		};
		 
		 
		details.shape = details.shape || this.defaults.shape;
		 
		switch (details.shape) {
			case "circle":
				details.radius = details.radius || this.defaults.radius;
				this.fixtureDef.shape = new b2CircleShape(details.radius);
			break;
			case "polygon":
				this.fixtureDef.shape = new b2PolygonShape();
				this.fixtureDef.shape.SetAsArray(details.points, details.points.length);
			break;
			case "box":
			default:
				console.log("box", details);
				details.width = details.width || this.defaults.width;
				details.height = details.height || this.defaults.height;
				 
				this.fixtureDef.shape = new b2PolygonShape();
				this.fixtureDef.shape.SetAsBox(details.width, details.height);
			break;
		}
		 
		this.body.CreateFixture(this.fixtureDef);
	};
 
 
	Body.prototype.defaults = {
		shape: "box",
		width: 5,
		height: 5,
		radius: 2.5
	};
	 
	Body.prototype.fixtureDefaults = {
		density: 2,
		friction: 1,
		restitution: 0.2
	};
	 
	Body.prototype.definitionDefaults = {
		active: true,
		allowSleep: true,
		angle: 0,
		angularVelocity: 0,
		awake: true,
		bullet: false,
		fixedRotation: false
	};
	
	O.register('physics.body.box2d', Body);
})();(function(){
	var Physics = function(){
		var init = function(settings){
			this.dtRemaining = 0;
			this.stepAmount = this.settings.stepAmount || 1 / 60;
			this.scale = this.settings.scale || 10;
			
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
		if(settings.x)settings.x /= this.scale;
		if(settings.y)settings.y /= this.scale;
		if(settings.width)settings.width /= this.scale;
		if(settings.height)settings.height /= this.scale;
		if(settings.radius)settings.radius /= this.scale;
		
		return O.instance('physics.body.box2d', this.world, settings);
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
	
	O.register('component.physics.box2d', Physics);
})();(function(Engine){
	var Data = function(){
		this.statesLogic = [];
		this.bootState = null;
		this.current_state = null;
		this.states = {};
		this.paused = false;
	};

	Data.prototype.classes = ['engine.component'];
	
	O.register('component.data', Data);

})();(function(){
    var AudioManager = function(ctx){
        window.AudioContext = window.AudioContext || window.webkitAudioContext;
        this.audioContext = new AudioContext();
    };

	AudioManager.prototype.classes = ['engine.component'];
	
    AudioManager.prototype.load = function(asset){
        var settings = {
	        onload: function(){
		        this.set(asset.name, sound);
                //console.log("audio.load.decode", asset.name, asset);
                this.ctx.trigger('audio.loaded.' + asset.name, asset);

			}.bind(this)
        };
        
        settings.urls = (typeof asset.location === 'string') ? [asset.location] : asset.location;
		var sound = new Howl(settings);
		//console.log("HOWL", sound);
    };

    O.register('component.audio.howl', AudioManager);
})();(function(){
	var Stage = function(){
		console.log("component.construct");
		this.objects = {};
		
		var step = this.settings.step || 1/60;
		var current_step = 0;
		var time_before = new Date().getTime();
		var update = function(dt){
			if(dt < current_step){
				current_step -= dt;
				return false;
			}
			time_now = new Date().getTime();
			time_delta = (time_now - time_before) / 1000;
			time_before = time_now;
			
			//Update listeners
			
			this.trigger('update', time_delta);
			this.trigger('addon.update', time_delta);
			
			//Update attached objects
			this.update(time_delta / 1000);
			current_step = step;
			
		}.bind(this);
		
		var init = function(){
			this.start();
			this.reset();
		}.bind(this);
		
		var stop = function(){
			this.stop();
			this.ctx.off('update', update);
		}.bind(this);

		this.ctx.once('init', init);
		this.ctx.once('stop', stop);
		this.ctx.on('update', update);
	};
	
	Stage.prototype.classes = ['engine.component', 'o.events'];
	
	Stage.prototype.width = function(){
		return this.ctx.renderer.width;
	};
	
	Stage.prototype.height = function(){
		return this.ctx.renderer.height;
	};
	
	Stage.prototype.start = function(){
		this.container = this.ctx.renderer.layer();
		this.ctx.renderer.add(this.container);
	};
	
	Stage.prototype.stop = function(){
		for(var id in this.objects){
			this.objects[id].stop();
			delete this.objects[i];
		}
	};
	
	Stage.prototype.reset = function(){
		this.stop();
		this.entities = {};
	};
	
	Stage.prototype.get = function(object_name){
		return this.objects[object_name];
	};
	
	Stage.prototype.createAdd = function(user_settings){		
		var default_settings = {
			instance: 'stage.object',
		};
		
		var settings = O.extend({}, default_settings, user_settings);
		
		console.log('stage.createAdd', settings);
		var object = O.instance(settings.instance, this, settings);
		this.add(object);

		return object;
	};
	
	Stage.prototype.add = function(object){
		var id = object.getID();
		if(id === undefined){
			console.warn("stage.add Object ID is undefined", object);
			throw("Object ID is undefined");
		}
		
		console.log('stage.add', id, this.objects);
		this.objects[id] = object;
		
		return this;
	};
	
	Stage.prototype.remove = function(id){
		if(typeof id === 'object'){
			id = object.getID();
		}
		
		var object = this.get(id);
		if(object){
			object.stop();
			delete this.objects[id];
		}

		return this;
	};
	
	Stage.prototype.update = function(dt){
/*
	    if(dt < this.step){
		    this.step -= dt;
	    }
	    else{
		    var show = true;
		    this.step = 1;
	    }
*/
	    
/*
		for(var id in this.objects){
			this.objects[id].update(dt);
		}
*/
	};
	/*
	Stage.prototype.createContainer = function(){
		return this.ctx.renderer.layer();
	};
	
	Stage.prototype.createSprite = function(name, settings){
		if(typeof name === 'object' && settings === undefined){
			settings = name;
			name = undefined;
		}
		
		var default_settings = {
			anchor: {
				x: 0.5,
				y: 0.5
			},
			interactive: false,
		};
		
		var settings = $.extend({}, default_settings, settings);
		
		//console.log("stage.createSprite", name, settings);
		var element = this.ctx.renderer.sprite(name);
		this.container.addChild(element);
		
		if(settings.x && settings.y){
			element.position.x = settings.x;
			element.position.y = settings.y;
		}
		
		if(settings.width){
			element.width = settings.width;
		}
		
		if(settings.height){
			element.height = settings.height;
		}
		
		element.interactive = settings.interactive;
		
		element.anchor.x = settings.anchor.x;
		element.anchor.y = settings.anchor.y;
		
		if(typeof settings.physics === 'object'){
			this.ctx.stage.attachBody(element, settings.physics);
		}
		
		return element;
	};
	
	Stage.prototype.createBody = function(settings){
		var default_settings = {
			type: 'static',
			friction: 0.5	
		};
		
		return this.ctx.physics.createBody(O.extend({}, default_settings, settings));
	};
	
	Stage.prototype.attachBody = function(entity, settings){
		settings.x = entity.x;
		settings.y = entity.y;
		if(!settings.shape || settings.shape == 'box'){
			settings.width = entity.width;
			settings.height = entity.height;
			console.log("stage.attachBody.custom", settings);
		}
		
		this.ctx.physics.attachBody(entity, settings);
	};
	
	Stage.prototype.graphics = function(){
		//console.log('stage.graphics');
		var element = new PIXI.Graphics();
		this.container.addChild(element);
		
		return element;
	};
	*/
	O.register('component.stage', Stage);
})();
(function(){
	var Engine = function(settings){
        this.isRunning = false,
		this.isPaused = false;
		this.components = [];

        this.settings = settings = O.extend(true, {}, this.settings_default, settings);

        console.log("engine.construct", settings);
		
		this.ctx = O.instance('engine.context', settings);
		console.log("engine.construct Initialize context");


        var time_previous = time_current = new Date().getTime();
        var time_delta = 0;
        var update = function(){
	        
            requestAnimationFrame(update);
            if(this.isRunning){
                time_current = new Date().getTime();
                time_delta = (time_current - time_previous) / 1000;
                
				this.ctx.trigger('update', time_delta, time_current);
                
                time_previous = time_current;
            }

        }.bind(this);
        
        var stop = function(){
	        this.ctx.off('start', start);
	        this.ctx.off('pause', pause);
	        this.ctx.off('stop', stop);
	        
        }.bind(this);
        
        var start = function(){
	        this.isRunning = true;
        }.bind(this);
        
        var pause = function(){
	        this.isRunning = false;
        }.bind(this);
        
        this.ctx.on('start', start);
        this.ctx.on('pause', pause);
        
        //Setup animation frame
        console.log("engine.construct Setup animation frame");
        requestAnimationFrame(update);
	};
	
	Engine.prototype.classes = ['o.events'];

    Engine.prototype.settings_default = {
	    components: {
		    renderer: 	'component.renderer.pixi',
		    audio: 		'component.audio.howl',
		    physics: 	'component.physics.box2dweb',
		    stage: 		'component.stage',
		    loader: 	'component.loader',
		    state: 		'component.state',
		    data: 		'component.data'
	    },
	    renderer: {
		    
	    }
    };

    Engine.prototype.loadComponent = function(name, object_name){
		this.ctx.loadComponent(name, object_name);
		
		return this;
    };

	Engine.prototype.init = function(){
		console.log("engine.init");
		this.ctx.trigger('init');
	};

	Engine.prototype.handleFullScreen = function(){
		return this.ctx.renderer.requestFullScreen.bind(this.ctx.renderer)
	};
	
	Engine.prototype.handleResize = function(width, height){
		this.ctx.renderer.resize(width, height);
	};

	Engine.prototype.getElement = function(){
		//console.log("engine.getElement", this.ctx.renderer.getElement());
		return this.ctx.renderer.getElement();
	};

	Engine.prototype.addState = function(name, state){
		//console.log("engine.addState", name);
		this.ctx.state.addState(name, state);
		
		return this;
	}

	Engine.prototype.start = function(){
		console.log("engine.start");
		this.ctx.trigger('start');
	};
	
	Engine.prototype.stop = function(){
		console.log("engine.stop");
		this.ctx.trigger('stop');
		return this;
	};
	
	Engine.prototype.update = function(){
		requestAnimationFrame(this.updateCallback);
		this.timeCurrent = new Date().getTime();
		this.timeDelta = (this.timeCurrent - this.timePrevious) / 1000;
		if(!this.paused){
			this.ctx.trigger('update', this.timeDelta);
			this.ctx.trigger('update.renderer');
		}
		
		this.timePrevious = this.timeCurrent;
	}

	O.register('engine', Engine);
	
	window.Engine = Engine;
})();


(function(){
	var Animation = function(parent, sprite){
		this.sprite = this.settings.sprite;
		this.animations = {};
		this.currentAnimation = null;
		
		//console.log('animation.construct', sprite);
		//Handle events
		var step = 1 / 1;
		var time_remaining = 0;
		
		var update = function(dt){
			if(dt < time_remaining){
				time_remaining -= dt;
				return false;
			}
			
			if(this.currentAnimation){
				this.currentAnimation.currentFrame++;
				if(this.currentAnimation.currentFrame > this.currentAnimation.endFrame){
					this.currentAnimation.currentFrame = this.currentAnimation.startFrame;
				}
				time_remaining = 1 / this.currentAnimation.fps;
				this.sprite.setFrame(this.currentAnimation.currentFrame);
			}
		}.bind(this);
		
		var stop = function(){
			this.off(update);
		}.bind(this);
		
		parent.on('addon.update', update);
		parent.once('stop', stop);
		this.sprite.setFrame(0);
	};
	
	Animation.prototype.classes = ['stage.object'];
	
	Animation.prototype.add = function(animation){
		if(typeof animation !== 'object'){
			console.error("animation.add Invalida animation argument", animation);
			throw("");
		}
		
		animation.startFrame = this.sprite.frames.length;
		var frames = this.sprite.loadAnimation(animation);
		animation.endFrame = animation.startFrame + frames.length;
		animation.currentFrame = animation.startFrame;
		
		this.animations[animation.name] = animation;
	};
	
	Animation.prototype.play = function(name){
		if(typeof name !== 'string'){
			console.error('animation.play Invalid animation name argument', name);
			throw("");
		}
		
		this.currentAnimation = this.animations[name];
		this.currentAnimation.currentFrame = this.currentAnimation.startFrame;
		console.log("animation.play", this.currentAnimation);
	}
	
	O.register('addon.animation', Animation);
})();
(function(){
	var StagePhysics = function(){

    };
    
    StagePhysics.prototype.classes = ['stage.object'];
	StagePhysics.prototype.attachBody = function(settings){
		settings.x = entity.position.x;
		settings.y = entity.position.y;
		this.ctx.physics.attachBody(entity, settings);
	};
    
	O.register('addon.physics', StagePhysics);
})();
(function(){
	var StageSprite = function(stage, user_settings){
		this.frames = [];
		this.renderer = this.ctx.renderer;
		
		this.currentFrame = null;
		
		this.stage = stage;
		this.ctx = stage.ctx;
		
		var default_settings = {
			x: 0,
			y: 0,
			anchor: {
				x: 0.5, 
				y:0.5
			}
		};
		
		this.settings = O.extend({}, default_settings, user_settings);
		
		//console.log('stage.sprite.construct', this.id, this.settings, this.ctx);
		
		//Create sprite
		this.sprite = this.ctx.renderer.getSprite();
		this.ctx.renderer.add(this.sprite);
		
		this.sprite.anchor.set(this.settings.anchor.x, this.settings.anchor.y);
		this.sprite.position.set(this.settings.x, this.settings.y);
		this.position = this.sprite.position;
		this.scale = this.sprite.scale;
		
		this.sprite.interactive = true;
		this.sprite.buttonMode = true;
    };
    
    StageSprite.prototype.classes = ['stage.object'];
	StageSprite.prototype.loadFrame = function(name, index){
		index = index || this.frames.length;
		var texture = this.renderer.getTexture(name);
		this.frames[index] = texture;
		
		if(!this.frameCurrent){
			this.setFrame(0);	
		}
		
		return this;
	};
	
	StageSprite.prototype.nextFrame = function(){
		this.setFrame(this.currentFrame + 1);
	};
	
	StageSprite.prototype.setFrame = function(index){
		if(this.frames.length === 0){
			return this;
		}
		
		if(index > this.frames.length - 1){
			index = 0;
		}
		
		if(index < 0){
			index = this.frames.length - 1;
		}
		
		this.currentFrame = index;
		//console.log('sprite.setFrame', index, this.sprite);
		this.sprite.setTexture(this.frames[this.currentFrame]);
		
		return this;
	};
    
    StageSprite.prototype.loadAnimation = function(settings){
		var frames = this.renderer.getAnimationTextures(settings);
		console.log("sprite.loadAnimation", frames.length);
		for(var i in frames){
			this.frames.push(frames[i]);
		}
		
		return frames;
    };
    
	O.register('addon.sprite', StageSprite);
})();
(function(){
	
	function uuid(){
		return parseInt(new Date().getTime()).toString(16);
	}
	
	var StageObject = function(stage, settings){
		this.stage = stage;
		this.ctx = stage.ctx;
		
		var default_settings = {
			id: uuid(),
			x: 0,
			y: 0,
			anchor: {
				x: 0.5, 
				y:0.5
			}
		};
		
		this.settings = O.extend({}, default_settings, settings);
		
		var update = function(){
			this.update();
		}.bind(this);
		
		var stop = function(){
			this.ctx.off('update', update);
		}.bind(this);
		
		this.ctx.on('update', update);
		this.ctx.once('stop', stop);
		//console.log('stage.object.construct', this.id, this.settings, this.ctx);
    };
    
    StageObject.prototype.classes = ['o.events'];
    
    StageObject.prototype.update = function(dt){
	    //this.trigger('update', dt);
    };
    
    StageObject.prototype.getID = function(){
	    return this.settings.id;
    }
    
    O.register('stage.object', StageObject);
})();
(function(Engine){
	var State = function(ctx){
		this.stage = ctx.stage;
		this.stage.reset();		
	};
	
	State.prototype.classes = ['engine.component']
	
	State.prototype.update = function(){
	};
	
	O.register('engine.state', State);
})(Engine);