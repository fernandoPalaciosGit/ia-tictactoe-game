;(function (w, d, Matrix, Smart) {
    'use strict';

    var IAGame = {
        matrix: new Matrix(3, 3, 'ia-matrix-game', 'ia-matrix-game__cell-box'),
        smart: new Smart(),
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
        setRandomNextCell: function () {
            var nextCell = this.smart.getRandomEmptyCell(this.matrix),
                cellX = nextCell[0],
                cellY = nextCell[1];

            this.matrix.setStatusGrid(cellX, cellY, this.players);
        },
        init: function () {
            this.resetGame();
            this.setRandomNextCell();
            this.setRandomNextCell();
        }
    };

    d.addEventListener('DOMContentLoaded', IAGame.init.bind(IAGame));
}(window, document, window.Matrix, window.Smart));
