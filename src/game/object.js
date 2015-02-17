(function(){
    
    function uuid(){
        return parseInt(new Date().getTime()).toString(16);
    }
    
    var GameObject = function(stage, user_settings){

        this.stage = stage;
        this.settings = O.extend({id: uuid()}, this.defaultSettings, user_settings);

        this.renderContainer = O.i('engine.layer');
        this.children = {};
        this.position = O.instance('vec2');

        var position_update = function(position){
            //console.log('stage.object position.update', position);
            this.position.x = position.x;
            this.position.y = position.y;
            this.renderContainer.position = this.position;
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
    
    GameObject.prototype.classes = ['o.events'];
    GameObject.prototype.defaultSettings = {};
    
    GameObject.prototype.add = function(child){
        this.children[child.id] = child;
        this.renderContainer.addChild(child.renderContainer);

        return this;
    };

    GameObject.prototype.child = function(id){
        return this.children[id];
    };

    GameObject.prototype.remove = function(id){
        this.children[id].trigger('stop');
        delete this.children[id];
        return this;
    };

    GameObject.prototype.getID = function(){
        return this.settings.id;
    };
    
    O.register('game.object', GameObject);
})();