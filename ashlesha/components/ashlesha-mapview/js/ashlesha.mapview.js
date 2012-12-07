YUI().add('ashlesha-mapview',function(Y) {
    
    
    Y.MapView = Y.Base.create("MapView", Y.AshleshaBaseView, [], {
        altInitializer: function(auth) {
            var c = this.get('container'),
                t = this.get("template"),
                list = new Y.ModelList(),
                self = this,
                query = this.get("query") || {};
            c.setHTML(t.one("#" + this.name + "-main").getHTML());
            this.startWait(c);
            this.loadModules();
            this.on('placesLoad', function() {
            
                Y.api.invoke("/places/getPlacesByUsers",{
                    user_id:this.get("user").get("_id")
                },function(err,response){
                    
                    Y.Array.each(response,function(item){
                        list.add(item);
                    });
                    
                    
                    Y.use('ashlesha-gmap', function(Y) {
                      var gmap = new Y.Gmap({
                            container: c,
                            height:500,
                            width:800,
                            markers:response
                        });
                        gmap.loadMap(list.item(0).toJSON());   
                    });
                     
                                 
                    self.endWait();
                });
               
                
                
            }, this);
            this.fire("placesLoad");
            
        }
    });
    
},'0.0.1',{ requires:['base','ashlesha-form','ashlesha-common-model']  });