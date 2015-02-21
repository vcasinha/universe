(function(){
    var default_settings = {

    };

    var RendererPIXI = function(){
        console.log('renderer.pixi.construct');
        
        O.get('universe.unit').apply(this);
        
        this.id = 'renderer';
        this.fps = new PIXI.Text("FPS 0", {font:"12px Monaco", fill:"#ffffff"});
        this.fps.position.set(0, 0);
        this.counter = 0;
        this.timer = 0;
        
        this.renderObject = new PIXI.DisplayObjectContainer();
    };

    RendererPIXI.prototype.init = function(settings){
		console.log('renderer.pixi init start', settings);
		
		var self = this;
		
		this.engine = this.findByID('engine');
		this.engine.on('engine.tick', function(delta){
			self.render(delta);
		});
		// create an new instance of a pixi stage
		this.stage = new PIXI.Stage(settings.background || 0x000000);
	
		// create a renderer instance.
		this.renderer = PIXI.autoDetectRenderer(settings.width, settings.height, settings.options);
		console.log('renderer.pixi init done', this.renderer);

		//
		this.stage.addChild(this.fps);
		this.stage.addChild(this.renderObject);
		
		this.physics_debug = new PIXI.DisplayObjectContainer();
		this.physics_debug.alpha = 0.1;
		//this.stage.addChild(this.physics_debug);
		
    };

	RendererPIXI.prototype.render = function(delta){
		this.timer += delta;
		this.counter++;
		if(this.timer >= 1){
			this.timer = 0;
			this.fps.setText('FPS ' + this.counter);
			this.counter = 0;
		}
		
		this.renderer.render(this.stage);	
	};

    O.create(RendererPIXI, 'universe.unit');

    O.set('universe.renderer.pixi', RendererPIXI);
})();