(function(){
	"use strict";
	
	var Entity = function(){
		//console.log('Entity.constructor');
		O.exec('universe.unit', this);
		
		var self = this;
		this.connected = false;
		this.id = this.id || 'entity';
		this.type = this.type || 'generic';
		this.link = this.link || {};
		this.links = {};
		this.linking = false;
		
		//console.log('entity.construct', this.type + '.' + this.id);
        var node_tick = function(delta){
			self.trigger('tick');
		};
        
        this.on('connect', function(unit){
	        if(this.connected === false && this.linking === false){
		        this.linking = true;
		        //console.log('attempt connection', this.id, unit.type + '.' + unit.id);
		        var required_connections = 0;
		        var linked_connections = 0
		        for(var ix in this.link){
			        //console.log('Attempt to link', ix);
			        if(this[ix] === undefined){
				        var link = this.findByID(this.link[ix]);
				        if(link !== undefined){
					        //console.log('Linking', this.id, link.id);
					        //Connect directly
					        if(this.connections.indexOf(link) === -1){
						        //console.log('Connecting', this.id, link.id);
						        this.connect(link);
					        }
					        linked_connections++;
					        this.links[ix] = link;
					        this[ix] = link;
				        }
			        }
			        else {
				        linked_connections++;
			        }
			        
			        required_connections++;
		        }
		        
		        if(this.connected === false){
			        if(linked_connections === required_connections){
				        //console.log('Connected', this.id, this.link);
				        this.connected = true;
				        this.trigger('connected', unit);
			        }
			        else{
				        console.log('failed', required_connections, linked_connections);
				        console.error('failed to connect', this.id, unit.id, this.link, this.links);
			        }
		        }
	        }
	        else{
		        //console.log('Already connected', this.id, unit.d);
	        }
	        this.linking = false;
        });
        
        this.on('disconnect', function(unit){
	        if(this.connected === true){
		        console.log('disconnect', unit);
		        var count = 0;
		        var links_available = 0
		        for(var ix in this.link){
			        var link = this.findByID(this.link[ix]);
			        if(link !== undefined){
				        links_available++;
			        }
			        else{
				        delete this[ix];
			        }
			        count++;
		        }
		        
		        if(links_available !== count){
			        console.log('disconnected');
			        this.trigger('disconnected', unit);
			        this.trigger('alone', unit);
			        self.connected = false;
		        }
	        }
        });
	};
	
	O.create(Entity, 'universe.unit');
	
	O.set('universe.entity', Entity);
})();