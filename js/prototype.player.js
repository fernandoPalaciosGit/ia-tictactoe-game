;(function (w) {
    'use strict';

    /**
     * Game turns
     * Status values for matrix cell
     */
    w.Player = function (playerName, opponentName, statusVal, cellClassName) {
        // Own properties
        this.name = playerName;
        this.opponent = opponentName;
        // estado y clase que ocupa el jugador en el tablero
        this.matrix = {
            status: statusVal,
            class: cellClassName
        };

        // Game Properties
        this.lastMove = null;
        this.countTurn = 0;
        this.getMove = null;
    };

    w.Player.prototype.setMove = function (fn) {
        this.getMove = fn || Function.constructor();
    };

    w.Player.prototype.setPlayerMove = function (coordX, coordY) {
        this.lastMove = [coordX, coordY];
        this.countTurn++;
    };

    // statis interface to share common grid properties
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
