(function(Engine){
	Engine.Entity = function(ctx){
		OO.call(this);
	};
	
	Engine.Entity.prototype = Object.create(OO.prototype);
	Engine.Entity.prototype.constructor = Engine.Entity;
})(Engine);