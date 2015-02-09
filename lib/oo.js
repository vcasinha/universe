(function(window){
	var OO = function(){
		this.items = {};
	};
	
	OO.prototype.parentClass = function(Parent, Child, proto){
		Child.prototype = Object.create(Parent.prototype);
		Child.prototype.constructor = Child;
		this.extend(Child, proto);
		
		return this;
	};
	
	OO.prototype.extend = function(){
		$.extend.apply($, arguments);		
		return this;
	};
	
	OO.prototype.set = function(index, item){
		console.log('oo.set', index, this);
		this.items[index] = item;
		return this;
	};
	
	OO.prototype.get = function(index, def){
		var value = def;
		
		if(this.items[index] !== undefined){
			value = this.items[index];
		}
		
		console.log('oo.get', index, value);
		return value;
	};
	
	OO.prototype.extendObject = function(parent, child, args){
		//console.log("oo.extendObject", parent, child, args);
		parent.apply(child, args);
		
		return parent;
	}

	OO.prototype.instance = function(index, args){
		//console.log('oo.instance', index, args);
		return this.extendObject(index, {}, args);
	}
	
	OO.prototype.register = function(index, instance){
		if(this[index] !== undefined){
			throw "Index in use";
		}
		
		this[index] = instance;
		if(instance.attachTo !== undefined){
			instance.attachTo(this);
		}
		return this;
	};
	
	OO.prototype.constructor = OO;
	
	window.OO = OO;
	window.Oo = new OO();
	window.Oo.set('oo', OO);
})(window);