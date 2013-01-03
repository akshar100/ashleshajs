YUI().add('ashlesha-import-contacts',function(Y) {
    
    Y.AshleshaImportContactsView = Y.Base.create("AshleshaImportContactsView", Y.AshleshaBaseView, [], {
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
    
},'0.0.1',{ requires:['base','ashlesha-form','ashlesha-common-model']  });