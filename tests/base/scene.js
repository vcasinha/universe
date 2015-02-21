(function(){
    var default_settings = {

    };

    var Scene = function(){
	    O.exec('stage.layer', this);
	    var self = this;
	    this.type = 'Scene';
	    
	    
	    
        console.log('layer.construct');
        
        this.on('connected', function(){

			//Box
			var wall = O('game.object', {
				position: {
					x: 200, 
					y: 200
				},
		        body: {
			        type: 'static',
		            shape:'box', 
		            friction: 0.5, 
		            density: 5,
		            restitution: 0.3,
		            width: 100,
		            height: 100
		        }
			});
			wall.connect(this);
			
			var wall = O('game.object', {
				position: {
					x: 500, 
					y: 250
				},
		        body: {
			        type: 'static',
		            shape:'box', 
		            friction: 0.5, 
		            density: 5,
		            restitution: 0.3,
		            width: 100,
		            height: 100
		        }
			});
			wall.connect(this);
			
			//Top
			var wall = O('game.object', {
				position: O('vector2', {x: app.width/2, y: 0 }),
		        body: {
			        type: 'static',
		            shape:'box', 
		            friction: 0.5, 
		            density: 5,
		            restitution: 0.3,
		            width: app.width,
		            height: 5
		        }
			});
			wall.connect(this);
			
			//Bottom
			var wall = O('game.object', {
				position: O('vector2', {x: app.width/2, y: 400 }),
		        body: {
			        type: 'static',
		            shape:'box', 
		            friction: 0.5, 
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
		            friction: 0.5, 
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
		            friction: 0.5, 
		            density: 5,
		            restitution: 0.7,
		            width: 2,
		            height: app.height
		        }
			});
			wall.connect(this);
			
			var circle = new PIXI.Graphics();
			circle.lineStyle (2 , 0x000000,  1);
			circle.beginFill(0x003399);
			circle.drawCircle(0, 0, 10);
			
			for(var i=0;i < 10;i++){
				window.bird = O('game.object', {
					position: O('vector2', {x: Math.random() * 400, y: Math.random() * 400 }),
			        body: {
			            shape:'circle', 
			            radius: 10, 
			            friction: 0.5, 
			            density: 5,
			            restitution: 0.5
			        },
			        sprite: {
				        anchor: {
					        x: 0.5,
					        y: 0.5
				        },
				        texture: circle.generateTexture()
			        }
				});
				bird.connect(this);
			}
	
			var box = new PIXI.Text("Testing this out!", {font:"12px Monaco", fill:"red"});
			
			var box = new PIXI.Graphics();
			box.lineStyle (2 , 0x000000,  1);
			box.beginFill(0x003399);
			box.drawRect(0, 0, 80, 15);
		
			
			var t = O('game.object', {
				position: O('vector2', {x: 250, y:60 }),
		    	 body: {
		            shape:'box', 
		            friction: 0.5, 
		            density: 5,
		            restitution: 0.5,
		            width: box.width,
		            height: box.height
		        },
		        sprite: {
			        anchor: {
				        x: 0.5,
				        y: 0.5
			        },
			        texture: box.generateTexture()
		        }
			});
			t.connect(this);


        });
    };

    Scene.prototype.init = function(settings){
		
		this.settings = O.extend({}, default_settings, settings);

    };

    O.create(Scene, 'stage.layer');

    O.set('game.scene', Scene);
})();