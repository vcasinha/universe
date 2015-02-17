(function(){
    function uuid(){
        return parseInt(new Date().getTime()).toString(16) + 
            parseInt(new Date().getTime() * Math.random()).toString(16);
    }

    var StageObject = function(parent, user_settings){
        this.ctx = parent.ctx;
        this.stage = parent.ctx.stage;

        this.settings = O.extend({id: uuid()}, this.defaultSettings, user_settings);

        //console.log("stage.object.construct", this.settings.id);

        this.renderContainer = O.i('engine.layer');
        this.children = {};

        this.position = O.i('vec2');

        var update = function(dt){
            for(var id in this.objects){
                var child = this.children[id];
                child.trigger('addon.update', dt);
                child.trigger('update', dt);
                //child.update(dt);
            }
        }.bind(this);

        var position_update = function(position){
            //console.log('stage.object position.update', position);
            this.position.x = position.x;
            this.position.y = position.y;
        }.bind(this);

        var rotation_update = function(angle){
            this.rotation = angle;
        }.bind(this);

        this.on('update', update);
        this.on('position.update', position_update);
        this.on('rotation.update', rotation_update);
    };
    
    StageObject.prototype.classes = ['stage.component'];
    StageObject.prototype.defaultSettings = {};
    
    StageObject.prototype.add = function(child){
        this.children[child.settings.id] = child;
        this.renderContainer.addChild(child.renderContainer);

        return this;
    };

    StageObject.prototype.attach = function(addon){
        addon.attach(ctx);

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

    StageObject.prototype.defaultSettings = {
        position:{
            x: 0,
            y: 0
        }
    };
    
    O.register('stage.object', StageObject);
})();