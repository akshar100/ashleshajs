YUI().add('ashlesha-wardrobe',function(Y) {
    
     Y.WRListView = Y.Base.create("WRListView", Y.AshleshaBaseView, [], {
        altInitializer: function(auth) {
            var c = this.get('container'),
                t = this.get("template"),
                list = new Y.ModelList(),
                self = this,
                query = this.get("query") || {};
            c.setHTML(t.one("#" + this.name + "-main").getHTML());
            this.startWait(c);
            this.loadModules();
            this.on('wrload', function() {
            
                Y.api.invoke("/wardrobe/getEntriesByUserCollection",{
                    user_id:this.get("user").get("_id")
                },function(err,response){
                    list.add(response);
                
                     list.each(function(model) {
                        var post = new Y.WREntryView({
                            user: self.get("user"),
                            model: model,
                            template:t
                        });
                        c.one(".list-container").append(post.render().get("container"));
                    });
                    self.endWait();
                });
               
                
                
            }, this);
            this.fire("wrload");
            
        }
    });
    
    Y.WREntryView = Y.Base.create("WREntryView", Y.PostView, [], {
        altInitializer: function() {
            var c = this.get('container'),
                t = this.get("template"),
                model = this.get("model");
            c.setHTML(t.one("#" + this.name + "-main-signed").getHTML());
            if (model && model.get("created_at")) { //Check to see if the model is loaded. Not a very elegant one.
                this.modelLoaded();

            }
            else {
                model.on("load", this.modelLoaded, this);

                model.load();
            }
            model.on("save", this.modelLoaded, this);
        },
        modelLoaded: function() {
            var model = this.get("model"),
                c = this.get('container'),
                t = this.get('template'),
                date = new Date(model.get("created_at")),
                likes = model.get("likes"),
                user = this.get("user"),
                likeDiv, unlikeDiv;
            c.setHTML(Y.Lang.sub(t.one("#" + this.name + "-main-signed").getHTML(), {
                author_id: model.get('author_id'),
                author_name: model.get("author_name"),
                post_text: model.get("posttext"),
                created_at: date.getHours() + ":" + date.getMinutes() + " " + date.getDate() + "-" + date.getMonth() + "-" + date.getFullYear(),
                comment_count: model.get("comments_count"),
                brand_name:model.get("brand_name"),
                section_name:model.get("section_name")
            }));
            this.setupLikeUnlike();
            this.loadImages();
        }
    });

    Y.WardrobeView = Y.Base.create("WardrobeView", Y.AshleshaBaseView, [], {
        altInitializer: function(auth) {
            var c = this.get("container"),
                t = this.get("template"),
                area;

            if (auth && auth.user) {
                c.setHTML(t.one("#" + this.name + "-main-signed").getHTML());
                area = c.one(".wrcontent");
                area.setHTML(t.one("#" + this.name + "-section-container").getHTML());
                this.on("loadWardrobe", this.loadWardrobe, this);
                this.fire("loadWardrobe");
                this.on("loadSection", this.loadSection, this);


            }
        },
        loadWardrobe: function() {
            var self = this,
                t = this.get("template"),
                c = this.get("container"),
                li = t.one("#" + this.name + "-section-li").getHTML(),
                pane = t.one("#" + this.name + "-section-tab-pane").getHTML(),
                area = c.one(".wrcontent"),
                sections = area.one('.nav-tabs'),
                panes = area.one('.tab-content');

            Y.api.invoke("/wardrobe/getUserSections", {
                user_id: this.get("user").get("_id")
            }, function(err, response) {
                if (!err) {
                    Y.Object.each(response, function(value, key) {
                        var id = "i" + Math.floor(Math.random() * 10000);
                        sections.append(Y.Lang.sub(li, {
                            SECTION_NAME: key,
                            SECTION_ID: key,
                            ID: id
                        }));
                        panes.append(Y.Lang.sub(pane, {
                            SECTION_NAME: key,
                            SECTION_ID: key,
                            ID: id
                        }));

                        self.fire("loadSection", {
                            section: key
                        });

                    });


                    sections.all("a").on("click", function(e) {
                        var n = e.target,
                            panel, panels = panes.all("div.tab-pane");
                        e.halt();
                        sections.all("li").removeClass("active");
                        n.ancestor("li").addClass("active");
                        panels.removeClass("active");
                        panels.addClass("hide");
                        panel = panes.one(n.getAttribute("href"));
                        panel.removeClass("hide");
                        panel.addClass("active");

                    }, this);




                }
            });


        },
        loadSection: function(e) {
            var section = e.section,
                self = this,
                c = this.get("container"),
                sc = c.one("div[data-section-name=" + section + "]");
            
            sc.setHTML("");
            Y.api.invoke("/wardrobe/getSectionContent", {
                section: section,
                user_id: this.get("user").get("_id")
            }, function(err, response) {
                sc.setHTML("");
                Y.Array.each(response, function(item) {
                    sc.append(new Y.WREntryView({
                        model: new Y.WREntryModel(item),
                        user: self.get("user"),
                        template:self.get("template")
                    }).render().get("container"));
                });
            });
        }



    });

    Y.WREntryModel = Y.Base.create("WREntryModel", Y.CommonModel, [], {
        initializer: function() {
            Y.PostModel.superclass.initializer.apply(this, [{
                attrs: {

                    posttext: {
                        value: '',
                        validation_rules: "trim|required|min(8)"
                    },
                    image: {
                        value: ''
                    },
                    comments_count: {
                        value: 0
                    },
                    comments: {
                        value: []
                    },
                    likes: {
                        value: []
                    },
                    shares: {
                        value: []
                    },
                    tType: { //tType refers to the category of the post.
                        value: ''
                    },
                    section_name: { //Each entry belongs to a section. For example "Mobile Phones" is a section
                        value: '',
                        validation_rules: "trim|required"
                    },
                    brand_name: { //Each product may be associated with a brand_name
                        value: '',
                        validation_rules: "trim|required"
                    }




                }}]);
        }
    });




    Y.CreateWREntryView = Y.Base.create("CreateWREntryView", Y.CreatePostView, [], {
        preModules: function() {
            return {

                ".form-item-section": {
                    view: "FormItem",
                    config: {
                        label: "Section",
                        placeholder: "Type for prompt",
                        rows: 2,
                        cls: "span9",
                        field_name: "section_name",
                        ac: { //Autocomplete Configuration
                            resultHighlighter: 'phraseMatch',
                            source: ['Section 1', 'Section 2']
                        }
                    }
                },
                ".form-item": {
                    view: "TextAreaField",
                    config: {
                        label: " ",
                        placeholder: "type something....",
                        rows: 2,
                        cls: "span9",
                        field_name: "posttext"
                    }
                },
                ".form-item-product": {
                    view: "FormItem",
                    config: {
                        label: "Product",
                        placeholder: "Type for prompt",
                        rows: 2,
                        cls: "span9",
                        field_name: "brand_name",
                        ac: { //Autocomplete Configuration
                            resultHighlighter: 'phraseMatch',
                            source: ['Samsung Galaxy', 'iPhone']
                        }
                    }
                },
                ".file-upload": {
                    view: "FileUploadField",
                    config: {
                        label: " ",
                        cls: "span9",
                        field_name: "image",
                        placeholder: "Upload Photo"
                    }
                }
            };
        },
        onSubmit: function(e) {
            var model = new Y.WREntryModel(),
                user = this.get("user"),
                owner_id = this.get('owner_id') || null;
            e.halt();
            try {
                this.startWait(e.target);
                model = this.plugModel(model); //Method used to map the Form to the Model
                model.on("error", function() {
                    Y.log(arguments);
                }, this);
                model.on("save", function() {

                    this.postSuccess();
                }, this);
                model.set("type", model.name);
                model.set("tType", this.get("tType"));
                model.set("author_name", user.get("firstname"));
                model.set("owner_id", owner_id);
                model.set("author_id", user.get("_id"));
                model.save();

            } catch (ex) {
                Y.log(ex);
            }
        }
    });

    
    
},'0.0.1',{ requires:['base','ashlesha-form','ashlesha-common-model']  });