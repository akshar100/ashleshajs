YUI().add('ashlesha-relation',function(Y) {
    
        Y.FriendshipView = Y.Base.create("FriendshipView", Y.AshleshaBaseView, [], {
        events: {
            "button.add-friend": {
                click: function() {
                    this.fire('relation', {
                        source: this.get("source"),
                        targetUser: this.get("target"),
                        relation: "add-friend"
                    });
                }
            },
            "button.withdraw-friend": {
                click: function() {
                    this.fire('relation', {
                        source: this.get("source"),
                        targetUser: this.get("target"),
                        relation: "withdraw-friend"
                    });
                }
            },
            "button.accept-friend": {
                click: function() {
                    this.fire('relation', {
                        source: this.get("source"),
                        targetUser: this.get("target"),
                        relation: "accept-friend"
                    });
                }
            },
            "button.remove-friend": {
                click: function() {
                    this.fire('relation', {
                        source: this.get("source"),
                        targetUser: this.get("target"),
                        relation: "remove-friend"

                    });
                }
            },
            "button.follow": {
                click: function() {
                    this.fire('relation', {
                        source: this.get("source"),
                        targetUser: this.get("target"),
                        relation: "follow"
                    });
                }
            },
            "button.unfollow": {
                click: function() {
                    this.fire('relation', {
                        source: this.get("source"),
                        targetUser: this.get("target"),
                        relation: "unfollow"
                    });
                }
            }
        },
        altInitializer: function(auth) {
            var c = this.get('container'),
                t = this.get("template"),
                user = this.get("user"),
                targetUser = this.get("target"),
                self = this;
            c.setHTML(t.one("#" + this.name + "-main-signed").getHTML());
            this.refresh();

            this.on("relation", function(e) {
                this.startWait(c);
                if (e.relation === "follow") {
                    Y.api.invoke("/relations/createRelation", {
                        source: e.source.get("_id"),
                        target: e.targetUser.get("_id"),
                        relation: "follow",
                        twoway: false
                    }, function() {
                        self.refresh.apply(self);
                    });

                }
                if (e.relation === "unfollow") {
                    Y.api.invoke("/relations/deleteRelation", {
                        source: e.source.get("_id"),
                        target: e.targetUser.get("_id"),
                        relation: "follow",
                        twoway: false
                    }, function() {
                        self.refresh.apply(self);
                    });
                }

                if (e.relation === "add-friend") {
                    Y.api.invoke("/relations/createRelation", {
                        source: e.source.get("_id"),
                        target: e.targetUser.get("_id"),
                        relation: "request-sent",
                        twoway: false,
                        reverseRelation: 'request-received'
                    }, function() {
                        self.refresh.apply(self);
                    });
                }
                if (e.relation === "remove-friend") {
                    Y.api.invoke("/relations/deleteRelation", {
                        source: e.source.get("_id"),
                        target: e.targetUser.get("_id"),
                        twoway: true,
                        relation: 'friend'
                    }, function() {
                        self.refresh.apply(self);
                    });
                }
                if (e.relation === "accept-friend") {
                    Y.api.invoke("/relations/deleteRelation", {
                        source: e.source.get("_id"),
                        target: e.targetUser.get("_id"),
                        reverseRelation: "request-sent",
                        twoway: false,
                        relation: 'request-received'
                    }, function() {
                        self.refresh.apply(self);
                    });

                    Y.api.invoke("/relations/createRelation", {
                        source: e.source.get("_id"),
                        target: e.targetUser.get("_id"),
                        relation: "friend",
                        twoway: false,
                        reverseRelation: 'friend'
                    }, function() {
                        self.refresh.apply(self);
                    });
                }
                if (e.relation === "withdraw-friend") {

                    Y.api.invoke("/relations/deleteRelation", {
                        source: e.source.get("_id"),
                        target: e.targetUser.get("_id"),
                        relation: "request-sent",
                        twoway: false,
                        reverseRelation: 'request-received'
                    }, function() {
                        self.refresh.apply(self);
                    });
                }
            });
        },
        refresh: function() {
            var c = this.get("container"),
                followBtn = c.one('.follow'),
                unfollowBtn = c.one('.unfollow'),
                friendBtn = c.one(".add-friend"),
                withdrawBtn = c.one('.withdraw-friend'),
                removeBtn = c.one('.remove-friend'),
                acceptBtn = c.one('.accept-friend'),
                source = this.get("source"),
                target = this.get("target"),
                self = this;

            if (source.get("_id") === target.get("_id")) {
                c.addClass('hide');
                return;
            }
            this.startWait(c);
            Y.api.invoke("/relations/getRelation", {
                source: source.get("_id"),
                target: target.get("_id")
            }, function(err, data) {
                c.all(".friend").addClass('hide');
                friendBtn.removeClass('hide');
                followBtn.removeClass('hide');
                unfollowBtn.addClass('hide');
                if (data && Y.Lang.isArray(data)) {
                    if (Y.Array.indexOf(data, "follow") >= 0) {

                        followBtn.addClass('hide');
                        unfollowBtn.removeClass('hide');
                    }

                    if (Y.Array.indexOf(data, "request-sent") >= 0) {
                        c.all(".friend").addClass('hide');
                        withdrawBtn.removeClass('hide');
                    }
                    if (Y.Array.indexOf(data, 'request-received') >= 0) {
                        c.all(".friend").addClass('hide');
                        acceptBtn.removeClass('hide');
                    }
                    if (Y.Array.indexOf(data, 'friend') >= 0) {
                        c.all(".friend").addClass('hide');
                        removeBtn.removeClass('hide');
                    }
                }
                self.endWait();
            });
        }
    });


   
    
    
},'0.0.1',{ requires:['base','ashlesha-form','ashlesha-common-model']  });