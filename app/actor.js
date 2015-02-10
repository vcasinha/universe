(function(){
    var Actor = function(ctx){
        console.log("actor.construct");
        
        this.sprite = ctx.display.sprite('texture');
        this.sprite.anchor.set(0.5, 0.5);
        this.sprite.position.set(100, 100);
        this.sprite.click = function(data){
            console.log("Click", data);
        };
        
        ctx.display.add(this.sprite);
        console.log("actor.construct.end");

        this.update = function(){
            this.sprite.position.x += 1;
        }
    };

    Actor.prototype.classes = ['engine.entity'];

	O.register('app.actor', Actor);
})();