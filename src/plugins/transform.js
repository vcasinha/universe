(function(){
	var Transform = function(){
		this.$parent.apply(this, arguments);
		//console.log('transform.construct');
		this.anchor = O('vector2', this.settings.anchor);
		this.position = O('vector2', this.settings.position);
		this.rotation = this.settings.rotation;
		this.velocity = O('vector2');
		this.scale = O('vector2', {x: 1, y: 1});
	};
	
	Transform.prototype.stop = function(){
		this.anchor = undefined;
		this.position = undefined;
		this.rotation = undefined;
		this.velocity = undefined;
		this.scale = undefined;
	};
	
	Transform.prototype.defaultSettings = {
		rotation: 0,
	};
	
	O.create(Transform, 'plugin');
	O.set('plugin.transform', Transform);
})();