define([
  'jquery',
  'underscore',
  'backbone',
  'collections/garments',
  'views/garmentView'
  ], function($, _, Backbone, Garments, GarmentView) {

  var GarmentsView = Backbone.View.extend({

    tagName: 'div',

    className: 'columns cf',

    /**
     * Initialize. Fetch and populate a collections of garments.
     * @method initialize
     * @return
     */
    initialize: function() {
      this.collection = new Garments();
      this.collection.bind('sort', this.render, this);
      this.collection.fetch();
    },

    /**
     * Render a list of single garment viwes.
     * @method render
     * @return ThisExpression
     */
    render: function() {
      this.$el.html('');
      this.collection.each(function(garment) {
        var garmentView = new GarmentView({model: garment});
        this.$el.append(garmentView.render().el);
      }, this);
      return this;
    }

  });

  return GarmentsView;

});
