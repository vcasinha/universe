(function(){
    var Actor = function(stage){

    };

    Actor.prototype.classes = ['engine.entity'];
    Actor.prototype.update = function(stage, dt){
	    this.skyd.alpha = Math.abs(Math.sin(-stage.angle / 2 + Math.PI/10));
	    this.skyn.alpha = Math.abs(Math.cos(-stage.angle / 2 + Math.PI/10));
	    
	    var w = stage.width() / 2;
	    var h = stage.height() / 2;
	    
        this.sun.position.x = w + Math.sin(-stage.angle) * w;
        this.sun.position.y = h * 2 + Math.cos(-stage.angle) * (h * 1.5);
        this.sun.tint = color_lerp(0xffffee, 0xff9b15, stage.angle / 2 - Math.PI);
        
        this.moon.position.x = w + Math.sin(-stage.angle + Math.PI) * w;
        this.moon.position.y = h * 2 + Math.cos(-stage.angle + Math.PI) * (h * 1.5);
        
        this.mountains.tint = color_lerp(0x332211, 0x663931, Math.PI / 2 + stage.angle / 2);
        
        this.shadeL.tint = color_lerp(0x3e2416, 0x8f974a, Math.PI / 2 + stage.angle / 2);
        this.shadeR.tint = color_lerp(0x3e2416, 0x8f974a, Math.PI / 3 + stage.angle / 2);
        
    };

	O.register('app.actor', Actor);
})();