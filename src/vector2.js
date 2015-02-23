(function(){
    "use strict";
    
    var Vector2 = function(vec){
        if(typeof vec === undefined){
            vec = {
	            x:0, 
	            y:0
	        };
        }
        
        this.set(vec);
    };

    Vector2.prototype.set = function(vec){
	    var args = Array.prototype.slice.apply(arguments);
	    var x = 0;
	    var y = 0;
	    
	    if(args.length >= 2){
	    	this.x = args.shift();
			this.x = args.shift();
	    }
	    else if(args.length === 1){
		    var vec = args.shift();
		    
		    if(typeof vec === 'object'){
			    x = vec.x;
			    y = vec.y;
		    }
	    }

        this.x = x;
        this.y = y;
    };

	Vector2.prototype.subtract = function(vec){
		this.x -= vec.x;
		this.y -= vec.y;

		return this;
	};

    Vector2.prototype.multiply = function(scalar){
        this.x *= scalar;
        this.y *= scalar;
        
        return this;
    };

    Vector2.prototype.divide = function(scalar){
        this.x /= scalar;
        this.y /= scalar;
        
        return this;
    };

    Vector2.prototype.clone = function(){
        return new Vector2(this);
    };

    Vector2.prototype.compare = function(vec){
	    if(typeof vec !== 'object'){
		    return;
	    }
	    
        if(vec.x != this.x || vec.y != this.y){
            return false;
        }
    };

    O.set('vector2', Vector2);
})();
