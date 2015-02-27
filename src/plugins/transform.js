(function(){
	var Transform = function(){
		this.id = this.id || 'transform.plugin';
		this.$parent.apply(this, arguments);
		
		//console.log('transform.construct');
		this.anchor = O('vector2', this.settings.anchor);
		this.position = O('vector2', this.settings.position);
		this.rotation = this.settings.rotation;
		this.velocity = O('vector2');
		this.scale = O('vector2', this.settings.scale);
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
		scale: {
			x: 1,
			y: 1
		}
	};
	
	O.create(Transform, 'plugin');
	O.set('plugin.transform', Transform);
})();