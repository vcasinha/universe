(function(){
	var State = function(ctx){
		this.on('start', function(){
            console.log('boot start');
            var assets = [
                {name: 'fly', location: '../images/fly.png', type: 'image'},
                {name: 'something', location: '../maps/map.json', type: 'json'},
            ];
            
            ctx.loader.load(assets, function(){
	            console.log('ctx.loaded');
                ctx.state.start('splash');
            }.bind(this));
        });
	};
	
	State.prototype.classes = ['engine.state'];

	O.register('sm.boot', State);
})();