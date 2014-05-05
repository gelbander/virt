define([
  'underscore',
  'backbone',
  'views/garmentsView',
  'jquery'
  ], function(_, Backbone, GarmentsView, $) {

  var App = Backbone.View.extend({

    el: $('#app'),

    /**
     * Initialize the application.
     * @method initialize
     * @return
     */
    initialize: function() {
      this.view = new GarmentsView();
      this.render();
    },

    /**
     * Render the "main-view".
     * @method render
     * @return
     */
    render: function() {
      this.$el.append(this.view.render().el);
    }

  });

  return App;

});
