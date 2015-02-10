(function(){
	O.register('engine.entity', function(){
        this.updateCallback = function(){
            this.update();
        }.bind(this);

        this.count = 0;

		this.ctx.on('sm.state.update.before', this.updateCallback);
    }, 
    {
        update: function(){
            if(this.count % 10 === 0){
                console.log("Wrong");
            }
            
            this.count++;
        },
        shutdown: function(){
            this.ctx.off('sm.state.update.before', this.updateCallback);
        }
    }, 
    ['engine.object']);
})();