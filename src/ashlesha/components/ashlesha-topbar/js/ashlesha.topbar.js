YUI().add('ashlesha-topbar', function(Y) {
    
    
    Y.TopBarView = Y.Base.create("TopBarView", Y.AshleshaBaseView, [], {
        altInitializer: function(auth) {
            var c = this.get('container'),
                t = this.get('template');
            if (!auth.user) { //if the user is not signed in
                c.setHTML(t.one('#TopBarView-main-unsigned').getHTML());
            } else { //if the user is signed in
                c.setHTML(Y.Lang.sub(t.one('#TopBarView-main-signed').getHTML(), {
                    EMAIL: auth.user.get("email")
                }));
            }
            this.loadModules();
        }
    });
    
    
}, '0.0.1', {
    requires:['base','app','common-models-store']
});