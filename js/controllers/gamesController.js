angular.module('appControllers')
    .controller('gamesController', ['$scope', '$location', 'gameStorage', function($scope, $location, $gameStorage){
        $scope.games = {};
        $gameStorage.get().success(function(data) {
            $scope.games = data;
        });

        $scope.addGame = function(gameTitle){
            $gameStorage.post({title: gameTitle}).success(function(game){
                $location.path('/games/' + game._id);
            })
        }

    }]);
