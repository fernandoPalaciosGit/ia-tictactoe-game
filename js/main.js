;(function (w, d, Matrix) {
    'use strict';

    var IAGame = {
        matrix: new Matrix(3, 3, 'ia-matrix-game', 'ia-matrix-game__cell-box'),
        players: {
            android: {
                name: 'machine',
                lastMove: null
            },
            nando: {
                name: 'human',
                lastMove: null
            }
        },
        resetGame: function () {
            _.map(this.players, function (player) {
                player.lastMove = null;
            });
            this.matrix.clearGrid();
            this.matrix.setTurn(this.players.android);
        },
        init: function () {
            this.resetGame();
            this.matrix.setStatusGrid(0, 2, this.players);
            this.matrix.setStatusGrid(1, 1, this.players);
        }
    };

    d.addEventListener('DOMContentLoaded', IAGame.init.bind(IAGame));
}(window, document, window.Matrix));
