(function(Engine){
    var Component = function(ctx, settings){
	    this.ctx = ctx;
        this.settings = O.extend({}, this.default_settings, settings);
        
        var update = function(dt){
            this.update(dt);
        }.bind(this);
        
        ctx.on('component.update', update);
    };

    Component.prototype.classes = [];
    Component.prototype.settings_default = {
        name: 'Unnamed component',
        version: '0.0',
        paused: false
    };
    Component.prototype.update = function(){};
    Component.prototype.shutdown = function(){};
    
    O.register('engine.component', Component);

})();