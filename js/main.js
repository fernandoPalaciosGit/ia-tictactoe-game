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
        domWrapperRules: d.querySelector('.ia-rules-card'),
        domWrapperWinner: d.querySelector('.ia-winner-card'),
        domActionRefreshGame: d.querySelectorAll('.ia-refresh-game'),
        domFooter: d.querySelector('.ia-main-footer'),
        domBadgeds: d.querySelector('.ia-gamer-badges'),
        formConfigGame: d.getElementById('config-game-actions'),
        continueGame: function (ev) {
            var playerName = ev.currentTarget.dataset.refreshGamer;

            ev.preventDefault();
            _.map(this.players, function (player) {
                player.resetPlayerStatus();
            });
            this.domWrapperWinner.classList.remove('show--poup');
            this.domFooter.classList.remove('hide-pannel');
            this.domWrapperGame.classList.remove('waiting-game--fadein');
            this.refreshGame(playerName);
        },
        resetGame: function (ev) {
            var playerName = ev.currentTarget.dataset.refreshGamer;

            ev.preventDefault();
            _.map(this.players, function (player) {
                player.resetPlayerGame();
                this.domBadgeds.querySelector('[data-gamer-name=' + player.name + ']').dataset.badge = player.countWinner;
            }, this);
            this.refreshGame(playerName);
        },
        refreshGame: function (playerName) {
            this.matrix.clearGrid();
            this.matrix.currentPlayerName = playerName;

            if (playerName === 'machine') {
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
            var isNeedToPlay = !_.isUndefined(player) && player.countTurn < 3,
                isLegalMove = this.matrix.isEmptyTurn.apply(this.matrix, move) && !_.isEqual(move, player.lastMove),
                isMoveToCompleteMachine = false,
                isStrategyMachine = isNeedToPlay && player.name === 'machine',
                moveToComplete = [],
                opponent = _.find(this.players, { name: player.opponent });

            // IA machine : check best oportunity for win
            if (isStrategyMachine) {
                moveToComplete = checkManager.getMoveTocompleteLine(player, this.matrix) ||
                        checkManager.getMoveTocompleteLine(opponent, this.matrix);
                isMoveToCompleteMachine = _.isArray(moveToComplete) && !_.isEqual(moveToComplete, player.lastMove);

                // change value of movement (reference) when is priority complete line
                if (isMoveToCompleteMachine) {
                    move[0] = moveToComplete[0];
                    move[1] = moveToComplete[1];
                }
            }

            return isNeedToPlay && (isMoveToCompleteMachine || isLegalMove);
        },
        // MOVEMENT : discart one turn
        isNeedDiscartTurn: function (move, player) {
            var opponent = _.find(this.players, { name: player.opponent }),
                isNeedToDiscart = !_.isUndefined(player) && player.countTurn === 3,
                isLegalMove =
                    this.matrix.getStatusGrid.apply(this.matrix, move) === player.matrix.status &&
                    (!checkManager.isCellUnBlockLine(move, opponent, this.matrix) ||
                    checkManager.isCheckedlineToComplete(move, opponent, this.matrix, 1)),
                isStrategyMachine =
                    isNeedToDiscart &&
                    player.name === 'machine' &&
                    _.isArray(checkManager.getMoveTocompleteLine(opponent, this.matrix)),
                moveTodiscart = [],
                isMoveToDiscartMachine = false;

            // for the case where priority is not complete line, the random motion is checked
            if (isStrategyMachine) {
                moveTodiscart = checkManager.getMoveTodiscartLine(player, this.matrix);
                isMoveToDiscartMachine =
                    _.isArray(moveTodiscart) &&
                    this.matrix.getStatusGrid.apply(this.matrix, moveTodiscart) === player.matrix.status;

                // change value of movement (reference) when is priority complete line
                if (isMoveToDiscartMachine) {
                    move[0] = moveTodiscart[0];
                    move[1] = moveTodiscart[1];
                }
            }

            return isNeedToDiscart && (isMoveToDiscartMachine || isLegalMove);
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
                    if (checkManager.isCheckedlineToComplete(move, currentPlayer, this.matrix, this.matrix.hits)) {
                        ticTacToeUtils.triggerPlayWinner(currentPlayer.name);

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
        showWinnerGame: function (evPlay) {
            var data = evPlay.detail,
                playerName = data.playerName,
                winnerPlayer = _.find(this.players, { name: playerName });

            winnerPlayer.countWinner++;
            this.domBadgeds.querySelector('[data-gamer-name=' + playerName + ']').dataset.badge = winnerPlayer.countWinner;
            this.domWrapperWinner.querySelector('.shout-text').innerText = winnerPlayer.shoutOfVictory;
            this.domWrapperWinner.querySelector('.ia-refresh-game').dataset.refreshGamer = winnerPlayer.opponent;
            this.domWrapperGame.classList.add('waiting-game--fadein');
            this.domFooter.classList.add('hide-pannel');
            this.domWrapperWinner.classList.add('show--poup');
        },
        play: function (evPlay) {
            var data = evPlay.detail,
                currentPlayer = _.find(this.players, { name: data.playerName }),
                /** @type {Array} move - coords of matrix player movement @see Player.setMove */
                move = currentPlayer.getMove.call(this, data.playerEvent);

            // play a Box
            if (this.isAviableTurn(move, currentPlayer)) {
                ticTacToeUtils.triggerCompleteTurn(currentPlayer.name, move);

            // discart an own box
            } else if (this.isNeedDiscartTurn(move, currentPlayer)) {
                ticTacToeUtils.triggerDiscartTurn(currentPlayer.name, move);

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
            _.map(d.getElementsByClassName(this.matrix.cellClass), function (cell) {
                cell.addEventListener('click', _.bind(ticTacToeUtils.triggerPlayTurn, this, 'human'), false);
            }, this);
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
                this.domBadgeds.classList.remove('hide-pannel');
                ticTacToeUtils.toogleInfoViewsByData('toggle-info-element', 'ia-matrix-wrapper');
                this.domFooter.querySelector('.ia-reset-game-wrapper').classList.remove('hide-pannel');
                this.domFooter.querySelector('.ia-refresh-game').dataset.refreshGamer = starterPlayer.name;
                this.domBadgeds.classList.remove('hide-pannel');
                this.initGameAssets(selectedConfig);
                this.refreshGame(starterPlayer.name);
            }
        },
        initGameDomElements: function () {
            ticTacToeUtils.toogleInfoViewsByData('toggle-info-element', 'config-game-actions');
            _.map(this.domActionRefreshGame, function (elReFresh) {
                var action = elReFresh.dataset.refreshAction;

                elReFresh.addEventListener('click', _.bind(w.IAGame[action], w.IAGame), false);
            });
            // initalize informative pannels
            _.map(this.domLinksRules, function (link) {
                link.addEventListener('click', _.bind(function (evClick) {
                    evClick.preventDefault();
                    var elTarget = evClick.currentTarget,
                        toggleAction = elTarget.dataset.toggleAction || 'close',
                        toggleEl = d.getElementById(elTarget.dataset.toggleInfoElement);

                    if (toggleAction === 'open') {
                        toggleEl.classList.add('hide-pannel');
                        this.domFooter.classList.add('hide-pannel');
                        this.domWrapperRules.classList.add('show--poup');

                    } else if (toggleAction === 'close') {
                        toggleEl.classList.remove('hide-pannel');
                        this.domFooter.classList.remove('hide-pannel');
                        this.domWrapperRules.classList.remove('show--poup');
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
            w.addEventListener('showWinner', _.bind(this.showWinnerGame, this), false);
        }
    };

    d.addEventListener('DOMContentLoaded', _.bind(w.IAGame.init, w.IAGame), false);
}(window, document, window.TicTacToeUtils, window.Matrix, window.Player, window.CheckMatrixManager));
