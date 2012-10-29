YUI().add('ashlesha-postview',function(Y) {
    
    
     Y.PostModel = Y.Base.create("PostModel", Y.CommonModel, [], {
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
                    }

                }}]);
        }
    });

    Y.CommentModel = Y.Base.create("CommentModel", Y.CommonModel, [], {
        initializer: function() {
            Y.PostModel.superclass.initializer.apply(this, [{
                attrs: {

                    commenttext: {
                        value: '',
                        validation_rules: "trim|required|min(8)"
                    }

                }}]);
        }
    });


    Y.CreatePostView = Y.Base.create("CreatePostView", Y.FormView, [], {

        preModules: function() {
            return {
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
        altInitializer: function(auth) {
            var c = this.get('container'),
                t = this.get("template");
            c.setHTML(t.one("#" + this.name + "-main").getHTML());
            if (this.get("postTitle")) {
                c.one(".title").setHTML(this.get("postTitle"));
            }
            this.loadModules();

        },
        onSubmit: function(e) {
            var model = new Y.PostModel(),
                user = this.get("user"),
                owner_id = this.get('owner_id') || null;
            e.halt();
            try {
                this.startWait(e.target);
                model = this.plugModel(model); //Method used to map the Form to the Model
                model.on("error", function() {
                    Y.log("error found");
                }, this);
                model.on("save", function() {

                    this.postSuccess();
                }, this);
                model.set("type", "PostModel");
                model.set("tType", this.get("tType"));
                model.set("author_name", user.get("firstname"));
                model.set("owner_id", owner_id);
                model.set("author_id", user.get("_id"));
                model.save();

            } catch (ex) {
                Y.log(ex);
            }
        },
        postSuccess: function() {
            var c = this.get("container");
            c.one(".message-box").setHTML(this.get("template").one("#" + this.name + "-messagebox").getHTML());
        }
    });

    Y.PostList = Y.Base.create("PostList", Y.AshleshaBaseList, [], {
        model: Y.PostModel,
        comparator: function(model) {
            return -1 * model.get('created_at');
        }
    });

    Y.PostView = Y.Base.create("PostView", Y.AshleshaBaseView, [], {
        events: {
            ".like": {
                "click": function(e) {
                    var model = this.get("model"),
                        likes = model.get("likes") || [];
                    likes.push(this.get("user").get("_id"));
                    likes = Y.Array.unique(likes);
                    model.set("likes", likes);
                    model.save();
                    e.halt();
                }
            },
            ".unlike": {
                "click": function(e) {
                    var model = this.get("model"),
                        likes = model.get("likes") || [],
                        index = likes.indexOf(this.get("user").get("_id"));
                    if (index >= 0) {
                        likes.splice(index, 1);
                    }
                    model.set("likes", likes);
                    model.save();
                    e.halt();
                }
            },
            ".comments": {
                "click": function(e) {

                    this.toggleComments();
                    e.halt();
                }
            }

        },
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
                comment_count: model.get("comments_count")
            }));
            this.setupLikeUnlike();
            this.loadImages();
        },
        setupLikeUnlike:function(){
            var model = this.get("model"),
                c = this.get("container"),
                likes = model.get("likes"),
                user = this.get("user"),
                likeDiv, unlikeDiv;
                
                likeDiv = c.one(".like").ancestor("div");
                unlikeDiv = c.one(".unlike").ancestor("div");
                if (likes && typeof likes === "object" && likes.indexOf(user.get("_id")) >= 0) {
                    likeDiv.addClass("hide");
                    unlikeDiv.removeClass("hide");
                } else {
                    unlikeDiv.addClass("hide");
                    likeDiv.removeClass("hide");
                }
        },
        toggleComments: function() {
            var c = this.get("container");
            if (c.one(".commentsSection").hasClass('hide')) {
                this.showComments();
            } else {
                this.hideComments();
            }
        },
        showComments: function() {
            var c = this.get("container"),
                cs = c.one(".commentsSection"),
                btn = cs.one(".submitComment"),
                txt = new Y.TextAreaField({
                    label: 'Your Comment',
                    field_name: 'comment',
                    rows: 5,
                    cls: "span7",
                    user: this.get("user")
                }),
                model = this.get("model"),
                comments = model.get("comments"),
                user = this.get("user"),
                cl = c.one(".commentsList"),
                i, t = this.get("template").one("#"+this.name+"-CommentView").getHTML();
            cs.removeClass('hide');
            cs.one(".commentTextarea").setHTML(txt.render().get("container"));
            btn.on("click", function(e) {
                var cm = new Y.CommentModel(),
                    errors, error, comments;
                cm.set("commenttext", txt.get("value"));
                errors = cm.checkValidity();
                if (Y.Lang.isArray(errors)) {
                    error = errors.pop();
                    txt.setErrorText(error.error);
                    return;
                }
                else {
                    comments = model.get("comments");
                    comments.push({
                        commentText: txt.get('value'),
                        author_id: user.get("_id"),
                        author_name: user.get("firstname") + " " + user.get("lastname")

                    });
                    model.set("comments", comments);
                    this.startWait(btn);
                    model.once("save", function() {
                        this.showComments();
                    }, this);
                    model.save();
                }
            }, this);

            for (i = 0; i < comments.length; i++) {
                cl.append(Y.Lang.sub(t, {
                    TEXT: comments[i].commentText,
                    NAME: comments[i].author_name
                }));
            }
        },
        hideComments: function() {
            var c = this.get("container");
            c.one(".commentsSection").addClass('hide');
        },
        loadImages:function(){
            var c=this.get("container"),model = this.get("model"),image = model.get("image"),imgNode;
            
            if(image){
                imgNode = Y.Node.create('<img src="'+image+'">');
                imgNode.setStyle("max-width","200px");
                imgNode.setStyle("max-height","300px");
                imgNode.addClass('thumbnail');
                c.one(".images").append(imgNode);
            }
            
        },
        loadYoutubeVideos:function(){
            
        }
    });

    Y.PostListView = Y.Base.create("PostListView", Y.AshleshaBaseView, [], {
        altInitializer: function(auth) {
            var c = this.get('container'),
                t = this.get("template"),
                list = new Y.PostList(),
                self = this,
                query = this.get("query") || {};
            c.setHTML(t.one("#" + this.name + "-main").getHTML());
            this.startWait(c);
            list.on('load', function() {
                list.each(function(model) {
                    var post = new Y.PostView({
                        user: self.get("user"),
                        model: model,
                        template:self.get("template") 
                    });
                    c.one(".list-container").append(post.render().get("container"));
                });
                this.endWait();
            }, this);
            list.load(query);

        }
    });
    

    
    
},'0.0.1',{ requires:['base','ashlesha-form','ashlesha-common-model']  });