(function(){
	var Sprite = function(){
		this.$parent.apply(this, arguments);
		//console.log("sprite.construct", this.entity.transform);
		
		this.sprite = new PIXI.Sprite(this.settings.texture);
		this.sprite.anchor = this.transform.anchor;
		this.sprite.position = this.transform.position;
		this.sprite.rotation = this.transform.rotation;
		this.sprite.scale = this.transform.scale;
		this.entity.renderObject.addChild(this.sprite);
	};
	
	Sprite.prototype.stop = function(){
		this.entity.renderObject.removeChild(this.sprite);
		this.sprite.anchor = undefined;
		this.sprite.position = undefined;
		this.sprite.rotation = undefined;
		this.sprite.scale = undefined;
		this.sprite = undefined;
	};
	
	O.create(Sprite, 'plugin');
	O.set('plugin.sprite', Sprite);
})();