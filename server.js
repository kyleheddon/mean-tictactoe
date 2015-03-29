var express = require('express');
var app = express();
var mongoose = require('mongoose');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var argv = require('optimist').argv;
var Game = require('./lib/game.js');

mongoose.connect('mongodb://localhost:8090/tictactoe');

app.use('/css', express.static(__dirname + '/css'));
app.use('/js', express.static(__dirname + '/js'));
app.use('/partials', express.static(__dirname + '/partials'));
app.use('/bower_components', express.static(__dirname + '/bower_components'));
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({'extended':'true'}));
app.use(bodyParser.json());
app.use(bodyParser.json({ type: 'application/vnd.api+json' }));
app.use(methodOverride());


app.get('/api/games', function(req, res) {
	Game.find(function(err, games) {
		if (err)
			res.send(err)

		res.json(games);
	});
});

app.get('/api/games/:id', function(req, res) {
	Game.findById(req.params.id, function(err, game) {
		if (err)
			res.send(err)

		res.json(game);
	});
});

app.post('/api/games', function(req, res) {
	Game.create({
		title : req.body.title,
		completed : false,
		board: [[null,null,null],[null,null,null],[null,null,null]],
		whosTurn: 'X'
	}, function(err, game) {
		if (err)
			return res.send(false);

		res.json(game);
	});
});

app.put('/api/games/:id', function(req, res) {
	Game.findById(req.params.id, function(err, game){
		game.takeTurn(req.body.board, function(err){
			if(err){
				return res.status(500).send('Invalid Move');
			}
			console.log(game);
			res.json(game);
		});
	});
});

app.delete('/api/games/:id', function(req, res) {
	Game.remove({
		_id : req.params.id
	}, function(err, todo) {
		if (err)
			res.send(err);

		res.json({success: true});
	});
});

app.get('/', function(req, res) {
	res.sendfile('index.html');
});

app.listen(8080, '127.0.0.1');
console.log("App listening on port 8080");
