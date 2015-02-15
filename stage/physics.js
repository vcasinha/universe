(function(){
	var StagePhysics = function(stage, settings){

    };
    
    StagePhysics.prototype.classes = [];
	StagePhysics.prototype.attachBody = function(settings){
		settings.x = entity.position.x;
		settings.y = entity.position.y;
		this.ctx.physics.attachBody(entity, settings);
	};
    
	O.register('stage.physics', StagePhysics);
})();