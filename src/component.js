(function(Engine){
    var Component = function(ctx, settings){
	    this.ctx = ctx;
        this.settings = O.extend({}, this.settingsDefault, settings);
        
        var update = function(dt){
            console.log('component.update', dt);
            this.update(dt);
        }.bind(this);
        ctx.on('component.update', update);
    };

    Component.prototype.classes = [];
    Component.prototype.settingsDefault = {
        name: 'Unnamed component',
        version: '0.0',
        paused: false
    };
    Component.prototype.update = function(){};
    Component.prototype.shutdown = function(){};
    
    O.register('engine.component', Component);

})();