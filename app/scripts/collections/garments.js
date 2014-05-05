define([
  'underscore',
  'backbone',
  'models/garment'
  ], function(_, Backbone, Garment) {
    var Garments = Backbone.Collection.extend({

      model: Garment,

      url: 'FrontendWorktestData.json',

      /**
       * Listen to remove and calls updateOrder
       * @method initialize
       * @return
       */
      initialize: function() {
        this.listenTo(this, 'remove', this.updateOrder);
      },
      /**
       * Update the order value for the models.
       * @return
       */
      updateOrder: function() {
        _.each(this.models, function(object, index) {
          object.set('order', index + 1);
        });
      },
      /**
       * Sort the collection by a models order-value.
       * @method comparator
       * @param {Object} model
       * @return CallExpression
       */
      comparator: function(model) {
        return model.get('order');
      }
    });

    return Garments;

  });
