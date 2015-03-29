angular.module('appServices')
	.service('gameStorage', ['$http', function ($http) {
		'use strict';

		var cache = (function(){
			return {
				invalidate: function(){
					delete localStorage['games'];
				},
				get: function(){
					var games = localStorage['games'];
					if(games){
						return JSON.parse(games);
					}
				},
				set: function(games){
					localStorage['games'] = JSON.stringify(games);
				}
			}
		})();

		function getById(id){
			return $http.get('/api/games/' + id);
		}

		return {
			get: function (options) {
				if(options && options.id){
					return getById(options.id);
				}

				var games = cache.get();
				if(games){
					return {
						success: function(callback){
							callback(games);
						}
					}
				}

				var httpPromise = $http.get('/api/games');

				httpPromise.then(function(result){
					cache.set(result.data);
				});

				return httpPromise;
			},

			delete: function (game) {
				cache.invalidate();
				return $http.delete('/api/games/' + game._id);
			},

			post: function (game) {
				cache.invalidate();
				return $http.post('/api/games', game);
			},

			put: function(game) {
				cache.invalidate();
				return $http.put('/api/games/' +  game._id, game);
			}
		};
	}]);
