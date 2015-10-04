;(function (w) {
    'use strict';

    /**
     * Player of the tictactoe game
     * @constructor Player
     * @param {String} playerName - name ID for player
     * @param {String} opponentName - name ID of player oponent
     * @param {Number} statusVal - mark the status refereence of player onto Matrix board
     * @param {String} cellClassName - ccs class refereence of player onto Matrix board
     */
    w.Player = function (playerName, opponentName, statusVal, cellClassName) {
        this.name = playerName;
        this.opponent = opponentName;
        this.matrix = {
            status: statusVal,
            class: cellClassName
        };

        /**
         * Dinamic game properties
         * @property {Array} lastMove - last position occupied by player turn
         * @property {Number} countTurn - number of turns
         * @property {Function} getMove - funtion to retrieve the position selected by the player
         */
        this.lastMove = null;
        this.countTurn = 0;
        /** @returns {Array} @this window.IAGame */
        this.getMove = null;
    };

    w.Player.prototype.setMove = function (fn) {
        this.getMove = fn || Function.constructor();
    };

    w.Player.prototype.setPlayerMove = function (coords, score) {
        this.lastMove = coords;
        this.countTurn += score;
    };

    /**
     * Create own player css classes for board game
     * @function setGridCellClass
     * @memberof Player
     * @static
     */
    w.Player.setGridCellClass = function (cellClass, cellHook) {
        this.prototype.cellClass = cellClass;
        this.prototype.cellHook = cellHook;
    };

    w.Player.prototype.resetPlayerStatus = function () {
        this.lastMove = null;
        this.countTurn = 0;
        this.getMove = null;
    };

    w.Player.prototype.getClass = function (coordX, coordY) {
        return [this.cellClass, this.cellHook + coordX + coordY, this.matrix.class].join(' ');
    };
}(window));
