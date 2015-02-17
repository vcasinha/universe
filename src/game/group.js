(function(){
    var StageObject = function(){

        this.stage = stage;
        this.settings = O.extend({id: uuid()}, this.defaultSettings, user_settings);

        this.renderContainer = O.i('engine.layer');
        this.children = {};
        this.position = O.instance('vec2');

        var position_update = function(position){
            //console.log('stage.object position.update', position);
            this.position.x = position.x;
            this.position.y = position.y;
        }.bind(this);

        var rotation_update = function(angle){
            this.rotation = angle;
        }.bind(this);

        var update = function(dt){
            for(var id in this.objects){
                this.objects[id].trigger('addon.update', dt);
                this.objects[id].trigger('update', dt);
                this.objects[id].update(dt);
            }
        }.bind(this);

        this.on('update', update);
        this.on('position.update', position_update);
        this.on('rotation.update', rotation_update);
    };
    
    StageObject.prototype.classes = ['o.events'];
    StageObject.prototype.defaultSettings = {};
    
    StageObject.prototype.add = function(child){
        this.children[child.id] = child;
        this.renderContainer.addChild(child.renderContainer);

        return this;
    };

    StageObject.prototype.child = function(id){
        return this.children[id];
    };

    StageObject.prototype.remove = function(id){
        this.children[id].trigger('stop');
        delete this.children[id];
        return this;
    };

    StageObject.prototype.getID = function(){
        return this.settings.id;
    };
    
    O.register('stage.object', StageObject);
})();