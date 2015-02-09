(function(window){
	var OO = function(){
		this.items = {};
	};
	
	OO.prototype.createClass = function(Constructor, prototype, mixins){
		if(typeof mixins === 'function'){
			mixins = [mixins];
		}
		else if(mixins === undefined){
			mixins = [];
		}

		if(prototype === undefined){
			prototype = {};
		}

		if(Constructor === null){
			Constructor = function(){};
		}

		//console.log("CreateClass", mixins, typeof mixins);

		var VanillaConstructor = function(){
			var args = arguments;
			//console.log("VanillaConstructor.construct", args);
			var that = this;
			mixins.forEach(function(Parent){
				//console.log("VanillaConstructor.construct.extend", Parent, args);
				Parent.apply(that, args);
			});

			Constructor.apply(that, args);
		};

		var parent_prototype = {};

		prototype.constructor = Constructor;
		if(mixins.length > 0){
			parent_prototype = Object.create(mixins[0].prototype);
		}
		
		VanillaConstructor.prototype = $.extend({}, prototype, parent_prototype);

		return VanillaConstructor;
	}

	OO.prototype.extend = function(){
		$.extend.apply($, arguments);		
		return this;
	};
	
	OO.prototype.set = function(index, item){
		//console.log('oo.set', index, this);
		this.items[index] = item;
		return this;
	};
	
	OO.prototype.get = function(index, def){
		var value = def;
		
		if(this.items[index] !== undefined){
			value = this.items[index];
		}
		
		//console.log('oo.get', index, value);
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