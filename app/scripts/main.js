require.config({
  paths:{
    "jquery": "vendor/jquery/dist/jquery",
    "underscore": "vendor/underscore-amd/underscore",
    "backbone": "vendor/backbone-amd/backbone"
  }
});

require(['views/app', 'backbone', 'underscore'], function(AppView, Backbone, _) {

  // Creates main application view.
  var appView = new AppView();

});
