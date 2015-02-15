		// create an array to store the textures
		var explosionTextures = [];
		
		for (var i=0; i < 26; i++) 
		{
		 	var texture = PIXI.Texture.fromFrame("Explosion_Sequence_A " + (i+1) + ".png");
		 	explosionTextures.push(texture);
		};
		
		// create a texture from an image path
		// add a bunch of aliens
		for (var i = 0; i < 50; i++) 
		{
			// create an explosion MovieClip
			var explosion = new PIXI.MovieClip(explosionTextures);
			
		
			explosion.position.x = Math.random() * 800;
			explosion.position.y = Math.random() * 600;
			explosion.anchor.x = 0.5;
			explosion.anchor.y = 0.5;
			
			explosion.rotation = Math.random() * Math.PI;
			explosion.scale.x = explosion.scale.y = 0.75 + Math.random() * 0.5
			
			explosion.gotoAndPlay(Math.random() * 27);
			
			stage.addChild(explosion);
		}
		
(function(){
	var Animation = function(ctx, settings){
		var default_settings = {

		};
		
		this.settings = O.extend({}, default_settings, settings);
		var texture = ctx.renderer.getTexture(this.settings.name);

    };
    
    Animation.prototype.classes = [];
	Animation.prototype.show = function(){};
    
	O.register('engine.animation', Animation);
})();