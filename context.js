(function(){
	O.register('engine.context', 
	function(){
		this.context = {};
	},
	{
		load: function(context){
			//console.log('ctx.load', this.context, context);
			if(typeof context !== 'object'){
				throw("Invalid context extension");
			}
			
			for(var i in context){
				this.set(i, context[i]);
		}
		},
		set: function(index, method){
			this[index] = this.context[index] = method;
		},
		clone: function(){
			//console.log("ctx.clone", this.context);
			var ctx = O.instance('engine.context');
			ctx.load(this.context);
			return ctx;
		}
	}, ['o.events']);
})(O);