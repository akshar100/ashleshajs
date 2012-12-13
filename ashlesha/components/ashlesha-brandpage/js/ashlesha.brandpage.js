YUI().add('ashlesha-brandpage',function(Y) {
    

    
    
    Y.BrandPageModel = Y.Base.create("BrandPageModel", Y.CommonModel, [], {
        initializer: function() {
            Y.BrandPageModel.superclass.initializer.apply(this, [{
                attrs: {
                    
                    title: {
                        value: '',
                        validation_rules: "trim|required|min(3)"
                    },
                    description: {
                        value: '',
                        validation_rules: "trim|required|min(8)"
                    },
                    brand_name: {
                        value: '',
                        validation_rules: "trim|required|min(3)"
                    },
                    image: {
                        value: ''
                    },
                    approved: {
                        value: false 
                    }

                }}]);
        }
    });

    Y.CreateBrandPageView = Y.Base.create("CreateBrandPageView", Y.FormView, [], {
        altInitializer: function(auth) {
            var c = this.get("container"),
                t = this.get("template");

            if (auth && auth.user) {
                c.setHTML(t.one("#" + this.name + "-main-signed").getHTML());
            }
            this.loadModules();

        },
        onSubmit: function(e) {
            var model = new Y.BrandPageModel();
            model.set("type", model.name);
            this.startWait(e.target);
            model.on(["save", "error"], function() {
                this.endWait();
                Y.fire("navigate", {
                    action: "/"
                });
            }, this);
            model = this.plugModel(model);
            
            model.save();
            e.halt();
        }
    });

    Y.BrandPageList = Y.Base.create("BrandPageList", Y.AshleshaBaseList, [], {
        model: Y.BrandPageModel,
        comparator: function(model) {
            return -1 * model.get('created_at');
        }
    });

    Y.BrandPageListView = Y.Base.create("BrandPageListView", Y.AshleshaBaseView, [], {
        altInitializer: function(auth) {
            var c = this.get("container"),
                t = this.get("template"),
                btn = c.one(".searchBtn"),
                list = new Y.BrandPageList(),
                row = t.one("#BrandPageListView-item").getHTML();

            if (auth && auth.user) {
                c.setHTML(t.one("#" + this.name + "-main-signed").getHTML());
            }
            this.loadModules();
            list.on("load", function() {
                list.each(function(item) {
                    c.one(".pageList").append(
                    Y.Lang.sub(row, {
                        TITLE: item.get("title"),
                        DESCRIPTION: item.get("description"),
                        IMG: item.get("image"),
                        ID: item.get("_id")
                    }));
                });
                this.endWait();
            }, this);
            this.startWait(c.one(".pageList"));
            list.load();
        }
    });
    
    
    Y.BrandPageView = Y.Base.create("BrandPageView", Y.AshleshaBaseView, [], {
        altInitializer: function(auth) {
            var c = this.get("container"),
                t = this.get("template"),
                model = new Y.BrandPageModel(),
                pageID = this.get("pageID");
            console.log(pageID);
            this.startWait(c);
            model.on("load", function() {
                this.endWait();
                if (auth && auth.user) {
                    c.setHTML(Y.Lang.sub(t.one("#" + this.name + "-main-signed").getHTML(), {
                        TITLE: model.get("title"),
                        DESCRIPTION: model.get('description'),
                        IMG: model.get("image"),
                        ID: model.get("_id")
                    }));
                }
                this.loadModules();
            }, this);
            model.set("_id", pageID);
            model.set("id",pageID);
            model.load({
                "_id":pageID
            });


        }
    });
    
    
    
    
    
    
    
    
},'0.0.1',{ requires:['base','ashlesha-form','ashlesha-common-model']  });