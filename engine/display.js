(function(PIXI){
	var DisplayManager = function(ctx){
		console.log('engine.display boot', arguments);
		var that = this;
		var renderer = null;
		var stage = null;
		this.assets = new O();
		
		//init the world
		function init(settings){
			console.log('display.init', settings);
			
			this.settings = settings;
			
		    // create an new instance of a pixi stage
		    this.stage = new PIXI.Stage(settings.background || 0x000000, settings.interactive);
		 
		    // create a renderer instance.
		    this.renderer = PIXI.autoDetectRenderer(settings.width, settings.height);
		    
		    requestAnimFrame(update.bind(this));
		}
		
		function update(){
			var time = (new Date()).getTime();
			requestAnimFrame(update.bind(this));

			ctx.trigger('display.update', [time]);
			this.renderer.render(this.stage);
		}
		
		ctx.on('init', init, this);
	};

	var prototype = {};
	prototype.resize = function(width, height){
	    this.width = width;
	    this.height = height;
	    
	    console.log("display.resize", this.width, this.height);
	    
	    if(this.renderer){
		    this.renderer.resize(this.width, this.height, null, true, true);
		}
	};
	
	prototype.texture = function(name){
		var location = this.get(name).location;
		console.log("display.texture", name, location);
		return PIXI.Texture.fromImage(location);
	};
	
	prototype.sprite = function(name){
		var texture = this.texture(name);
		return new PIXI.Sprite(texture);
	}
	
	prototype.requestFullScreen = function(){
		console.log("display.requestFullScreen", this);
		if(renderer.view.webkitRequestFullScreen) {
			el.webkitRequestFullScreen();
		}
		else{
			renderer.view.mozRequestFullScreen();
		}
	};
	
	prototype.add = function(child){
		return this.stage.addChild(child);
	};
	
	O.register('engine.display.manager', DisplayManager, prototype, ['o', 'engine.object'])
})(PIXI);