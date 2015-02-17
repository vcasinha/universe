(function(){
	var State = function(){
		this.stage.angle = 0;

        this.on('start', function(){
            var bird_settings = {
                id: 'bird',
                position: {
                    x: 100,
                    y: 100
                }
            };
            //var bird = O.instance('game.bird', this.stage, {});
            for(var i = 0;i < 1000;i++){
                bird_settings.position = {
                    x: Math.random() * 800,
                    y: Math.random() * 600
                };
                bird_settings.id = 'bird_' + i;
                //console.log("bird.id", bird_settings.id);
                var bird = O.i('game.bird', this.stage, bird_settings);
                this.stage.add(bird);
            }
        }.bind(this));

        this.on('update', function(dt){

        }.bind(this));
	};
	
	State.prototype.classes = ['engine.state'];
	
	State.prototype.start = function(ctx){
        var bird = this.stage.get('bird');
	};
	
	O.register('sm.splash', State);
})();