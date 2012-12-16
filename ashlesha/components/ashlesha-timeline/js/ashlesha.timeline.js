YUI().add('ashlesha-timeline',function(Y) {
   
   /**
    * @component TimelineView 
    * Responsible for showing posts in an infinite scroll like list.
    */
   Y.TimeLineView = Y.Base.create("TimeLineView", Y.AshleshaBaseView, [], {
        events: {
            "a.pub-btn": {
                click: 'pubBtnClick'
            }
        },
        altInitializer: function(auth) {
            var c = this.get("container");


            if (auth.user) {
                this.setupTimeline(this.get("timelineType")); //Load the default timeline
            }
            else {
                c.setHTML("This resource is not available!");
            }
            this.loadModules();

        },
        /**
         * @method setupTimeline 
 		 * @param {String} tType
 		 * tType refers to the type of posts that can be loaded in this timeline. Timeline must be viewed as a higher level container
 		 * that lists number of posts. The posts themselves can be different.
         */
        setupTimeline: function(tType) {
            var c = this.get('container'),
                t = this.get('template');
            switch (tType) {

            case "wall":
                c.setHTML(Y.Lang.sub(t.one("#TimeLineView-default").getHTML(), {
                    HELPTEXT: "Your friend's have posted on your wall"
                }));
                c.one(".pub-btn").addClass('hide');

                c.one(".timeline-container").setHTML(new Y.PostListView({
                    tType: "publishing-page",
                    user: this.get("user")
                }).render().get("container"));
                break;
            case "brand-updates":
                c.setHTML(Y.Lang.sub(t.one("#TimeLineView-default").getHTML(), {
                    HELPTEXT: "your favourite brands are sharing with you"
                }));
                c.one(".pub-btn").addClass('hide');

                c.one(".timeline-container").setHTML(new Y.PostListView({
                    tType: "publishing-page",
                    user: this.get("user")
                }).render().get("container"));
                break;
            case "featured":
                c.setHTML(Y.Lang.sub(t.one("#TimeLineView-default").getHTML(), {
                    HELPTEXT: "@SITENAME@'s picks"
                }));
                c.one(".pub-btn").addClass('hide');

                c.one(".timeline-container").setHTML(new Y.PostListView({
                    tType: "publishing-page",
                    user: this.get("user")
                }).render().get("container"));
                break;
            case "wishlist":
                c.setHTML(Y.Lang.sub(t.one("#TimeLineView-default").getHTML(), {
                    HELPTEXT: "Whats on your wishlist ? Let others know."
                }));

                c.one(".create-post").setHTML(new Y.CreatePostView({
                    tType: "publishing-page",
                    user: this.get("user")
                }).render().get("container"));
                c.one(".timeline-container").setHTML(new Y.PostListView({
                    tType: "publishing-page",
                    user: this.get("user"),
                    query: this.get("query")
                }).render().get("container"));
                break;
             case "publishing-page":
             	c.setHTML(Y.Lang.sub(t.one("#TimeLineView-default").getHTML(), {
                    HELPTEXT: "Your timeline shows what your friends are publishing."
                }));

                c.one(".create-post").setHTML(new Y.CreatePostView({
                    tType: "publishing-page",
                    user: this.get("user")
                }).render().get("container"));
                
                c.one(".timeline-container").setHTML(new Y.PostListView({
                    tType: "publishing-page",
                    user: this.get("user"),
                    query: this.get("query")
                }).render().get("container"));
                break;

            default:

                //This is our regular timeline that shows posts from other people's publishing page
                c.setHTML(Y.Lang.sub(t.one("#TimeLineView-default").getHTML(), {
                    HELPTEXT: "You too can share with your friends."
                }));
                break;
            }


        },
        pubBtnClick: function(e) {
            var c = this.get("container"),
                create = c.one(".create-post");
            if (create) {
                create.toggleClass('hide');
                if (create.hasClass('hide')) {
                    e.target.set("text", "Publish");
                }
                else {
                    e.target.set("text", "Hide");
                }
            }
        }
    });

    
},'0.0.1',{ requires:['ashlesha-base-view','ashlesha-form','ashlesha-common-model','ashlesha-formview']  });