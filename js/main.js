// jshint maxparams: 6
;(function (w, d, Matrix, Smart, Player) {
    'use strict';

    w.IAGame = {
        matrix: new Matrix(3, 3, 3, 'ia-matrix-game'),
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
        // select random movement for machine
        getRandomNextTurn: function () {
            var matrixIndexX = this.matrix.rows - 1,
                matrixIndexY = this.matrix.columns - 1;

            return [_.random(0, matrixIndexX), _.random(0, matrixIndexY)];
        },
        // retrieve on click movement for human
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
            var readyBoard = Promise.defer();

            if (player.name === 'machine') {
                this.domWrapperGame.classList.add('waiting-game--fadein');
                // simulate delayed game, played by machine
                _.delay(_.bind(function () {
                    this.matrix.setStatusGrid(move[0], move[1], player);
                    this.domWrapperGame.classList.remove('waiting-game--fadein');
                    readyBoard.resolve();
                }, this), 1000);

            } else {
                this.matrix.setStatusGrid(move[0], move[1], player);
                readyBoard.resolve();
            }

            return readyBoard.promise;
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
        checkHitsRow: function (row, player) {
            for (var i = 0, hits = 0; i < this.matrix.hits; i++) {
                hits += this.matrix.grid[i][row] === player.matrix.status ? 1 : 0;
            }

            return hits;
        },
        checkHitsColumn: function (column, player) {
            for (var i = 0, hits = 0; i < this.matrix.columns; i++) {
                hits += this.matrix.grid[column][i] === player.matrix.status ? 1 : 0;
            }

            return hits;
        },
        checkHitsDiagonal: function (diagonal, player) {
            var status = player.matrix.status,
                matrix = this.matrix.grid,
                hits = 0;

            hits += matrix[0][1 - diagonal] === status ? 1 : 0;
            hits += matrix[1][1] === status ? 1 : 0;
            hits += matrix[2][1 + diagonal] === status ? 1 : 0;
            return hits;
        },
        isCheckedlineToWin: function (move, player) {
            var column = move[0],
                row = move[1],
                needHits = this.matrix.hits;

            return this.checkHitsRow(row, player) ===  needHits ||
                    this.checkHitsColumn(column, player) === needHits ||
                    this.checkHitsDiagonal(1, player) === needHits ||
                    this.checkHitsDiagonal(-1, player) === needHits;
        },
        play: function (playerEvent, playerName) {
            var currentPlayer = _.find(this.players, { name: playerName }),
                /** @type {Array} move - coords of matrix player movement @see Player.setMove */
                move = currentPlayer.getMove.call(this, playerEvent),
                isPlayedBox = Promise.defer();

            // play a Box
            if (this.isAviableTurn(move, currentPlayer)) {
                currentPlayer.setPlayerMove(move, +1);
                this.setBoardOnAviableTurn(move, currentPlayer)
                    .then(_.bind(function () {
                        // change player to oponent
                        var oponentName = _.find(this.players, { name: currentPlayer.opponent });

                        // on winner stop Game
                        if (this.isCheckedlineToWin(move, currentPlayer)) {
                            w.alert(currentPlayer.shoutOfVictory);
                            currentPlayer.countWinner++;
                            this.resetGame(oponentName);

                        // the only time the next (oponent) player play
                        } else {
                            isPlayedBox.resolve(true);
                        }
                    }, this));

            // discart an own box
            } else if (this.isNeedDiscartTurn(move, currentPlayer)) {
                currentPlayer.setPlayerMove(move, -1);
                this.setBoardOnDiscartTurn(move, currentPlayer);
                isPlayedBox.resolve(false);

            // autoplay when machine turn do not play/discart corrent box
            } else if (playerName === 'machine')  {
                this.play(null, 'machine');
            }

            return isPlayedBox.promise;
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
                    this.play(evClick, 'human')
                        .then(_.bind(function (isPlayedTurn) {
                            isPlayedTurn && this.play(null, 'machine');
                        }, this));

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
