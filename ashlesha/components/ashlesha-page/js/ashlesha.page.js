YUI().add('ashlesha-page',function(Y) {
    
    
     Y.PageView = Y.Base.create("PageView", Y.AshleshaBaseView, [], {
        altInitializer: function(auth) {
            var c = this.get('container'),
                t = this.get("template");
            c.setHTML(t.one("#PageView-main-unsigned").getHTML());
            this.loadModules();
        }
    });
    
    
    
    Y.TitledPageView = Y.Base.create("TitledPageView", Y.AshleshaBaseView, [], {
        altInitializer: function(auth) {
            var c = this.get("container"),
                t = this.get("template"),
                user = this.get("user");
            if (auth) {
                c.setHTML(Y.Lang.sub(t.one("#" + this.name + "-signed-main").getHTML(), {
                    TITLE: this.get("title") || ""
                }));
                this.loadModules();
            }
        }

    });
    
},'0.0.1',{ requires:['base','ashlesha-form','ashlesha-common-model']  });