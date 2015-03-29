var app = angular.module('tictactoe', [
    'ngRoute',
    'appControllers',
    'appServices'
]);

app.config(['$routeProvider',
    function($routeProvider) {
        $routeProvider.
            when('/', {
                templateUrl: 'partials/games.html',
                controller: 'gamesController'
            }).
            when('/games/:gameId', {
                templateUrl: 'partials/game.html',
                controller: 'gameController'
            }).
            otherwise({
                redirectTo: '/'
            });
}]);

angular.module('appControllers', []);
angular.module('appServices', []);
