(function(){
    var BaseObject = function(parent, user_settings){
        this.stage = parent.ctx.stage;
        this.ctx = parent.ctx;
        this.parent = parent;
        this.settings = O.extend({}, this.defaultSettings, user_settings);
        
        this.settings.id = this.settings.id || uuid();
        
        //console.log('object.construct', this.settings.id);

        this.children = [];
        
        //console.log(arguments);
		this.parent.add(this);
    };

    BaseObject.prototype.classes = ['o.events'];

    BaseObject.prototype.add = function(child){
        this.children.push(child);

        return this;
    };

    BaseObject.prototype.remove = function(child){
	    var index = this.children.indexOf(child);
	    
	    if(index > -1){
		    array.splice(index, 1);
	    }
        
        return this;
    };

    BaseObject.prototype.defaultSettings = {

    };
    
    O.register('stage.object', BaseObject);
})();