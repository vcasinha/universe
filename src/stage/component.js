(function(){
    var Component = function(parent, user_settings){
        this.stage = parent.ctx.stage;
        this.ctx = parent.ctx;
        this.settings = O.extend({}, this.defaultSettings, user_settings);
    };

    Component.prototype.classes = ['o.events'];

    Component.prototype.defaultSettings = {

    };
    
    O.register('stage.component', Component);
})();