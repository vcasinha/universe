(function(){
    var Engine = O.get('universe');

    var Application = function(){
        this.$parent.apply(this);
        
        
    };

    O.create(Application, Engine);

    O.set('App', Application);
})();
