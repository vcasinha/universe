(function(){
	var State = function(){
		this.stage.angle = 0;

        this.on('start', function(){
	        var tilesmap_settings = {
		        width: 20,
		        height: 20
	        };
	        
	        console.log('splash.start', '**********');
	        
	        O.i('game.world', this.stage, {id: 'world'});
	        
	        //var tilesmap = O.i('stage.tilesmap', this.stage, tilesmap_settings)
	        
            var bird_settings = {
                id: 'bird',
                position: {
                    x: 100,
                    y: 100
                }
            };
            
            for(var i = 0;i < 1;i++){
                bird_settings.position = {
                    x: Math.random() * this.stage.width(),
                    y: Math.random() * this.stage.height()
                };
                
                bird_settings.id = 'bird_' + i;
                //console.log("add", bird_settings.id);
                //console.log("bird.id", bird_settings.id);
                var bird = O.i('game.bird', this.stage, bird_settings);
            }
        }.bind(this));

		this.on('update', function(dt){
			//this.stage.angle += dt;
		});
/*
        this.on('update', function(dt){
            var bird = this.stage.get('bird_0');
            if(bird.position.y > 500){
                bird.trigger('position.update', O.i('vec2', {x: 100, y: 0}));
            }
        }.bind(this));
*/
	};
	
	State.prototype.classes = ['engine.state'];
	
	O.register('sm.splash', State);
})();