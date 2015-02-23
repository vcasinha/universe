(function(){
	"use strict";
	
    var default_settings = {

    };

    var Scene = function(){
	    O.exec('stage.layer', this);
	    var self = this;
	    this.type = 'Scene';
	    
        console.log('Scene.construct');
        
        this.on('connected', function(){
			var circle = function(radius, color){
				var circle = new PIXI.Graphics();
				circle.lineStyle (2 , 0x000000,  1);
				circle.beginFill(color || 0x003399);
				circle.drawCircle(0, 0, radius || 10);
				return circle.generateTexture();
			};
			
			var box = function(width, height, color){
				var graphic = new PIXI.Graphics();
				graphic.lineStyle (2 , 0x000000,  1);
				graphic.beginFill(color || 0x003399);
				graphic.drawRect(0, 0, width, height);
				return graphic.generateTexture();
			};
			
			//Box
			var wall = O('game.object', {
				id: 'box1',
				position:  O('vector2', {x: 200, y: 200}),
		        body: {
			        type: 'static',
		            shape:'box', 
		            friction: 0.8, 
		            density: 5,
		            restitution: 0.3,
		            width: 100,
		            height: 100
		        },
		        sprite: {
			        anchor: {
				        x: 0.5,
				        y: 0.5
			        },
			        texture: box(100, 100, 0x765434)
		        }
			});
			wall.connect(this);
			
			var wall = O('game.object', {
				id: 'box2',
				position:  O('vector2', {x: 500, y: 250}),
		        body: {
			        type: 'static',
		            shape:'box', 
		            friction: 0.8, 
		            density: 5,
		            restitution: 0.3,
		            width: 100,
		            height: 100
		        },
		        sprite: {
			        anchor: {
				        x: 0.5,
				        y: 0.5
			        },
			        texture: box(100, 100, 0x765434)
		        }
			});
			wall.connect(this);
			
			//Top
			var wall = O('game.object', {
				id: 'top',
				position: O('vector2', {x: app.width/2, y: 0 }),
		        body: {
			        type: 'static',
		            shape:'box', 
		            friction: 0.8, 
		            density: 5,
		            restitution: 0.3,
		            width: app.width,
		            height: 5
		        }
			});
			wall.connect(this);
			
			//Bottom
			var wall = O('game.object', {
				id: 'bottom',
				position: O('vector2', {x: app.width/2, y: 400 }),
		        body: {
			        type: 'static',
		            shape:'box', 
		            friction: 0.8, 
		            density: 5,
		            restitution: 0.3,
		            width: app.width,
		            height: 2
		        }
			});
			wall.connect(this);
			
			var wall = O('game.object', {
				position: O('vector2', {x: 0, y: app.height/2 }),
		        body: {
			        type: 'static',
		            shape:'box', 
		            friction: 0.8, 
		            density: 5,
		            restitution: 0.7,
		            width:  2,
		            height: app.height
		        }
			});
			wall.connect(this);
			
			var wall = O('game.object', {
				position: O('vector2', {x: app.width, y: app.height/2 }),
		        body: {
			        type: 'static',
		            shape:'box', 
		            friction: 0.8, 
		            density: 5,
		            restitution: 0.7,
		            width: 2,
		            height: app.height
		        }
			});
			wall.connect(this);			
        });
    };

    Scene.prototype.init = function(settings){
		
		this.settings = O.extend({}, default_settings, settings);

    };

    O.create(Scene, 'stage.layer');

    O.set('game.world', Scene);
})();