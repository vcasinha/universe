(function(){
    var BaseObject = function(parent, user_settings){
	    this.parent = parent;
	    this.ctx = parent.ctx;
        this.stage = this.ctx.stage;
        
        this.settings = O.extend({}, this.defaultSettings, user_settings);
    };

    BaseObject.prototype.classes = [];

    BaseObject.prototype.defaultSettings = {

    };
    
    O.register('stage.addon', BaseObject);
})();