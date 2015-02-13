(function(){
	function uuid(){
		return parseInt(Math.random() * 999999999).toString(16) + parseInt(Math.random() * 999999999).toString(16);
	}
	
	var Entity = function(stage, settings){
		var default_settings = {
			name: uuid(),
			stage: stage,
			paused: false,
			stage: stage,
			ctx: stage.ctx
		};
		
		O.extend(this, default_settings, settings);
		
        var update = function(){
            if(!this.paused){
	            this.update();
            }
        }.bind(this);

        var stop = function(){
	        stage.off('update', update);
        }.bind(this);

		stage.on('update', update);
		stage.once('stop', stop);
    };
    
    Entity.prototype.classes = [];
    
	O.register('stage.entity', Entity);
})();