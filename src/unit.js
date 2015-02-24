(function(){
    "use strict";
    
    var default_settings = {
    };

	var counter = 0;

    var Unit = function(){
	    this.id = this.id || 'unit#' + counter++;
	    this.parent;
	    this.connections = [];
	    this.channels = {};
        //console.log('universe.unit.construct', this.id);
    };

    Unit.prototype.init = function(settings){
        console.log('universe.unit.init');
        this.settings = O.extend({}, default_settings, settings);

        return this;
    };

    Unit.prototype.on = function(channel_name, callback){
	    //console.log('Unit.on', channel_name);
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

		if(channel_name !== 'shutdown'){
	        //autostop
	        this.once('shutdown', function(){
	            console.log("o.events.shutdown", channel_name);
	            this.off(channel_name, callback);
	        }.bind(this));
		}

        return this;
    };
    
    Unit.prototype.once = function(channel_name, callback){
        var self = this;
        var wrapped_callback = function(){
            callback.apply(callback, arguments);
            self.off(channel_name, wrapped_callback);
        };
        
        this.on(channel_name, wrapped_callback)
        
        return this;
    };
    
    Unit.prototype.off = function(channel_name, callback){
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
    
    Unit.prototype.trigger = function(){
        var args = Array.prototype.slice.call(arguments);
        var channel_name = args.shift();
        var channel = this.channels[channel_name] || [];
        
        for(var i = 0;i < channel.length;i++){
            channel[i].apply(this, args);
        }
    }

	Unit.prototype.broadcast = function(message){
		var response;
		
		message = message || {};
		
		if(message.signatures === undefined){
			message.signatures = [];
		}
		
		message.hops = message.hops || 0;
		//console.log(message);
		if(message.signatures.indexOf(this) >= 0){
			return message;
		}
		
		message.signatures.push(this);
		message.hops++;
		
		//console.log(this.id, message.id);
		
		if(message.callback.call(message, this) === true){
			return message;
		}
		
		//console.log(this.id, message);
		
		for(var i = 0;i < this.connections.length;i++){
			var unit = this.connections[i];
			if(message.signatures.indexOf(unit) === -1){
				var answer = unit.broadcast(message);
				if(answer.response){
					message.response = answer.response;
					message.hops = answer.hops;
				}
			}
		}
		
		//console.log(this.id, message);
		
		return message;
	};

	Unit.prototype.resetChannel = function(channel_name){
		delete this.channels[channel_name];
	};

	Unit.prototype.findByID = function(id){
		var found = undefined;
	    var message = {
		    callback: function(unit){
			    if(this.found){
				    return true;
			    }
			    
			    if(unit.id === id){
				    this.found = unit;
				    return true;
			    }
			    return false;	
		    }
	    };
	    
	    var response = this.broadcast(message);
	    //console.log("find by ID", response);
	    if(response.found === undefined){
		    throw("Could not find unit with ID " + id);
	    }
	    
        //console.error("findByID", this.id, id, message.hops);

	    return response.found;
	};

    Unit.prototype.connect = function(unit){
	    //console.log("Unit.connect", this.id, unit.id);
	    
	    if(unit === this || this.connections.indexOf(unit) >= 0){
		    return this;
	    }
	    
	    this.connections.push(unit);	
		unit.connect(this);

		this.trigger('connect', unit);

        return this;
    };
    
    Unit.prototype.disconnect = function(unit){
	    if(this.connections.indexOf(unit) >= 0){
		    this.trigger('disconnect', unit);
		    for(var i = 0;i < this.connections.length;i++){
			    if(this.connections[i] === unit){
				    this.connections.splice(i, 1);
			    }
		    }
		    
		    unit.disconnect(this);
		    
		    if(this.connections.length === 0){
			    this.trigger('alone', unit);
		    }
	    }
	    
	    return this;
    };
    
    O.set('universe.unit', Unit);
})(O);