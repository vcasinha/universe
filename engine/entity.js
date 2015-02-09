(function(Engine){
	Engine.Entity = Oo.createClass(function(){
        this.value = 0;
    }, 
    {
        update: function(){
            this.value += 1;
            if(this.value > 20){
                this.value = 0;
                console.log("Working hard");
            }
        }
    },
    Engine.Object);

})(Engine);