angular.module('appControllers')
    .controller('gameController', ['$scope', '$routeParams', '$location', 'gameStorage', function($scope, $routeParams, $location, $gameStorage){
        $scope.game = {};
        $gameStorage.get({ id: $routeParams.gameId }).success(function(game) {
            $scope.game = game;
            console.log(game);
            if(!game.whosTurn){
                $scope.game.whosTurn = 'X';
            }
        });

        $scope.delete = function(game){
            $gameStorage.delete(game).success(function(){
                $location.path('/');
            });
        }

        $scope.boardClicked = function(row, column){
            if($scope.game.complete){
                return;
            }
            var game = JSON.parse(JSON.stringify($scope.game));
            game.board[row][column] = $scope.game.whosTurn;

            var promise = $gameStorage.put(game);

            promise.success(function(game){
                $scope.game = game;
            });

            promise.error(function(){
                console.log('invalid move');
            })
        }
    }])
