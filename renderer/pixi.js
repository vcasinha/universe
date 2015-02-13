(function(PIXI){
	var RendererPixi = function(ctx){
		//console.log('renderer.pixi.construct');
		this.assets = new O();
		
		//init the world
		var start = function(settings){
			console.log('renderer.pixi.start', settings);
			
			this.settings = settings;
			
		    // create an new instance of a pixi stage
		    this.stage = new PIXI.Stage(settings.background || 0x000000, settings.interactive);
		 
		    // create a renderer instance.
		    this.renderer = PIXI.autoDetectRenderer(settings.width, settings.height, settings.renderer);
		}.bind(this);
		
		var update = function(){
			this.renderer.render(this.stage);
		}.bind(this);
		
		var stop = function(){
			ctx.off(update);
		}.bind(this);
		
		ctx.once('start', start);
		ctx.on('update.renderer', update);
		ctx.once('stop', stop);
	};

	RendererPixi.prototype.classes = ['o', 'o.events'];
	
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
		var group = new PIXI.DisplayObjectContainer();
		
		this.ctx.renderer.add(group);
		
		return group;
	}
	
	RendererPixi.prototype.texture = function(name){
		var location = this.get(name).location;
		//console.log("renderer.pixi.texture", name, location);
		return PIXI.Texture.fromImage(location);
	};
	
	RendererPixi.prototype.sprite = function(name){
		//console.log("renderer.pixi.sprite", name);
		var texture = this.texture(name);
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
	
	O.register('engine.renderer.pixi', RendererPixi);
})(PIXI);