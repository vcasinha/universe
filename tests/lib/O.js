/*! O 2015-02-16 */
/*! O v0.1 | (c) 2015 Vladimiro Casinha | miro.oorganica.com */
(function(window){
    var O = function(items){
        this.__items = {};
        this.__onloadCallbacks = [];
        //this.extend(this.__items, items);
        //window.onload = this.__onloadCallback.bind(this);
    };
    
    O.prototype.__onloadCallback = function(){
        this.__onloadCallbacks.forEach(function(callback){
            callback();
        });
    };

    O.prototype.unique = function(a){
        return a.reduce(function(p, c) {
            if (p.indexOf(c) < 0) p.push(c);
            return p;
        }, []);
    };

    O.prototype.ready = function(callback){
        this.__onloadCallbacks.push(callback);
    };

    O.prototype.instance = O.i = function(name, args){
        var Constructor = this.get(name);
        if(typeof Constructor !== 'function'){
            throw "(O.instance) " + name + " is not loaded";
        }

        //console.log("instance", name);

        //Handle arguments as an ARRAY or load all arguments
        if(args === undefined || args.constructor !== Array){
           args = Array.prototype.slice.call(arguments);
           args.shift();
        }

        var instance = new (function(f, args) {
                    var params = [f].concat(args);
                    return f.bind.apply(f, params);
                }(Constructor, args));

        return instance;
    };

    O.prototype.register = function(name, Constructor){
        //console.log('o.register', name);
        if(typeof Constructor !== 'function'){
            throw('Invalid constructor');
        }
        
        Constructor.prototype  = Constructor.prototype || {};
        Constructor.prototype.__name__ = Constructor.__name__ || name;
        Constructor.prototype.constructor = Constructor;
        Constructor.prototype.__classes__  = Constructor.prototype.classes || [];
        delete Constructor.prototype.classes;

        function get_parents(o, level){
            var classes = [];
            //console.log('get.parent', o.prototype.__classes__);
            if(o.prototype.__classes__){
                for(var i in o.prototype.__classes__){
                    var class_name = o.prototype.__classes__[i];
                    //console.log('get.parent', class_name, level);
                    if(class_name in classes === false){
                        classes.push(class_name);
                        var c = get_parents(O.get(class_name), level + 1);
                        //console.log(name, c);
                        for(var e in c){
                            if(c[e] in classes === false){
                                classes.push(c[e]);
                            }
                        }
                    }
                }
            }
            return classes;
        }

        //console.log('O.register', name);
        var parent_name;
        var classes = Constructor.prototype.__classes__ = get_parents(Constructor, 1);
        //console.log(name, classes);

        // console.log('o.register.1', classes);
        
        // console.log('o.register.2', classes);

        //console.log("o.createClass", Constructor, prototype, classes);
        
        var VanillaConstructor = Constructor;

        Constructor = function(){
            var args = arguments;

            //console.log(Constructor.prototype.__name__ + '.Construct', this.__classes__);
            //console.log("VanillaConstructor.construct", args);
            //O.unique(classes);
            //console.log('object.classes', name, classes);
            for(var i = 0;i < classes.length;i++){
                //console.log('apply', i);
                var class_name = classes[classes.length - i - 1];
                O.get(class_name).apply(this, args);
            }

            VanillaConstructor.apply(this, args);
        };

        //console.log('o.register', name, classes.length);
        //Attach parent prototype
        var parent_prototype = {};
        //console.log('o.register2', name, classes.length);
        if(parent_name){
            var parent = O.get(parent_name);
            if(parent === undefined){
                console.error("o.register unknown object",parent_name);
            }
            
            //console.log("parent", Parent, Constructor);
            O.extend(Constructor.prototype, Object.create(parent.prototype));
        }

        //console.log("O.createClass", Constructor.__name__);
        Constructor.prototype = this.extend(Constructor.prototype, VanillaConstructor.prototype);
        Constructor.prototype.classes = classes;

        //Register within O
        //console.log("o.register.store", name, constructor);
        this.set(name, Constructor);
        
        return this;
        
    };

    O.prototype.createClass = function(Constructor){

        

        return Constructor;
    };

    O.prototype.extend = function(){
        var options, name, src, copy, copyIsArray, clone,
            target = arguments[0] || {},
            i = 1,
            length = arguments.length,
            deep = false;

        // Handle a deep copy situation
        if ( typeof target === "boolean" ) {
            deep = target;

            // Skip the boolean and the target
            target = arguments[ i ] || {};
            i++;
        }

        // Handle case when target is a string or something (possible in deep copy)
        if ( typeof target !== "object" && typeof target !== 'function' ) {
            target = {};
        }

        // Extend jQuery itself if only one argument is passed
        if ( i === length ) {
            target = this;
            i--;
        }

        for ( ; i < length; i++ ) {
            // Only deal with non-null/undefined values
            if ( (options = arguments[ i ]) != null ) {
                // Extend the base object
                for ( name in options ) {
                    src = target[ name ];
                    copy = options[ name ];

                    // Prevent never-ending loop
                    if ( target === copy ) {
                        continue;
                    }

                    // Recurse if we're merging plain objects or arrays
                    if ( deep && copy && ( typeof copy === 'object' || (copyIsArray = copy.constructor === Array) ) ) {
                        if ( copyIsArray ) {
                            copyIsArray = false;
                            clone = src && src.constructor === Array ? src : [];

                        } else {
                            clone = src && typeof src === 'object' ? src : {};
                        }

                        // Never move original objects, clone them
                        target[ name ] = this.extend(deep, clone, copy);
                    // Don't bring in undefined values
                    }
                    else if ( copy !== undefined ) {
                        target[ name ] = copy;
                    }
                }
            }
        }

        // Return the modified object
        return target;
    };

    O.prototype.instanceOf = function(name){
        return name in this.__proto__;
    };

    O.prototype.clone = function(obj, copy){
        if (null == obj || "object" != typeof obj) return copy;
        for (var attr in obj){
            if (obj.hasOwnProperty(attr)){
                copy[attr] = obj[attr];
            }
        }

        return copy;
    };

    O.prototype.fill = function(items){
        if(typeof items.instanceOf === 'function'){
            items = items.dump();

        }
        console.log("fill", items);
        this.extend(this.__items, items);
    };
    
    O.prototype.set = function(index, item){
        //console.log('oo.set', index, item, this);
        this.__items[index] = item;
        return this;
    };
    
    O.prototype.get = function(index, def){
        var value = def;
        
        if(this.__items[index] !== undefined){
            value = this.__items[index];
        }
        
        //console.log('oo.get', index, value);
        return value;
    };
    
    O.prototype.dump = function(){
        return this.__items;
    }
    
    O.prototype.forEach = function(callback){
        for(var i = 0;i < this.__items.length;i++){
            callback(this.__items[i], i);
        }
        
        return this;
    }
    
    O.prototype.constructor = O;

    var OO = new O();
    OO.extend(O, OO).set('o', O);

    window.O = O;
})(window);