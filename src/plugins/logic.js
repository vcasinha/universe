(function(){
	var Logic = function(){
		this.id = this.id || 'logic.plugin';
		this.$parent.apply(this, arguments);
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
		
		
		O.extend(this.context, this.settings.context);
	};
	
	Logic.prototype.update = function(dt){
		var method = this.settings.methods['update'];
		if(method && typeof method === 'function'){
			method.call(this.context, dt);
		}
	};
	O.create(Logic, 'plugin');
	O.set('plugin.logic', Logic);
})();