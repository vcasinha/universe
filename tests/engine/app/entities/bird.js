(function(){
	var Bird = function(parent, user_settings){
		//console.log("Bird.construct", this.position, this.settings);
		//console.log('bird', this);

		this.sprite = O.instance('addon.sprite', this, this.settings.sprite);
        this.animation = O.instance('addon.animation', this, this.settings.animation, this.sprite);
        this.rigidBody = O.instance('addon.physics', this, this.settings.physics);
        
        this.sprite.onClick(function(){
	        this.rigidBody.applyImpulse({x:0, y: -0.5});
        }.bind(this));
        
        this.on('collision', function(){
	        //this.rigidBody.applyForce({x:0, y: -0.01});
        });
        
        this.trigger('position.update', this.settings.position);

        this.ctx.on('stage.update', function(dt){
	        if(this.velocity.x === 0 && this.velocity.y === 0){
				this.animation.pause();
	        }
	        else{
		        this.animation.play();
	        }
        }.bind(this));
	};

	Bird.prototype.classes = ['stage.entity'];

	Bird.prototype.defaultSettings = {
        position:{
            x: 0,
            y: 0
        },
        sprite: {
            name: 'fly',
        },
        physics:{
            body: {
                shape:'circle', 
                radius: 10, 
                friction: 0.5, 
                density: 5,
                restitution: 0.7
            }
        },
        animation:{
	        start: 'fly',
            load: [
                {
                   name: 'fly',
                    x: 0,
                    y: 0,
                    width: 32,
                    height: 32,
                    fps: 15,
                    frameCount: 15
                }
            ]
        }
    };
	
	O.register('game.bird', Bird);
})();
