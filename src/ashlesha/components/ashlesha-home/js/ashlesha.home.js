YUI().add('ashlesha-home',function(Y) {
    
    
    Y.HomePageView = Y.Base.create("HomePageView", Y.AshleshaBaseView, [], {
        altInitializer: function(auth) {
            var c = this.get("container");
            if (auth.user) {
                c.setHTML(this.get("template").one("#" + this.name + "-main-signed").getHTML());
            }
            else {
                c.setHTML("This resource is not available!");
            }
            this.loadModules();
        }

    });
    Y.SideBarView = Y.Base.create("SideBarView", Y.AshleshaBaseView, [], {
        altInitializer: function(auth) {
            var c = this.get("container");
            if (auth.user) {
                c.setHTML(Y.Lang.sub(this.get("template").one("#" + this.name + "-main-signed").getHTML(), {
                    FIRSTNAME: auth.user.get("firstname"),
                    LASTNAME: auth.user.get("lastname")
                }));
            }
            else {
                c.setHTML("This resource is not available!");
            }
            this.loadModules();
        }

    });
    Y.MainAreaView = Y.Base.create("MainAreaView", Y.AshleshaBaseView, [], {
        altInitializer: function(auth) {
            var c = this.get("container"),
                req = this.get("req");
            if (auth.user) {
                c.setHTML(this.get("template").one("#" + this.name + "-main-signed").getHTML());
                if (req && req.path) {
                    c.one("li.active").removeClass('active');
                    c.all("a").each(function(node) {
                        if (node.getAttribute("href") === req.path) {
                            node.ancestor("li").addClass('active');
                        }
                    });

                }
            }
            else {
                c.setHTML("This resource is not available!");
            }
            this.loadModules();
        }
    });
    
    
},'0.0.1',{ requires:['base','ashlesha-form','ashlesha-common-model']  });