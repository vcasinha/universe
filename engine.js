(function(){
	var Engine = function(settings){
		this.paused = false;
		
		this.ctx = O.instance('engine.context');
		this.settings = settings;
		
		console.log("engine.construct", settings);
		this.timePrevious = new Date().getTime();
		
		this.updateCallback = this.update.bind(this);
	};

	Engine.prototype.init = function(){
		console.log("engine.init", this.settings);
		var default_components = {
			loader: 'engine.loader',
			renderer: 'engine.renderer.pixi',
			audio: 'engine.audio.manager',
			stage: 'engine.stage',
			state: 'engine.state.machine'
		};
		
		var components = O.extend({}, default_components, this.settings.components);
		
		for(var i in components){
			this.addComponent(i, components[i]);
		}
		
		console.log("engine.init.start");
		this.ctx.trigger('start', this.settings);
	};

	Engine.prototype.addComponent = function(name, object_name){
		console.log("engine.init.addComponent", name);
		var component = O.instance(object_name, this.ctx);
		this.ctx.set(name, component)
	}

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
		requestAnimationFrame(this.updateCallback);
		this.ctx.state.start('boot');
		return this;
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

(function() {
    var lastTime = 0;
    var vendors = ['webkit', 'moz'];
    for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
        window.cancelAnimationFrame =
          window[vendors[x]+'CancelAnimationFrame'] || window[vendors[x]+'CancelRequestAnimationFrame'];
    }

    if (!window.requestAnimationFrame)
        window.requestAnimationFrame = function(callback, element) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
            var id = window.setTimeout(function() { callback(currTime + timeToCall); },
              timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };

    if (!window.cancelAnimationFrame)
        window.cancelAnimationFrame = function(id) {
            clearTimeout(id);
        };
}());