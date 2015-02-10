(function(){
	var Context = function(){
	};
	
	var prototype = {
		clone: function(){
			var ctx = O.instance('engine.context');
			ctx.display = this.display;
			ctx.loader = this.loader;
			ctx.audio = this.audio;
			return ctx;
		}
	};

	O.register('engine.context', Context, prototype, ['o.events']);
})(O);