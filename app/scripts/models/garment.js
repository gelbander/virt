define(['backbone'], function() {

  var Garment = Backbone.Model.extend({

    defaults: {
      id: '',
      order: 'undefined',
      name: 'undefined',
      img: 'http://placehold.it/190x253'
    },

    /**
     * Validates a garment. The user has to fill atleast 1 character.
     * @method validate
     * @param {Object} attrs
     * @return false - If it doesn't validate.
     */
    validate: function(attrs) {
      if (!attrs.name) {
        return 'Every garment must have a name';
      }
    }

  });

  return Garment;

});
