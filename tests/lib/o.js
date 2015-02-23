(function(){
    var O = function(){
        var self = this;
        this.objects = this.objects || {};

        var instance = function(){
            //console.log("Instance", this);
            var args = Array.prototype.slice.call(arguments);
            var name = args.shift();

            if(typeof name !== 'string'){
                throw("Must provide an instance name");
            }

            var Constructor = this.get(name);
            if(typeof Constructor !== 'function'){
                throw("Constructor " + name +  " not registed");
            }

            var instance = new (function(f, args) {
                        args.unshift(f);
                        return f.bind.apply(f, args);
                    }(Constructor, args));

            return instance;

        }.bind(this);

        this.extend(instance, this);

        //console.log('O', this);

        return instance;
    };

	O.prototype.exec = function(name){
		var args = Array.prototype.slice.apply(arguments);
		var name = args.shift();
		var context = args.shift();
		
		var func = this.get(name);
		func.apply(context, args);
		//console.log("Call", name, func);
		
		return this;
	};

    O.prototype.create = function(Constructor, Extension, prototype){
        var prototype = this.extend({}, Constructor.prototype, prototype);

        if(!Extension){
            Extension = function(){};
        }
        else if(typeof Extension === 'string'){
	        var extension_name = Extension;
            Extension = this.get(extension_name);
            if(Extension === undefined){
	            console.error('O.create Extension not loaded', extension_name, Constructor);
	            throw("STOP");
            }
        }

        Constructor.prototype = Object.create(Extension.prototype);
        Constructor.prototype.$parent = Extension;
        Constructor.prototype.constructor = Constructor;
        this.extend(Constructor.prototype, prototype);
        Constructor.prototype._extended_ = true;
    };

    O.prototype.set = function(index, Constructor){
        this.objects[index] = Constructor;
        return this;
    };

    O.prototype.link = function(index, alias){
        this.objects[alias] = this.objects[index];
    }

    O.prototype.get = function(index, default_value){
        return this.objects[index] || default_value;
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

    (new O()).create(O);
    
    window.O = new O();
})();