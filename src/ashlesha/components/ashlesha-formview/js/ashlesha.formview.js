YUI().add('ashlesha-formview', function(Y) {
    
     Y.FormView = Y.Base.create("FormView", Y.AshleshaBaseView, [], {
        events: {
            'button[type=submit]': {
                click: 'onSubmit'
            }

        },
        altInitializer: function(auth) {

        },
        onSubmit: function(e) {
            var items;
            e.halt();
            items = this.getFormItems();

        },
        getFormItems: function() {
            var items = [],
                nodes = this.get('container').all('.yui3-input-container');

            nodes.each(function(item) {
                items.push(Y.AshleshaBaseView.getByNode(item));
            });
            return items;
        },
        plugErrors: function(errors) {
            var items = this.getFormItems();
            Y.Array.each(items, function(item) {

                Y.Array.each(errors, function(error) {
                    if (error.field === item.get("field_name")) {
                        item.setErrorText(error.error.message);
                    }
                });
            });

        },
        plugModel: function(model) {
            var items = this.getFormItems();
            Y.Array.each(items, function(item) {
                model.set(item.get("field_name"), item.get("value"));
            });

            model.on("error", function(e) {
                this.clearErrors();
                this.plugErrors(e.error);
                this.endWait();
            }, this);
            model.on("save", function() {
                this.clearErrors();
                this.endWait();
            }, this);
            return model;
        },
        clearErrors: function() {
            var items = this.getFormItems();
            Y.Array.each(items, function(item) {
                item.clearError();
            });
        },
        plugValues: function(model) {
            var items = this.getFormItems();
            Y.Array.each(items, function(item) {
                item.setValue(model.get(item.get("field_name")));
            });
        }

    });
},'0.0.1',{
    requires:['base','ashlesha-form','ashlesha-common-model']
});