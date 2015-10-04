// jshint maxparams: 6
;(function (w, d, Matrix, Smart, Player) {
    'use strict';

    w.IAGame = {
        matrix: new Matrix(3, 3, 3, 'ia-matrix-game'),
        smart: new Smart(),
        players: {
            nando: new Player('human', 'machine', 2),
            android: new Player('machine', 'human', 1)
        },
        domWaitingMachine: d.querySelector('#waiting-game'),
        domWrapperGame: d.querySelector('.ia-matrix-wrapper'),
        domLinksRules: d.querySelectorAll('.js-show-panel-rules'),
        domWrapperRules: d.querySelector('.demo-card-image'),
        resetGame: function (startPlayer) {
            var players = this.players;

            _.map(players, function (player) {
                player.resetPlayerStatus();
            });

            this.matrix.clearGrid();
            this.matrix.currentPlayerName = startPlayer.name;

            if (startPlayer.name === 'machine') {
                this.play(null, 'machine');
            }
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
        // play on aviable last 3 turn player
        isAviableTurn: function (move, player) {
            return !_.isUndefined(player) &&
                    player.countTurn < 3 &&
                    this.matrix.isEmptyTurn.apply(this.matrix, move) &&
                    !_.isEqual(move, player.lastMove);
        },
        // last 3 player turn, discart one turn
        isNeedDiscartTurn: function (move, player) {
            return !_.isUndefined(player) &&
                    player.countTurn === 3 &&
                    this.matrix.getStatusGrid.apply(this.matrix, move) === player.matrix.status;
        },
        setBoardOnAviableTurn: function (move, player) {
            if (player.name === 'machine') {
                this.domWrapperGame.classList.add('waiting-game--fadein');
                // simulate delayed game, played by machine
                _.delay(_.bind(function () {
                    this.matrix.setStatusGrid(move[0], move[1], player);
                    this.domWrapperGame.classList.remove('waiting-game--fadein');
                }, this), 1000);

            } else {
                this.matrix.setStatusGrid(move[0], move[1], player);
            }
        },
        setBoardOnDiscartTurn: function (move, player) {
            if (player.name === 'machine') {
                this.domWrapperGame.classList.add('waiting-game--fadein');
                _.delay(_.bind(function () {
                    this.matrix.setStatusGrid(move[0], move[1], null);
                    // machine needs to autoplay game when discart turn
                    this.play(null, 'machine');
                }, this), 500);

            } else {
                this.matrix.setStatusGrid(move[0], move[1], null);
            }
        },
        // TODO
        checkHitsRow: function (/*row, player*/) {
            return 0;
        },
        // TODO
        checkHitsColumn: function (/*column, player*/) {
            return 0;
        },
        // TODO
        checkHitsDiagonal: function (/*row, column, player*/) {
            return 0;
        },
        isCheckedlineToWin: function (move, player) {
            var column = move[0],
                row = move[1],
                needHits = this.matrix.hits;

            return this.checkHitsRow(row, player) ===  needHits ||
                    this.checkHitsColumn(column, player) === needHits ||
                    this.checkHitsDiagonal(row, column, player) === needHits;
        },
        play: function (playerEvent, playerName) {
            var currentPlayer = _.find(this.players, { name: playerName }),
                /** @type {Array} move - coords of matrix player movement @see Player.setMove */
                move = currentPlayer.getMove.call(this, playerEvent),
                isPlayedBox = false;

            // play a Box
            if (this.isAviableTurn(move, currentPlayer)) {
                currentPlayer.setPlayerMove(move, +1);
                this.setBoardOnAviableTurn(move, currentPlayer);
                this.matrix.currentPlayerName = _.find(this.players, { name: currentPlayer.opponent }).name;
                isPlayedBox = true;

            // discart an own box
            } else if (this.isNeedDiscartTurn(move, currentPlayer)) {
                currentPlayer.setPlayerMove(move, -1);
                this.setBoardOnDiscartTurn(move, currentPlayer);

            // autoplay when machine turn do not play/discart corrent box
            } else if (playerName === 'machine')  {
                this.play(null, 'machine');
            }

            // on winner stop Game
            if (this.isCheckedlineToWin(move, currentPlayer)) {
                w.alert(currentPlayer.shoutOfVictory);
                currentPlayer.countWinner++;
                this.resetGame('machine');
            }
            return isPlayedBox;
        },
        init: function () {
            var human = this.players.nando,
                machine = this.players.android,
                starterPlayer = machine;

            // initalize aclarative pannels
            _.map(this.domLinksRules, function (link) {
                link.addEventListener('click', _.bind(function (evClick) {
                    evClick.preventDefault();
                    var toogle = evClick.currentTarget.dataset.toggleClass || 'close';
                    if (toogle === 'open') {
                        this.domWrapperGame.classList.add('hide-pannel');
                        this.domWrapperRules.classList.add('show--rules');

                    } else if (toogle === 'close') {
                        this.domWrapperRules.classList.remove('show--rules');
                        this.domWrapperGame.classList.remove('hide-pannel');
                    }
                }, this), false);
            }, this);

            // initialize game parameters
            Player.setGridCellClass('ia-matrix-game__cell-box ia-matrix-game__cell--fill', 'js-matrix-');
            Matrix.setGridCellClass('ia-matrix-game__cell-box', 'js-matrix-');
            human.setAssetSettings('Fuck Yeah!!!!', 'ia-matrix-game__cell--cross');
            machine.setAssetSettings('Machines can do the Work....', 'ia-matrix-game__cell--circle');
            // set functions to resolve movement of players
            human.setMove(this.getSelectedNextTurn);
            machine.setMove(this.getRandomNextTurn);
            // new game
            this.resetGame(starterPlayer);

            // initialize game interaction
            _.map(d.getElementsByClassName(this.matrix.cellClass), _.bind(function (cell) {
                cell.addEventListener('click', _.bind(function (evClick) {
                    // first play onclick human, if box isplayed then play machine
                    this.play(evClick, 'human') && this.play(null, 'machine');
                }, this), false);
            }, this));

            // Inti materialize loading, on machine turn
            this.domWaitingMachine.addEventListener('mdl-componentupgraded', function () {
                this.MaterialProgress.setProgress(45);
            });
        }
    };

    d.addEventListener('DOMContentLoaded', w.IAGame.init.bind(w.IAGame), false);
}(window, document, window.Matrix, window.Smart, window.Player));
