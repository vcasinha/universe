(function(){
	var Logic = function(){
		this.$parent.apply(this, arguments);
		console.log("logic.construct", arguments);
	};
	
	Logic.prototype.exec = function(){
		var args = Array.prototype.slice.apply(arguments);
		var method_name = args.shift();
		var method = this.settings.methods[method_name];
		if(method && typeof method === 'function'){
			method.apply(this.context, args);
		}
	}
	
	Logic.prototype.start = function(){
		this.context = {
			transform: this.entity.transform,
			sprite: this.entity.sprite,
			body: this.entity.body,
			entity: this.entity,
			components: this.components,
			input: this.components.input
		};
		
		this.components.logic.addLogic(this);
	};
	
	O.create(Logic, 'plugin');
	O.set('plugin.logic', Logic);
})();