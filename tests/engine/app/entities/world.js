(function(){
	var Entity = function(parent, user_settings){
		this.physics = this.ctx.physics;
		//console.log("Bird.construct", this.position, this.settings);
		//console.log('bird', this);
		var bodies = [
			{
		        position: {
			        x: 0,
			        y: this.stage.height()
		        },
		        width: this.stage.width(),
		        height: 1
        	},
			{
		        position: {
			        x: 0,
			        y: 0
		        },
		        width: this.stage.width(),
		        height: 1
        	},
			{
		        position: {
			        x: 0,
			        y: 0
		        },
		        width: 1,
		        height: this.stage.height()
        	},
			{
		        position: {
			        x: this.stage.width(),
			        y: 0
		        },
		        width: 1,
		        height: this.stage.height()
        	}
		];
		
        var walls = [];
        
        for(var i = 0;i < bodies.length;i++){
	        
	        var body_settings = O.extend({}, this.settings.physics, bodies[i]);
	        body_settings.data = this;
	        var body = this.physics.createBody(body_settings);
	        walls.push(body);
        }
	};

	Entity.prototype.classes = ['stage.entity'];

	Entity.prototype.defaultSettings = {
        position:{
            x: 0,
            y: 0
        },
        sprite: {
            name: 'fly',
        },
        physics:{
            type: 'static',
            shape:'box',
            friction: 0.2, 
            density: 1,
            restitution: 0.6
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
	
	O.register('game.world', Entity);
})();
