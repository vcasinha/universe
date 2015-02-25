(function(){
    "use strict";
    
    var default_settings = {

    };

    var RendererPIXI = function(){
	    this.$parent.apply(this, arguments);
        console.log('renderer.pixi.construct');
        
        this.updateCost = 0;
        this.fpsLabel = new PIXI.Text("FPS 0", {font:"12px Monaco", fill:"#000000"});
        this.fpsLabel.position.set(0, 0);
        this.fpsCounter = 0;
        this.timer = 0;
        
        this.renderObject = new PIXI.DisplayObjectContainer();
        this.renderObject.alpha = 1;
		this.physics = new PIXI.DisplayObjectContainer();
		this.physics.alpha = 1;
    };

    RendererPIXI.prototype.init = function(){
		console.log('renderer.pixi init start', this.settings);
		
		var self = this;
		
		// create an new instance of a pixi stage
		this.stage = new PIXI.Stage(this.settings.background || 0x000000);
	
		// create a renderer instance.
		this.renderer = PIXI.autoDetectRenderer(this.settings.width, this.settings.height, this.settings.options);
		
		//
		this.stage.addChild(this.renderObject);
		this.stage.addChild(this.physics);
		this.stage.addChild(this.fpsLabel);
		console.log('renderer.pixi init done', this.renderer);
    };

	RendererPIXI.prototype.update = function(delta){
		this.timer += delta;
		this.fpsCounter++;

		if(this.timer >= 1){
			this.timer = 0;
			this.fps = this.fpsCounter;
			this.fpsLabel.setText('FPS ' + this.fps + ' ' + this.updateCost);
			this.fpsCounter = 0;
		}
		
		this.renderer.render(this.stage);	
	};
	
	RendererPIXI.prototype.addChild = function(child){
		this.renderObject.addChild(child);
	};

	RendererPIXI.prototype.removeChild = function(child){
		this.renderObject.removeChild(child);
	};

    O.create(RendererPIXI, 'component');

    O.set('renderer.pixi', RendererPIXI);
})();