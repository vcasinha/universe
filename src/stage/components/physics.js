(function(){
	var StagePhysics = function(){

    };
    
    StagePhysics.prototype.classes = ['stage.object'];
	StagePhysics.prototype.attachBody = function(settings){
		settings.x = entity.position.x;
		settings.y = entity.position.y;
		this.ctx.physics.attachBody(entity, settings);
	};
    
	O.register('addon.physics', StagePhysics);
})();