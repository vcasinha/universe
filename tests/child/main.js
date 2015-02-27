(function(){
	"use strict";

	String.prototype.repeat = function( num )
	{
	    return new Array( num + 1 ).join( this );
	}
	
	O.set('circle', function(radius, color){
		var circle = new PIXI.Graphics();
		//circle.lineStyle (1 , 0xffffff,  1);
		circle.beginFill(color || 0x003399);
		circle.drawCircle(0, 0, radius || 10);
		return circle.generateTexture();
	});
	
	O.set('box', function(width, height, color){
		var graphic = new PIXI.Graphics();
		graphic.lineStyle (1 , 0x000000,  1);
		graphic.beginFill(color || 0xff0000);
		graphic.drawRect(0, 0, width, height);
		return graphic.generateTexture();
	});
	
	Number.prototype.limit = function(min, max){
		if(min === undefined){
			min = 0;
		}
		
		if(max === undefined){
			max = 1;
		}
		
		if(this < min){
			return min;
		}
		else if(this > max){
			return max;
		}
		
		return this;
	}
	
    var settings = {
	    container: '#container',
        components:{
            renderer: {
                component: 'renderer.pixi',
                width: 800,
                height: 400,
                background: 0xffffff,
                options: {
	                antialias: true,
                }
            },

            stage: {
	            component: 'stage',
            },
            physics: {
	            component: 'physics.box2d',
	            gravity: {
		            x: 0,
		            y: 900
	            },
	            scale: 100
            },
            assets: {
	            component: 'assets',
            },
            audio: {
	            component: 'component.audio',
            },
            input: {
	            component: 'component.input'
            }
        }
    };
    
    window.engine = O('engine', settings);
    engine.init();
    engine.start();
    
    var scene_settings = {
	    
    };
    
    engine.components.stage.addScene('preload', O('scene.preload'));
	engine.components.stage.addScene('main', O('scene.main'));
	engine.components.stage.setScene('preload');
})();

