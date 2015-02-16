(function(){
	var Engine = function(settings){
        this.isRunning = false;
        this.stepping = false;
		this.isPaused = false;
		this.components = [];

        this.settings = settings = O.extend(true, {}, this.settings_default, settings);

        //console.log("engine.construct", settings);
		
		this.ctx = O.instance('engine.context', settings);
		console.log("engine.construct Initialize context");


        var time_previous = time_current = new Date().getTime();
        var time_delta = 0;
        var update = function(dt, step){
            requestAnimationFrame(update);
            if(this.isRunning || step){
                console.log("Running");
                time_current = new Date().getTime();
                time_delta = (time_current - time_previous) / 1000;
                
				this.ctx.trigger('update', time_delta, time_current);
                
                time_previous = time_current;
            }

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
	};

	O.register('engine', Engine);

	window.Engine = Engine;
})();

