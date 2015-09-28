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
        setRandomNextTurn: function () {
            var nextCell = this.smart.getRandomEmptyCell(this.matrix),
                cellX = nextCell[0],
                cellY = nextCell[1];

            this.matrix.setStatusGrid(cellX, cellY, this.players);
        },
        setNextTurn: function (evClick) {
            var targetCell = evClick.currentTarget,
                targetDataGrid = _.toArray(targetCell.dataset.cellGrid),
                cellX = Number.parseInt(targetDataGrid[0], 10),
                cellY = Number.parseInt(targetDataGrid[1], 10);

            if (!this.matrix.isSelectedTurn(cellX, cellY)) {
                this.matrix.setStatusGrid(cellX, cellY, this.players);
                this.setRandomNextTurn();
            }
        },
        init: function () {
            var gridCells = d.getElementsByClassName(this.matrix.cellName);

            this.resetGame();
            this.setRandomNextTurn();
            _.map(gridCells, _.bind(function (cell) {
                cell.addEventListener('click', _.bind(this.setNextTurn, this), false);
            }, this));
        }
    };

    d.addEventListener('DOMContentLoaded', IAGame.init.bind(IAGame));
}(window, document, window.Matrix, window.Smart));
