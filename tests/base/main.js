(function(){
	String.prototype.repeat = function( num )
	{
	    return new Array( num + 1 ).join( this );
	}
	
    var settings = {
        context:{
            renderer: {
                component: 'universe.renderer.pixi',
                width: 800,
                height: 400,
                background: 0x000066,
                options: {
	                antialias: true,
                }
            },
            stage: {
	            component: 'universe.stage',
            },
            physics: {
	            component: 'universe.physics.box2d',
	            gravity: {
		            x: 0,
		            y: 0.5
	            },
	            scale: 300
            }
        }

    };

    window.app = O('App');
    app.init(settings);
	
	
	var texture = PIXI.Texture.fromImage("http://www.goodboydigital.com/pixijs/examples/15/displacement_map.jpg");
	var filterd = new PIXI.DisplacementFilter(texture);
	filterd.scale = {x: 30, y: 30};
	
	//app.ctx.stage.renderObject.filters = [filterd];

	
	app.on('engine.tick', function(){
		filterd.offset.x += 1;
		filterd.offset.y += 1;
	});
	
	window.scene1 = O('game.scene');
	scene1.connect(app.ctx.stage);

	window.scene2 = O('game.scene');
	scene2.connect(app.ctx.stage);
	
})();
