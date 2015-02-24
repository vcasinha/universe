(function(){
	"use strict";
	
    var default_settings = {

    };

    var Scene = function(){
	    this.id = 'game.scene';
	    this.type = 'scene';
	    
	    O.exec('stage.layer', this);
	    
	    var self = this;
	    
	    
        //console.log('Scene.construct');

        this.on('connected', function(){
	        console.log('Scene connect');
	        
	        //Textures
			var circle = function(radius, color){
				var circle = new PIXI.Graphics();
				circle.lineStyle (1 , 0x000000,  1);
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

			//Hero
			this.hero = O('game.object', {
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
				
			this.hero.connect(this);
				
			for(var i=0;i < 30;i++){
				window.bird = O('game.object', {
					position: O('vector2', {x: Math.random() * 400, y: Math.random() * 400 }),
			        body: {
			            shape:'circle', 
			            radius: 10, 
			            friction: 0.5, 
			            density: 3,
			            restitution: 0.5
			        },
			        sprite: {
				        anchor: {
					        x: 0.5,
					        y: 0.5
				        },
				        texture: circle(10, 0xeecc44)
			        }
				});
				bird.connect(this);
			}
		
			var text = new PIXI.Text("Testing this out!", {font:"12px Monaco", fill:"red"}).generateTexture();
			
			var t = O('game.object', {
				position: O('vector2', {x: 100 + Math.random() * 600, y: 20 + Math.random() * 300 }),
		    	 body: {
		            shape:'box', 
		            friction: 0.2, 
		            density: 5,
		            restitution: 0.3,
		            width: 100,
		            height: 20
		        },
		        sprite: {
			        anchor: {
				        x: 0.5,
				        y: 0.5
			        },
			        texture: box(100, 20,0xffffff)
		        }
			});
			t.connect(this);
        });
    };

    O.create(Scene, 'stage.layer');

    O.set('game.scene', Scene);
})();