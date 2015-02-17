(function(){
	var Bird = function(parent, user_settings){
		//console.log("Bird.construct", this.position, this.settings);

        this.sprite = O.instance('addon.sprite', this, this.settings.sprite);
        this.sprite.setFrame(0);

        this.animation = O.instance('addon.animation', this, this.settings.animation, this.sprite);
        for(var i in this.animations){
            this.animation.add(this.animations[i]);
        }
        this.animation.play('fly');

        this.trigger('position.update', this.settings.position);

        //this.rigidBody = O.instance('addon.physics', this, this.settings.physics, this.stage);

	};

	Bird.prototype.classes = ['stage.object'];

	Bird.prototype.defaultSettings = {
        position:{
            x: 0,
            y: 0
        },
        sprite: {
            name: 'fly',
        },
        physics:{
        id: 'body',
            body: {
                shape:'circle', 
                radius: 32, 
                friction: 0.2, 
                density: 2 + Math.random() * 10,
                restitution: 0.2
            }
        },
        animation:{
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
