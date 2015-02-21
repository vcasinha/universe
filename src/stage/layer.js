(function(){
    var default_settings = {

    };

    var Layer = function(){
	    O.exec('stage.object', this);
	    
	    var self = this;
	    this.type = 'Layer';
	    	    
        console.log('layer.construct');
        
        this.on('connected', function(){
			var debugShape = new PIXI.Graphics();
			debugShape.lineStyle (2 , 0x000000,  1);
			debugShape.beginFill(0x003399);
			debugShape.drawCircle(0, 0, 10);
			debugShape.position.set(100, 100);
			
			this.renderObject.addChild(debugShape);
			
	        this.ctx.stage.on('stage.tick', function(delta){
				self.trigger('layer.tick');
			});
        });
    };

    Layer.prototype.init = function(settings){
		
		this.settings = O.extend({}, default_settings, settings);

    };

    O.create(Layer, 'stage.object');

    O.set('stage.layer', Layer);
})();