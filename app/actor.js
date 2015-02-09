(function(Engine){
	Engine.Actor = Oo.createClass(function(ctx){
		console.log("actor.construct");
		
		var sprite = ctx.display.sprite('texture');
		sprite.anchor.set(0.5, 0.5);
		sprite.position.set(100, 100);
		
		this.ctx.display.add(sprite);
		console.log("actor.construct.end");
    }, 
    {
        update: function(){
	        console.log("Actor update");
        }
    },
    Engine.Entity);
})(Engine);