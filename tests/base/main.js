(function(){
	"use strict";

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
		            y: 2
	            },
	            scale: 100
            }
        }

    };

    window.app = O('App');
    app.init(settings);
	
	var stage = app.ctx.stage;
/*
	//Filters
	var texture = PIXI.Texture.fromImage("http://www.goodboydigital.com/pixijs/examples/15/displacement_map.jpg");
	var filterd = new PIXI.DisplacementFilter(texture);
	filterd.scale = {x: 30, y: 30};
	
	var crossHatchFilter = new PIXI.CrossHatchFilter();
	var dotScreenFilter = new PIXI.DotScreenFilter();
	dotScreenFilter.angle = 1;
	dotScreenFilter.scale = 1;
	
	var rgbSplitterFilter = new PIXI.RGBSplitFilter();
	app.ctx.stage.renderObject.filters = [rgbSplitterFilter];

	app.on('engine.tick', function(){
		filterd.offset.x += 1;
		filterd.offset.y += 1;
	});
*/

	window.addEventListener("keydown", function(e) {
	    // space and arrow keys
	    if([32, 37, 38, 39, 40].indexOf(e.keyCode) > -1) {
	        e.preventDefault();
	    }
	}, false);
	

	var circle = function(radius, color){
		var circle = new PIXI.Graphics();
		circle.lineStyle (2 , 0x000000,  1);
		circle.beginFill(color || 0x003399);
		circle.drawCircle(0, 0, radius || 10);
		return circle.generateTexture();
	};
/*
	var hero = O('game.object', {
		id: 'hero',
		position: O('vector2', {x: 100, y: 100}),
	    body: {
	        shape:'circle', 
	        radius: 7, 
	        friction: 1, 
	        density: 3,
	        restitution: 0.5
	    },
	    sprite: {
	        anchor: {
		        x: 0.5,
		        y: 0.5
	        },
	        texture: circle(7, 0xffffff)
	    }
	});
	
	hero.connect(stage);
*/
	//Scene setup
/*
	var scene = O('stage.layer');
	console.log(scene.renderObject);
	scene.renderObject.addChild(new PIXI.Sprite(circle(10, 20, 0xff8746)));
	scene.connect(app.ctx.stage);
*/
	var world = app.ctx.stage.addScene('world', 'game.world');
	var scene1 = app.ctx.stage.addScene('scene1', 'game.scene');
	
/*
	//Actions
	stage.setAlpha(0);
	var Action = O.get('stage.action');
	
	var action = new Action({
			duration: 3,
			ease: Action.easeFunctions.Linear.None
		})
		.on('start', function(){
		
		})
		.on('stop', function(){
			
		})
		.on('update', function(action){
			console.log('update');
			stage.setAlpha(action.currentValue);
		});
	
	console.log('action');
	app.ctx.stage.connect(action);
	
	app.ctx.stage.addAction({
		start_in: 10,
		duration: 10,
		ease: Action.easeFunctions.Linear.None,
		update: function(action){
			//console.log('Update', action);
			stage.setAlpha(1 - action.currentValue);
		},
	});
*/
	
	//Masking

	var mask = new PIXI.Graphics();
	mask.position.set(400, 200);
	mask.lineStyle (2 , 0x000000,  1);
	mask.beginFill(0x003399);
	mask.drawRect(0, 0, 400, 200);
	mask.rotation = 0;

	var angle = 0;

	app.on('engine.tick', function(){
		angle += 0.1;

		mask.clear();
		mask.beginFill(0x8bc5ff, 0.4);
		mask.moveTo(-120 + Math.sin(angle) * 20, -100 + Math.cos(angle)* 20);
		mask.lineTo(120 + Math.cos(angle) * 20, -100 + Math.sin(angle)* 20);
		mask.lineTo(120 + Math.sin(angle) * 20, 100 + Math.cos(angle)* 20);
		mask.lineTo(-120 + Math.cos(angle)* 20, 100 + Math.sin(angle)* 20);
		mask.lineTo(-120 + Math.sin(angle) * 20, -100 + Math.cos(angle)* 20);
		mask.rotation = angle * 0.3;
	});
	
	app.ctx.stage.renderObject.addChild(mask);

	scene1.setMask(mask);
	world.setMask(mask);

/*	setTimeout(function(){
		app.ctx.stage.addScene('scene2', 'game.scene');
	}, 2000);

	setTimeout(function(){
		scene1.setMask();
		world.setMask();
		app.ctx.stage.renderObject.removeChild(mask);
	}, 5000);
*/

/*
	//Input
	var mass = scene1.hero.body.body.GetMass();
	
	var listener = new window.keypress.Listener();
	var my_combos = listener.register_many([
	    {
	        "keys"          : "up",
	        "is_exclusive"  : true,
	        "on_keydown"    : function() {
		        var current_time = new Date().getTime() / 1000;
		        if(this.jumping === undefined || current_time - this.jumping > 1){
			        this.body.applyImpulse({x: 0, y: -mass});
			        this.jumping = current_time;
		        }
	        },
	        "on_keyup"      : function(e) {
	            //this.jumping = undefined;
	        },
	        "this"          : scene1.hero
	    },
	    {
	        "keys"          : "left",
	        "is_exclusive"  : true,
	        "on_keydown"    : function() {
	            this.body.applyImpulse({x: -mass * 0.5, y: 0});
	        },
	        "on_keyup"      : function(e) {
	            //console.log("And now you've released one of the keys.");
	        },
	        "this"          : scene1.hero
	    },
	    {
	        "keys"          : "right",
	        "is_exclusive"  : true,
	        "on_keydown"    : function() {
	            this.body.applyImpulse({x: mass * 0.5, y: 0});
	        },
	        "on_keyup"      : function(e) {
	            //console.log("And now you've released one of the keys.");
	        },
	        "this"          : scene1.hero
	    },
	]);
*/
})();

