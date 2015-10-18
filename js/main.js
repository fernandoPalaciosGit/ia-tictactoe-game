// jshint maxparams: 6
(function (w, d, ticTacToeUtils, Matrix, Player, checkManager) {
    'use strict';

    w.IAGame = {
        matrix: new Matrix(3, 3, 3, 'ia-matrix-game'),
        players: {
            guybrush: new Player('human', 'machine', 2),
            android: new Player('machine', 'human', 1)
        },
        domWaitingMachine: d.querySelector('#waiting-game'),
        domWrapperGame: d.getElementById('ia-matrix-wrapper'),
        domLinksRules: d.querySelectorAll('.js-show-panel-rules'),
        domWrapperRules: d.querySelector('.demo-card-image'),
        formConfigGame: d.getElementById('config-game-actions'),
        resetGame: function (startPlayer) {
            var players = this.players;

            _.map(players, function (player) {
                player.resetPlayerStatus();
            });

            this.matrix.clearGrid();
            this.matrix.currentPlayerName = startPlayer.name;

            if (startPlayer.name === 'machine') {
                ticTacToeUtils.triggerPlayTurn('machine');
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
        // MOVEMENT : play turn
        isAviableTurn: function (move, player) {
            var opponent = _.find(this.players, { name: player.opponent }),
                needPlayTurn =
                    !_.isUndefined(player) &&
                    player.countTurn < 3 &&
                    this.matrix.isEmptyTurn.apply(this.matrix, move) &&
                    !_.isEqual(move, player.lastMove);

            // IA machine : check best oportunity for win
            if (needPlayTurn && player.name === 'machine' && opponent.countTurn > 1) {
                // move to do line winner
                checkManager.completeLine(player, this.matrix) ||
                // move to cut line opponent
                checkManager.completeLine(opponent, this.matrix);
            }

            return needPlayTurn;
        },
        // MOVEMENT : discart one turn
        isNeedDiscartTurn: function (move, player) {
            var opponent = _.find(this.players, { name: player.opponent }),
                needDiscart =
                    !_.isUndefined(player) &&
                    player.countTurn === 3 &&
                    this.matrix.getStatusGrid.apply(this.matrix, move) === player.matrix.status;

            // IA for machine : do not discart the cell if opponent with this movement wins the line
            if (needDiscart && player.name === 'machine') {
                needDiscart = !checkManager.isCellUnBlockLine(move, opponent, this.matrix);
            }

            return needDiscart;
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
                    ticTacToeUtils.triggerPlayTurn('machine');
                }, this), 500);

            } else {
                this.matrix.setStatusGrid(move[0], move[1], null);
            }
        },
        playMovementTurn: function (evPlay) {
            var data = evPlay.detail,
                currentPlayer = _.find(this.players, { name: data.playerName }),
                move = data.preselectedMove;

            currentPlayer.setPlayerMove(move, +1);
            this.setBoardOnAviableTurn(move, currentPlayer)
                .then(_.bind(function () {
                    // change player to opponent
                    var opponent = _.find(this.players, { name: currentPlayer.opponent });

                    // on winner stop Game
                    if (checkManager.isCheckedlineToWin(move, currentPlayer, this.matrix)) {
                        // delay one instance for v8 let webkit render css
                        _.delay(_.bind(function () {
                            w.alert(currentPlayer.shoutOfVictory);
                            currentPlayer.countWinner++;
                            this.resetGame(opponent);
                        }, this), 100);

                        // the only time the next (opponent) player play
                    } else if (opponent.name === 'machine') {
                        ticTacToeUtils.triggerPlayTurn('machine');
                    }
                }, this));
        },
        playDiscartTurn: function (evPlay) {
            var data = evPlay.detail,
                currentPlayer = _.find(this.players, { name: data.playerName }),
                move = data.preselectedMove;

            currentPlayer.setPlayerMove(move, -1);
            this.setBoardOnDiscartTurn(move, currentPlayer);
        },
        play: function (evPlay) {
            var data = evPlay.detail,
                currentPlayer = _.find(this.players, { name: data.playerName }),
                /** @type {Array} move - coords of matrix player movement @see Player.setMove */
                move = currentPlayer.getMove.call(this, data.playerEvent);

            // play a Box
            if (this.isAviableTurn(move, currentPlayer)) {
                ticTacToeUtils.triggerCompleteTurn(data.playerName, move);

            // discart an own box
            } else if (this.isNeedDiscartTurn(move, currentPlayer)) {
                ticTacToeUtils.triggerDiscartTurn(data.playerName, move);

            // autoplay when machine turn do not play/discart corrent box
            } else if (data.playerName === 'machine')  {
                ticTacToeUtils.triggerPlayTurn('machine');
            }
        },
        // initialize configuration game parameters
        initGameAssets: function (humanConfig) {
            var human = this.players.guybrush,
                machine = this.players.android,
                chips = ['circle', 'cross'],
                gameConfig = {
                    classPlayer: {
                        human: 'ia-matrix-game__cell--' + humanConfig.chip,
                        machine: 'ia-matrix-game__cell--' + _.without(chips, humanConfig.chip)
                    },
                    classCell: {
                        player: ['ia-matrix-game__cell-box', 'ia-matrix-game__cell--fill'].join(' '),
                        board: ['ia-matrix-game__cell-box', 'ia-matrix-game__cell--empty'].join(' '),
                        hookJS: 'js-matrix-'
                    },
                    text: {
                        human: humanConfig.winnerText,
                        machine: 'Machines can do the Work....'
                    }
                };

            Player.setGridCellClass(gameConfig.classCell.player, gameConfig.classCell.hookJS);
            Matrix.setGridCellClass(gameConfig.classCell.board, gameConfig.classCell.hookJS);
            human.setAssetSettings(gameConfig.text.human, gameConfig.classPlayer.human);
            machine.setAssetSettings(gameConfig.text.machine, gameConfig.classPlayer.machine);
            // set functions to resolve movement of players
            human.setMove(this.getSelectedNextTurn);
            machine.setMove(this.getRandomNextTurn);

            // initialize game interaction
            _.map(d.getElementsByClassName(this.matrix.cellClass), _.bind(function (cell) {
                cell.addEventListener('click', _.bind(ticTacToeUtils.triggerPlayTurn, this, 'human'), false);
            }, this));
        },
        initGameSettings: function (ev) {
            var domForm = this.formConfigGame,
                playerStarter = domForm.playerStarter.options[domForm.playerStarter.selectedIndex],
                playerChip = domForm.playerChip.options[domForm.playerChip.selectedIndex],
                playerGrunt = domForm.playerGrunt,
                selectedConfig = {
                    playerName: playerStarter.value,
                    chip: playerChip.value,
                    winnerText: playerGrunt.value
                },
                starterPlayer = _.find(this.players, { name: selectedConfig.playerName });

            ev.preventDefault();

            if (this.formConfigGame.checkValidity()) {
                domForm.classList.add('hide-pannel');
                this.domWrapperGame.classList.remove('hide-pannel');
                _.map(d.querySelectorAll('[data-toggle-info-element]'), function (link) {
                    link.dataset.toggleInfoElement = 'ia-matrix-wrapper';
                });
                this.initGameAssets(selectedConfig);
                this.resetGame(starterPlayer);
            }
        },
        initGameDomElements: function () {
            // initalize informative pannels
            _.map(this.domLinksRules, function (link) {
                link.addEventListener('click', _.bind(function (evClick) {
                    evClick.preventDefault();
                    var elTarget = evClick.currentTarget,
                        toggleAction = elTarget.dataset.toggleAction || 'close',
                        toggleEl = d.getElementById(elTarget.dataset.toggleInfoElement);

                    if (toggleAction === 'open') {
                        toggleEl.classList.add('hide-pannel');
                        this.domWrapperRules.classList.add('show--rules');

                    } else if (toggleAction === 'close') {
                        toggleEl.classList.remove('hide-pannel');
                        this.domWrapperRules.classList.remove('show--rules');
                    }
                }, this), false);
            }, this);

            // Inti materialize loading, on machine turn
            this.domWaitingMachine.addEventListener('mdl-componentupgraded', function () {
                this.MaterialProgress.setProgress(45);
            });
        },
        init: function () {
            this.initGameDomElements();
            // start game after choose form options game
            this.formConfigGame
                .querySelector('.js-submit-config-game')
                .addEventListener('click', _.bind(this.initGameSettings, this), false);
            // Public Events for play game
            w.addEventListener('playTurn', _.bind(this.play, this), false);
            w.addEventListener('completeTurn', _.bind(this.playMovementTurn, this), false);
            w.addEventListener('discartTurn', _.bind(this.playDiscartTurn, this), false);
        }
    };

    d.addEventListener('DOMContentLoaded', _.bind(w.IAGame.init, w.IAGame), false);
}(window, document, window.TicTacToeUtils, window.Matrix, window.Player, window.CheckMatrixManager));
