angular.module('app.routes', [])
.config(function($stateProvider, $urlRouterProvider) {
  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider
    .state('login', {
      url: '/login',
      templateUrl: 'templates/login.html',
      controller: 'loginCtrl'
    })
    .state('register', {
      url: '/register',
      templateUrl: 'templates/register.html',
      controller: 'registerCtrl'
    })
    .state('home', {
      url: '/home',
      templateUrl: 'templates/home.html',
      controller: 'homeCtrl'
    })
    .state('ourStory', {
      url: '/ourstory',
      templateUrl: 'templates/ourStory.html',
      controller: 'ourStoryCtrl'
    })
    .state('calendar', {
      url: '/calendar',
      templateUrl: 'templates/calendar.html',
      controller: 'calendarCtrl'
    })
    .state('giftCatalog', {
      url: '/giftcatalog',
      templateUrl: 'templates/giftCatalog.html',
      controller: 'giftCatalogCtrl'
    })
    .state('testimonials', {
      url: '/testimonials',
      templateUrl: 'templates/testimonials.html',
      controller: 'testimonialsCtrl'
    })
    .state('countDown', {
      url: '/countdown',
      templateUrl: 'templates/countDown.html',
      controller: 'countDownCtrl'
    })
    .state('memories', {
      url: '/memories',
      templateUrl: 'templates/memories.html',
      controller: 'memoriesCtrl'
    })
    .state('offers', {
      url: '/offers',
      templateUrl: 'templates/offers.html',
      controller: 'offersCtrl'
    })
    .state('games', {
      url: '/games',
      templateUrl: 'templates/games.html',
      controller: 'gamesCtrl'
    })
    .state('gallery', {
      url: '/gallery',
      templateUrl: 'templates/gallery.html',
      controller: 'galleryCtrl'
    })
    ;
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/login');
});
