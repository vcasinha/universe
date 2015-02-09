(function(Oo, PIXI){
	var DisplayManager = function(ctx){
		console.log('engine.display boot', arguments);
		var that = this;
		var renderer = null;
		var stage = null;
		
		//init the world
		function init(settings){
			console.log('display.init', settings);
			
			this.settings = settings;
			
		    // create an new instance of a pixi stage
		    this.stage = stage = new PIXI.Stage(settings.background || 0x000000, true);
		 
		    // create a renderer instance.
		    this.renderer = renderer = PIXI.autoDetectRenderer(settings.width, settings.height);
		    if(settings.element === undefined){
			    settings.element = $('body');
		    }
		    
		    requestAnimFrame(update.bind(this));
		}
		
		function update(){
			var time = (new Date()).getTime();
			requestAnimFrame(update.bind(this));

			ctx.trigger('display.update', [time]);
			
			renderer.render(stage);
		}
		
		ctx.on('init', init, this);
	};
	
	DisplayManager.prototype.resize = function(width, height){
	    this.width = width;
	    this.height = height;
	    
	    console.log("display.resize", this.width, this.height);
	    
	    if(this.renderer){
		    this.renderer.resize(this.width, this.height, null, true, true);
		}
	};
	
	DisplayManager.prototype.requestFullScreen = function(){
		console.log("display.requestFullScreen", this);
		if(renderer.view.webkitRequestFullScreen) {
			el.webkitRequestFullScreen();
		}
		else{
			renderer.view.mozRequestFullScreen();
		}
	};
	
	DisplayManager.prototype.add = function(child){
		return stage.addChild(child);
	};
	
	window.Engine.DisplayManager = DisplayManager;
})(Oo, PIXI);