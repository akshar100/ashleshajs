YUI().add('ashlesha-userpageview',function(Y) {
    
    
      Y.UserPageView = Y.Base.create("UserPageView", Y.AshleshaBaseView, [], {
        altInitializer: function(auth) {
            var c = this.get('container'),
                t = this.get("template"),
                targetUser = new Y.CommonModel({
                    _id: this.get("user_id")
                }),
                user = this.get("user"),
                relation = new Y.FriendshipView({
                    source: user,
                    target: targetUser,
                    user: user
                });


            targetUser.set("_id", this.get("user_id"));
            targetUser.on("load", function() {
                c.setHTML(Y.Lang.sub(t.one("#" + this.name + "-main-signed").getHTML(), {
                    USERNAME: targetUser.get("firstname") + " " + targetUser.get("lastname"),
                    IMG: targetUser.get("image")
                }));
                this.loadModules();
                c.one(".friend").setHTML(relation.render().get('container'));
            }, this);
            targetUser.load({
                _id: this.get("user_id")
            });


        }
    });

   
    Y.UserBlockView = Y.Base.create("UserBlockView", Y.AshleshaBaseView, [], {
        altInitializer: function(auth) {
            var c = this.get("container"),
                t = this.get("template"),
                m = this.get("model");
            c.setHTML(Y.Lang.sub(t.one("#" + this.name + "-signed-main").getHTML(), {
                NAME: m.get("firstname") + " " + m.get("lastname"),
                USER_URL: '/user/' + m.get("_id")
            }));

        }
    });

    Y.UserListView = Y.Base.create("UserListView", Y.AshleshaBaseView, [], {
        altInitializer: function(auth) {
            var c = this.get("container"),
                t = this.get("template"),
                user = this.get("user"),
                isSearchable = this.get("searchable") || true,
                self = this;
            if (auth) {
                c.setHTML(Y.Lang.sub(t.one("#" + this.name + "-signed-main").getHTML()));
                if (!isSearchable) {
                    c.one('.search').remove();
                }
                else {
                    //Search related code here please!
                }
                Y.api.invoke("/user/getFriends", {
                    user_id: user.get("_id")
                }, function(err, data) {
                    self.renderUsers(data);
                });
                this.loadModules();
            }
        },
        renderUsers: function(data) {
            var c = this.get("container").one('.userList');
            if (data.length === 0) {
                c.setHTML('<h4>No One to be found!</h4>');
            }
            else {
                Y.Array.each(data, function(item) {
                    c.append(new Y.UserBlockView({
                        model: new Y.Model(item),
                        user: this.get('user')
                    }).render().get('container'));
                }, this);
            }
        }
    });
    
    
    
    
},'0.0.1',{ requires:['base','ashlesha-form','ashlesha-common-model']  });