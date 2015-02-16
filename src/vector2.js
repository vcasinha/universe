(function(){
    var Vector2 = function(vec){
        if(typeof vec === 'object'){
            this.set(vec);
        }
        else{
            this.set({x:0, y:0});
        }
    };

    Vector2.prototype.classes = [];

    Vector2.prototype.set = function(vec){
        this.x = vec.x || 0;
        this.y = vec.y || 0;
    };

    Vector2.prototype.multiply = function(scalar){
        this.x *= scalar;
        this.y *= scalar;
    };

    Vector2.prototype.divide = function(scalar){
        this.x /= scalar;
        this.y /= scalar;
    };

    Vector2.prototype.clone = function(){
        return new Vector2(this);
    };

    Vector2.prototype.compare = function(vec){
        if(vec.x != this.x || vec.y != this.y){
            return false;
        }
    };

    O.register('vec2', Vector2);

})();