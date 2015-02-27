(function(){
    "use strict";
    
    var Vector2 = function(vec){
        this.copy(vec || {x:0, y:0});
    };

	Vector2.prototype.copy = function(vec){
		this.x = vec.x || 0;
		this.y = vec.y || 0;
	};

    Vector2.prototype.set = function(x, y){
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

	Vector2.prototype.length = function(){
		return Math.sqrt(this.x * this.x + this.y * this.y)
	};

	Vector2.prototype.normalize = function(){
		this.divide(this.length());
		
		return this;
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
