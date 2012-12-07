YUI().add('ashlesha-search',function(Y) {
    
    Y.SearchPageView = Y.Base.create("SearchPageView", Y.AshleshaBaseView, [], { 
        events:{
            ".search":{
                "click":function(e){
                    var searchQuery = this.getSearchKeyword();
                    
                    if(searchQuery){
                        Y.fire("navigate",{
                            action:"/search/"+searchQuery
                        });
                    }
                    e.halt();
                }
            }
        },
        getSearchKeyword:function(){
            return this.get("container").one(".search-text").get("value");
        },
        altInitializer:function(){
            var t = this.get("template"),
                c = this.get("container");
            
            c.setHTML(Y.Lang.sub(t.one("#"+this.name+"-main-signed").getHTML(),{
                VAL:this.get("queryText") || ""
            }));
            this.loadModules();
            
            
        }
        
    });
    
    
},'0.0.1',{ requires:['base','ashlesha-form','ashlesha-common-model']  });