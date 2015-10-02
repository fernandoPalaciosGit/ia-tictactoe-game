// jshint maxparams: 6
;(function (w, d, Matrix, Smart, Player) {
    'use strict';

    var IAGame = {
        matrix: new Matrix(3, 3, 'ia-matrix-game'),
        smart: new Smart(),
        players: {
            android: new Player('machine', 'human', 1, 'ia-matrix-game__cell--circle'),
            nando: new Player('human', 'machine', 2, 'ia-matrix-game__cell--cross')
        },
        resetGame: function (startPlayer) {
            var players = this.players;

            _.map(players, function (player) {
                player.resetPlayerStatus();
            });
            this.matrix.clearGrid();
            this.matrix.currentPlayerName = startPlayer.name;
        },
        getRandomNextTurn: function () {
            return this.smart.getRandomEmptyCell(this.matrix);
        },
        getSelectedNextTurn: function (evClick) {
            var targetCell = evClick.currentTarget,
                targetDataGrid = _.toArray(targetCell.dataset.cellGrid),
                cellX = Number.parseInt(targetDataGrid[0], 10),
                cellY = Number.parseInt(targetDataGrid[1], 10);

            return [cellX, cellY];
        },
        play: function (ev) {
            var matrix = this.matrix,
                currentPlayer = _.find(this.players, { name: this.matrix.currentPlayerName }),
                move = currentPlayer.getMove.call(this, ev),
                isPlayedBox = false;

            if (matrix.isAviableTurn.apply(matrix, move) && !_.isUndefined(currentPlayer)) {
                move.push(currentPlayer);
                matrix.setStatusGrid.apply(matrix, move);
                currentPlayer.setPlayerMove.apply(currentPlayer, move);
                matrix.currentPlayerName = _.find(this.players, { name: currentPlayer.opponent }).name;
                isPlayedBox = true;
            }

            return isPlayedBox;
        },
        init: function () {
            var machine = this.players.android,
                human = this.players.nando,
                starterPlayer = machine;

            // initialize game parameters
            Player.setGridCellClass('ia-matrix-game__cell-box ia-matrix-game__cell--fill', 'js-matrix-');
            Matrix.setGridCellClass('ia-matrix-game__cell-box', 'js-matrix-');
            this.resetGame(starterPlayer);
            human.setMove(this.getSelectedNextTurn);
            machine.setMove(this.getRandomNextTurn);

            // initialize game interaction
            if (starterPlayer.name === 'machine') {
                this.play();
            }

            _.map(d.getElementsByClassName(this.matrix.cellClass), _.bind(function (cell) {
                cell.addEventListener('click', _.bind(function (ev) {
                    // first play onclick human, if box isplayed then play machine
                    this.play(ev) && this.play();
                }, this), false);
            }, this));
        }
    };

    d.addEventListener('DOMContentLoaded', IAGame.init.bind(IAGame));
}(window, document, window.Matrix, window.Smart, window.Player));
