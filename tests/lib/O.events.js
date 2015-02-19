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
    
    var EventManager = function(){
	    this.stats = function(){
		    stats.time_end = parseInt(new Date().getTime() / 1000);
		    stats.time_delta = stats.time_end - stats.time_start;
		    console.log();
		    var pad = '                             ';
		    
		    console.log(
			    value_pad('channel', 30), 
			    value_pad('time', 5), 
			    value_pad('subs', 5),
			    value_pad('event', 5), 
			    value_pad('call', 5),
			    value_pad('subc', 5),
			    value_pad('eps', 5)
		    );
		    
		    for(var i in stats.events_per_channel){
			    var subscribers = Math.round(stats.calls_per_channel[i] / (1 + stats.events_per_channel[i]));
			    var events_per_channel = Math.round(stats.events_per_channel[i] / stats.time_delta);
			    var calls_per_channel = Math.round(stats.calls_per_channel[i] / stats.time_delta);
			    var subscribers_calls = Math.round(stats.subscriptions[i] / stats.time_delta);
			    var eps = calls_per_channel / subscribers_calls;
			    
			    console.log(
				    value_pad(i, 30), 
				    value_pad(stats.time_delta, 5), 
				    value_pad(subscribers, 5),
				    value_pad(events_per_channel, 5), 
				    value_pad(calls_per_channel, 5),
				    value_pad(subscribers_calls, 5),
				    value_pad(eps, 5)
			    );
		    }
	    };
        var channels = {};
        var subscribers = [];
        
        //console.log("o.events.construct", this);
        
        this.resetSubscriptions = function(){
            channels = {};
        };

        this.on = function(channel_name, callback, off_channel_name){
            if(channels[channel_name] === undefined){
                channels[channel_name] = [];
            }

            channels[channel_name].push(callback);

            //autostop
            off_channel_name = off_channel_name || 'stop';
            this.once(off_channel_name, function(){
                console.log("o.events autostop", channel_name);
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
            var ix = channels[channel_name].indexOf(callback);
            if(ix){
                //console.log("events.off.found", channel_name, ix);
                channels[channel_name][ix] = undefined;
            }
            
            return this;
        };
        
        this.trigger = function(){
	        var args = Array.prototype.slice.call(arguments);
	        var channel_name = args.shift();
	        var channel = channels[channel_name] || [];
	        
	        //console.log("event.trigger", channel_name, channel);
			for(var i = 0;i < channel.length;i++){
				channel[i].apply(this, args);
			}
			
/*
		    if(stats.events_per_channel[channel_name] === undefined){
			    stats.events_per_channel[channel_name] = 0;
		    }
		    
			stats.events_per_channel[channel_name] += 1;
			
			if(stats.calls_per_channel[channel_name] === undefined){
            	stats.calls_per_channel[channel_name] = 0;
            }
            
			stats.calls_per_channel[channel_name] += i;
			
			if(stats.subscriptions[channel_name] === undefined){
            	stats.subscriptions[channel_name] = 0;
            }
*/
			
			args.unshift(channel_name);
			for(var i = 0;i < subscribers.length;i++){
				//stats.subscriptions[channel_name]++;
				subscribers[i].trigger.apply(subscribers[i], args);
			}
			
			//stats.calls_per_channel[channel_name] -= i;
        }
        this.broadcast = function(subscriber){
	        subscribers.push(subscriber);
	        return this;
        };
        
        this.cancelBroadcast = function(subscriber){
	        var index = subscribers.indexOf(subscriber);
	        if(index){
		        subscribers.splice(index, 1);
	        }
	        return this;
        };
        
        this.getChannel = function(channel_name){
	        return channels[channel_name];
        };

        this.discover = function(){
            var root = {
                id: this.settings.id || 'NOID',
                children: []
            };

            for(var i = 0;i < subscribers.length;i++){
                var subscriber = subscribers[i];
                root.children.push(subscriber.discover());
            }

            return root;
        }
    };

	EventManager.prototype.classes = [];

    O.register('o.events', EventManager);
})();