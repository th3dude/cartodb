var Polyglot = require('node-polyglot');
var _ = require('underscore');
var $ = require('jquery');
require('dashboard/data/backbone/sync-options');

var Locale = require('../locale/index');
var AuthenticatedUser = require('dashboard/data/authenticated-user-model');
var UserModel = require('dashboard/data/user-model');
var ConfigModel = require('dashboard/data/config-model');
var UserSettingsView = require('dashboard/components/navbar/user-settings-view');
var UserIndustriesView = require('dashboard/components/navbar/user-industries-view');
var ScrollToFix = require('dashboard/util/scroll-tofixed-view');
var FavMapView = require('dashboard/views/public-profile/fav-map-view');
var Feed = require('dashboard/views/public-profile/feed-view');

var ACTIVE_LOCALE = window.ACTIVE_LOCALE || 'en';
var polyglot = new Polyglot({
  locale: ACTIVE_LOCALE, // Needed for pluralize behaviour
  phrases: Locale[ACTIVE_LOCALE]
});
window._t = polyglot.t.bind(polyglot);

var configModel = new ConfigModel(
  _.defaults(
    {
      base_url: window.base_url
    },
    window.config
  )
);

$(function () {
  var scrollableHeader = new ScrollToFix({ // eslint-disable-line
    el: $('.js-Navmenu')
  });

  var authenticatedUser = new AuthenticatedUser();

  authenticatedUser.on('change', function (model) {
    if (model.get('user_data')) {
      var user = new UserModel(authenticatedUser.attributes.user_data, {
        configModel: configModel
      });

      var userSettingsView = new UserSettingsView({
        el: $('.js-user-settings'),
        model: user
      });
      userSettingsView.render();
    }
  });

  authenticatedUser.fetch();

  var userIndustriesView = new UserIndustriesView({ // eslint-disable-line
    el: $('.js-user-industries')
  });

  var favMapView = new FavMapView(window.favMapViewAttrs);
  favMapView.render();

  var feed = new Feed({
    el: $('.js-feed'),
    config: configModel,
    authenticatedUser: authenticatedUser
  });

  feed.render();
});
