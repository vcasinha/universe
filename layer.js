(function(){
	var Group = function(stage, settings){
		this.items = {};
		this.renderObject = this.ctx.renderer.layer();
		if(typeof this.sprite === 'string'){
			this.sprite = this.stage.sprite(this.sprite, this);
		}
	};
	
	Group.prototype.classes = ['engine.entity'];
	
	Group.prototype.add = function(object){
		this.items[object.name] = object;
		if(item.renderObject){
			this.renderObject.add(item.renderObject);
		}
	};
	
	Group.prototype.byName = function(name){
		return this.items[name] || undefined;
	};
	
	Group.prototype.byAttribute = function(index, value){
		var bag = [];
		
		for(var i in this.items){
			var item = this.items[i];
			if(item[index] && index[index] === value){
				bag.push(item);
			}
		}
		
		return bag;
	};
	
	O.register('engine.group', Group);
})();