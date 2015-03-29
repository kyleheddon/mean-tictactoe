var mongoose = require('mongoose');

var Game = mongoose.model('Game', {
    board : Object,
    title: String,
    whosTurn: String,
    complete: Boolean,
    winner: String
});

Game.prototype.takeTurn = function(newBoard, callback){
    if(countFilled(this.board) == countFilled(newBoard)){
        return callback('invalid move');
    }

    this.board = newBoard;

    determineWinner.call(this);

    if(!this.complete){
        this.whosTurn = this.whosTurn == 'X' ? 'Y' : 'X';
    }

    this.save(callback);
}

function countFilled(board){
    var numFilled = 0;

    for(var i = 0; i < board.length; i++){
        for(var j = 0; j < board.length; j++){
            if(board[i][j]){
                numFilled++;
            }
        }
    }

    return numFilled;
}

function determineWinner(){
    lookForHorizontalWinner.call(this);
    lookForVerticleWinner.call(this);
    lookForDiagonalWinner.call(this);

    if(this.winner || countFilled(this.board) == 9){
        this.complete = true;
    }
}

function lookForHorizontalWinner(){
    var self = this;
    this.board.forEach(function(row){
        setWinnerBasedOnResult.call(self, row.join(''));
    })
}

function lookForVerticleWinner(){
    for(var i = 0; i < 3; i++){
        var result = this.board[0][i] + this.board[1][i] + this.board[2][i];
        setWinnerBasedOnResult.call(this, result);
    }
}

function lookForDiagonalWinner(){
    var result = this.board[0][0] + this.board[1][1] + this.board[2][2];
    if(setWinnerBasedOnResult.call(this, result)){
        return;
    }

    result = this.board[0][2] + this.board[1][1] + this.board[2][0];
    setWinnerBasedOnResult.call(this, result);
}

function setWinnerBasedOnResult(result){
    if(result == 'XXX'){
        this.winner = 'X';
    } else if(result == 'YYY'){
        this.winner = 'Y';
    }

    return this.winner != null;
}

module.exports = Game;
