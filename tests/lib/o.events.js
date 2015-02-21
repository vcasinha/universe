(function(){
    var stats = {
        time_start: parseInt(new Date().getTime() / 1000),
        events_per_channel:{},
        calls_per_channel: {},
        subscriptions: {}
    };
    
    function repeat(string, num){
        return new Array( num + 1 ).join( string );
    }
    
    function value_pad(value, size, string){
        if(string === undefined){
            string = ' ';
        }
        
        var pad = repeat(string, size);
        return (pad + value.toString()).slice(-size);
    }
    
    var EventManager = function(context){
        context = context || this;
        this.channels = {};
        this.subscribers = [];
    };

    EventManager.prototype.resetSubscriptions = function(){
        this.channels = {};
    };

    EventManager.prototype.on = function(channel_name, callback){
        if(channel_name === undefined){
            console.error('o.events Channel name is undefined.');
            return this;
        }
        
        if(channel_name instanceof Array){
            var list = channel_name;
            for(var i = 0;i < list.length;i++){
                var channel_name = list[i];
                this.on(channel_name, callback);
            }
            
            return this;
        }
        
        if(this.channels[channel_name] === undefined){
            this.channels[channel_name] = [];
        }

        this.channels[channel_name].push(callback);

        //autostop
        this.once('shutdown', function(){
            console.log("o.events.shutdown", channel_name);
            this.off(channel_name, callback);
        }.bind(this));

        return this;
    };
    
    EventManager.prototype.once = function(channel_name, callback){
        var self = this;
        var wrapped_callback = function(){
            callback.apply(callback, arguments);
            self.off(channel_name, wrapped_callback);
        };
        
        this.on(channel_name, wrapped_callback)
        
        return this;
    };
    
    EventManager.prototype.off = function(channel_name, callback){
        var channel = this.channels[channel_name];
        
        if(channel === undefined){
            return this;
        }

        var ix = channel.indexOf(callback);
        if(ix >= 0){
            channel.splice(ix, 1);
            console.log("events.off", channel_name, ix, channel.length);
        }
        
        return this;
    };
    
    EventManager.prototype.trigger = function(){
        var args = Array.prototype.slice.call(arguments);
        var channel_name = args.shift();
        var channel = channels[channel_name] || [];
        
        for(var i = 0;i < channel.length;i++){
            channel[i].apply(this, args);
        }
    }
    
    EventManager.prototype.broadcast = function(){
        var args = Array.prototype.slice.call(arguments);
        for(var i = 0;i < subscribers.length;i++){
            subscribers[i].trigger.apply(subscribers[i], args);
        }
    };
    
    EventManager.prototype.connect = function(subscriber){
        subscribers.push(subscriber);
        return this;
    };
    
    EventManager.prototype.disconnect = function(subscriber){
        var index = subscribers.indexOf(subscriber);
        if(index){
            subscribers.splice(index, 1);
        }
        return this;
    };

    O.set('o.events', EventManager);
})();