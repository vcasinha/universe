(function(){
    var EventManager = function(){
        var channels = {};
        
        //console.log("o.events.construct", this);
        
        this.resetSubscriptions = function(){
            channels = {};
        };

        this.on = function(channel_name, callback, off_channel_name){
            if(channels[channel_name] === undefined){
                channels[channel_name] = [];
            }

            channels[channel_name].push(callback);

            //Autoshutdown
            off_channel_name = off_channel_name || 'stop';
            this.once(off_channel_name, function(){
                //console.log("o.events autoshutdown", channel_name);
                this.off(channel_name, callback);
            }.bind(this));

            return this;
        };
        
        this.once = function(channel_name, callback){
            if(channels[channel_name] === undefined){
                channels[channel_name] = [];
            }
            
            var that = this;

            var subscriber = function(){
                callback.apply(this, arguments);
                //console.log("Unsubscribe once", channel_name);
                this.off(channel_name, subscriber);
	        }.bind(this);
			
            channels[channel_name].push(subscriber);
            
            //console.log("events.once", channel_name, channels[channel_name].length);
            
            return this;
        };
        
        this.off = function(channel_name, callback){
            //console.log("events.off", channel_name);
            if(typeof channel_name !== 'string' || callback === undefined){
                console.log("events.off.invalid", channel_name);
                return this;
            }

            var ix = channels[channel_name].indexOf(callback);
            if(ix >= 0){
                //console.log("events.off.found", channel_name, ix);
                channels[channel_name].splice(ix, 1);
            }
            
            return this;
        };
        
        this.trigger = function(){
	        var args = Array.prototype.slice.call(arguments);
	        var channel_name = args.shift();
	        var channel = channels[channel_name];
	        
	        if(channel){
	            channel = channel.slice(0);
	            if(channel !== undefined){
		            //console.log("event.trigger", channel_name);
					channel.forEach(function(subscriber){
						subscriber.apply(this, args);
					});
	            }
	        }
/*
	        else{
		        console.warn("event.trigger.channel.empty", channel_name);
	        }
*/

        };
        
        this.getChannel = function(channel_name){
	        return channels[channel_name];
        }
    };

    O.register('o.events', EventManager);
})();