YUI().add('ashlesha-places',function(Y) {
    
    
        Y.PlaceModel = Y.Base.create("PlaceModel", Y.CommonModel, [], {
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
                    place:{
                        value:'',
                        validation_rules:'required'
                    }
                    

                }}]);
        }
    });

    Y.CreatePlaceEntryView = Y.Base.create("CreatePlaceEntryView", Y.CreatePostView, [], {
        preModules: function() {
            return {
                ".place-item": {
                    view: "PlaceField",
                    config: {
                        label: "Place",
                        placeholder: "Type the place name",
                        rows: 2,
                        cls: "span9",
                        field_name: "place"
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
            var model = new Y.PlaceModel(),
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

    Y.PlaceView = Y.Base.create("PlaceView", Y.PostView, [], {
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
                place:model.get("place") && model.get("place").text
            }));
            this.setupLikeUnlike();
            this.loadImages();
            this.loadPlace();
        },
        loadPlace:function(){
            var place = this.get("model").get("place"),c = this.get("container").one(".place");
            
            
                YUI().use('yui3-gmaps', function(Y2) {
                    var gmap = new Y2.Gmap({
                        container: c
                    });
                    gmap.loadMap(place);
                    
                });
        }
    });


    Y.PlacesView = Y.Base.create("PlacesView", Y.AshleshaBaseView, [], {
        altInitializer: function(auth) {
            var c = this.get("container"),
                t = this.get("template"),
                user = this.get("user");
            if (auth) {
                c.setHTML(Y.Lang.sub(t.one("#" + this.name + "-main-signed").getHTML(), {
                    TITLE: this.get("title") || ""
                }));
                this.loadModules();
                this.on('loadPlaces',this.loadPlaces,this);
                this.fire("loadPlaces");
            }
        },
        loadPlaces:function(){
            
            var list = new Y.ModelList(), c = this.get("container"),user= this.get("user");
            c = c.one(".content");
            
            c.setHTML("");
            Y.api.invoke("/places/getPlacesByUser",{
                user_id:user.get("_id")
            },function(err,response){
                
                Y.Array.each(response,function(item){
                    list.add(new Y.PlaceModel(item));
                });
                list.each(function(item){
                    c.append(new Y.PlaceView({
                        model:item,
                        user:user
                    }).render().get("container"));
                });
                
            });
        }

    });
    
},'0.0.1',{ requires:['base','ashlesha-form','ashlesha-common-model','ashlesha-api']  });