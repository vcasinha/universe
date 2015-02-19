(function(){
	var Engine = function(settings){
		console.log("engine.construct", settings);
		
        var isRunning = false;
		var isPaused = false;
		this.components = [];

        this.settings = settings = O.extend(true, {}, this.settings_default, settings);

        //console.log("engine.construct", settings);
		
		var ctx = this.ctx = O.instance('engine.context', settings);
		
        c = 0;
        var previous_timestamp;
        var update = function(current_timestamp){
            requestAnimationFrame(update);

			//rateLimit.message('engine.update', "engine.update.step fps", 1/delta);

            previous_timestamp = previous_timestamp || current_timestamp;
            delta = (current_timestamp - previous_timestamp) / 1000;
            previous_timestamp = current_timestamp;
            
            if(isRunning){
				ctx.trigger('engine.tick', delta);
            }
        };
        
        this.ctx.on('start', function(){
	        isRunning = true;
        });
        
        this.ctx.on('engine.pause', function(){
	        isRunning = !isRunning;
        }.bind(this));
        
        this.ctx.on('engine.step', function(){
	        console.log('engine.step');
	        ctx.trigger('engine.tick', 1/60);
        });
        
        this.ctx.on('engine.tick', function(dt){
	       ctx.trigger('engine.update', dt); 
        });
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
	};

	O.register('engine', Engine);

	window.Engine = Engine;
})();

