(function(){
    var default_settings = {
    };

    var Context = function(){
        console.log('universe.context.construct');
        
		O.get('universe.unit').apply(this);
		this.id = 'context';
    };
    
    O.create(Context, 'universe.unit');
    
    Context.prototype.init = function(settings){
        console.log('universe.context.init');
        this.settings = O.extend({}, default_settings, settings);

        this.initComponents();

        return this;
    };

    Context.prototype.initComponents = function(){
        console.log('universe.context.initComponents');
        for(var name in this.settings){
            var component_settings = this.settings[name];
            this[name] = this.initComponent(name, component_settings);
        }

        return this;
    };

    Context.prototype.initComponent = function(name, settings){
        console.log('universe.context.initComponent', name, settings);

		var component = O(settings.component);
		this.connect(component);
		
		component.init(settings);
		
		return component;
    }

    O.set('universe.context', Context);
})(O);