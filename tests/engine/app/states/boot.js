(function(){
	var State = function(ctx){
		this.on('start', function(){
            console.log('boot start');
            var assets = [
                {name: 'fly', location: '../images/fly.png', type: 'image'},
            ];
            
            ctx.loader.load(assets, function(){
                ctx.state.start('splash');
            }.bind(this));
        });
	};
	
	State.prototype.classes = ['engine.state'];

	O.register('sm.boot', State);
})();