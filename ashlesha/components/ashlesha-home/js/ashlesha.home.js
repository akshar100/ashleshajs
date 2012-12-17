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
            
           	Y.on("UpdateUser",this.setupSidebar,this);
           	this.setupSidebar();
            this.loadModules();
        },
        setupSidebar:function(){
        	var c = this.get("container"),user= this.get("user");
            if (user) {
                c.setHTML(Y.Lang.sub(this.get("template").one("#" + this.name + "-main-signed").getHTML(), {
                    FIRSTNAME: user.get("firstname"),
                    LASTNAME: user.get("lastname"),
                    PROFILE_PIC: user.get("profile_pic") || "http://placehold.it/40x40x"
                }));
            }
            else {
                c.setHTML("This resource is not available!");
            }
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
    
    
},'0.0.1',{ requires:['ashlesha-base-view']  });