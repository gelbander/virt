define([
  'underscore',
  'backbone',
  'models/garment',
  'jquery'
  ], function(_, Backbone, Garment, $) {

    var GarmentView = Backbone.View.extend({
      tagName: 'div',

      className: 'column',

      template: _.template($('#garmentTmpl').html()),

      events: {
        'click .delete': 'delete',
        'click .edit': 'setEditMode',
        'click .cancel': 'exitEditMode',
        'click .approve': 'saveDetails',
        'keyup input.title': 'keypressActions'
      },

      /**
       * Initialize function. Binds render on change,
       * add the particular view to the model etc.
       * @return
       * @method initialize
       * @return
       */
      initialize: function() {

        _.bindAll(this, "render");
        this.listenTo(this.model, 'remove', this.remove);

        this.model.bind('change', this.render);
        this.model.view = this;

        this.$el.attr("draggable", "true");

        this.$el.bind("dragstart", _.bind(this._dragStartEvent, this));
        this.$el.bind("dragover", _.bind(this._dragOverEvent, this));
        this.$el.bind("dragenter", _.bind(this._dragEnterEvent, this));
        this.$el.bind("dragleave", _.bind(this._dragLeaveEvent, this));
        this.$el.bind("drop", _.bind(this._dropEvent, this));
        this._draghoverClassAdded = false;

      },
      /**
       * Start the drag/drop process.
       * @param  {Object} e
       * @return
       */
      _dragStartEvent: function (e) {
          var data;
          if (e.originalEvent) {
            e = e.originalEvent;
          }
          e.dataTransfer.effectAllowed = "copy"; // default to copy
          data = this.dragStart(e.dataTransfer, e);

          window._backboneDragDropObject = null;
          if (data !== undefined) {
            window._backboneDragDropObject = data; // we cant bind an object directly because it has to be a string, json just won't do
          }
        },

      /**
       * Stores the model for the element that's being dragged.
       * @method dragStart
       * @param {Object} dataTransfer
       * @param {Object} e
       * @return {Object} model
       */
      dragStart: function (dataTransfer, e) {
        return {
          model: this.model
        };
      },

      /**
       * Calls when element in the drag/drop loop hovers over an element
       * @param  {Object} e
       * @return
       */
      _dragOverEvent: function (e) {
        if (e.originalEvent) {
          e = e.originalEvent;
        }
        var data = this._getCurrentDragData(e);

        if (this.dragOver(data, e.dataTransfer, e) !== false) {
          if (e.preventDefault) {
            e.preventDefault();
          }
          e.dataTransfer.dropEffect = 'copy'; // default
        }
      },

      /**
       * Calls when element in the drag/drop loop enters another element
       * @param  {Object} e
       * @return
       */
      _dragEnterEvent: function (e) {
        if (e.originalEvent) {
          e = e.originalEvent;
        }
        if (e.preventDefault) {
          e.preventDefault();
        }
      },

      /**
       * Calls when element in the drag/drop loop leaves an element.
       * @param  {Object} e
       * @return
       */
      _dragLeaveEvent: function (e) {
        if (e.originalEvent) {
          e = e.originalEvent;
        }
        var data = this._getCurrentDragData(e);
        this.dragLeave(data, e.dataTransfer, e);
      },

      /**
       * Calls when element in the drag/drop loop drops/is being released.
       * @param  {Object} e
       * @return
       */
      _dropEvent: function (e) {
        if (e.originalEvent) e = e.originalEvent;
        var data = this._getCurrentDragData(e);

        if (e.preventDefault) {
          e.preventDefault();
        }
        if (e.stopPropagation) {
          e.stopPropagation();
        }

        if (this._draghoverClassAdded) {
          this.$el.removeClass("draghover");
        }

        this.drop(data, e.dataTransfer, e);
      },

      /**
       * Returns the current data that is being dragged.
       * @param  {Object} e
       * @return {Object} data
       */
      _getCurrentDragData: function (e) {
        var data = null;
        if (window._backboneDragDropObject){
          data = window._backboneDragDropObject;
        }
        return data;
      },

      /**
       * Adds a class to the element currently getting hovered.
       * @method dragOver
       * @param {Object} data
       * @param {Object} dataTransfer
       * @param {Object} e
       * @return
       */
      dragOver: function (data, dataTransfer, e) { // optionally override me and set dataTransfer.dropEffect, return false if the data is not droppable
        this.$el.addClass("draghover");
        this._draghoverClassAdded = true;
      },

      /**
       * Removes the class from the element as the dragging element leaves.
       * @method dragLeave
       * @param {Object} data
       * @param {Object} dataTransfer
       * @param {Object} e
       * @return
       */
      dragLeave: function (data, dataTransfer, e) { // optionally override me
        if (this._draghoverClassAdded) this.$el.removeClass("draghover");
      },

      /**
       * Handles the process after a element has been dropped.
       * @method drop
       * @param {Object} data
       * @param {Object} dataTransfer
       * @param {Object} e
       * @return
       */
      drop: function (data, dataTransfer, e) {
        var src = data.model;
        var target = this.model;
        var tmpOrder = src.get('order');

        src.set('order', target.get('order'));
        target.set('order', tmpOrder);

        this.model.collection.sort();
        console.log('** Save new sort order to database.');

      },

      /**
       * Render the collections of garments.
       * @method render
       * @return ThisExpression
       */
      render: function() {
        this.$el.html(this.template(this.model.toJSON()));
        return this;
      },

      /**
       * Sets the area to "edit mode".
       * @return
       * @method setEditMode
       * @param {Object} e - Event
       * @return
       */
      setEditMode: function(e) {
        var $details = this.model.view.$el.find('.details');
        var $editSection = this.model.view.$el.find('.edit-section');
        $editSection.css('display', 'block');
        $details.css('display', 'none');

        // Autoselect input field.
        this.model.view.$el.find('input.title').select();
      },

      /**
       * Exit the "edit mode" view.
       * @return
       * @method exitEditMode
       * @param {Object} e
       * @return
       */
      exitEditMode: function(e) {
        $editSection = this.model.view.$el.find('.edit-section');
        $details = this.model.view.$el.find('.details');
        $editSection.css('display', 'none');
        $details.css('display', 'block');

        // Restore default value.
        this.model.view.$el.find('input.title').val(this.model.get('name'));
      },

      /**
       * Save a garments details, no ajax-request is made.
       * @return
       * @method saveDetails
       * @param {Object} e
       * @return
       */
      saveDetails: function(e) {
        var $inputField = this.model.view.$el.find('input.title');

        if (this.model.set({name: $inputField.val()}, {validate : true})) {
          this.exitEditMode();
          console.log('** Saving garment with id: ' + this.model.get('id') + ' to the database.');
        } else {
          $inputField.css('border', '1px solid red');
        }
      },

      /**
       * Delete a garment object.
       * @return
       * @method delete
       * @param {Object} e
       * @return
       */
      delete: function(e) {
        this.model.collection.remove(this.model);
        // ** this.model.destroy(); ** This will cause error since we use a local jsonfile.
        console.log('** Remove garment with id: ' + this.model.get('id') + ' from the database.');
      },

      /**
       * Bases on what key the user press it takes different actions.
       * @return
       * @method keypressActions
       * @param {Object} e
       * @return
       */
      keypressActions: function(e) {
        if (e.keyCode == 27) {
          this.exitEditMode();
        } else if (e.keyCode == 13) {
          this.saveDetails();
        }
      }
    });

    return GarmentView;

});
