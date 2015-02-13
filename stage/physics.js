(function(){
	var Physics = function(stage, settings){

    };
    
    Physics.prototype.classes = [];
	Physics.prototype.attachBody = function(settings){
		settings.x = entity.position.x;
		settings.y = entity.position.y;
		this.ctx.physics.attachBody(entity, settings);
	};
    
	O.register('engine.entity', Entity);
})();