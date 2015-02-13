(function(){
    O.register('engine.object', function(ctx){
	    if(typeof ctx !== 'object'){
		    console.error("object.construct", ctx)
		    throw("Invalid Context");
	    }
	    
        this.ctx = ctx;
    })
})();