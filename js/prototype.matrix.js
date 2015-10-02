;(function (w, d) {
    'use strict';

    /**
     * Matrix represents the game into board
     * @constructor Matrix
     * @param {Number} rows - number of rows
     * @param {Number} columns - number of columns¡
     * @param {HTMLElement} wrapperName - dom from matrix element game
     */
    w.Matrix = function (rows, columns, wrapperName) {
        var _initGrid = function () {
            this.grid = new Array(this.columns);

            for (var i = 0; i < this.rows; i++) {
                this.grid[i] = new Array(this.columns);
            }
        };

        this.wrapperGame = d.getElementsByClassName(wrapperName)[0];
        this.rows = rows || 3;
        this.columns = columns || 3;

        /**
         * Dinamic game properties
         * @property {Array} grid - represent the status players onto the board
         * @property {String} currentPlayer - @see Player.name
         */
        this.grid = null;
        this.currentPlayerName = null;
        _initGrid.call(this);
    };

    w.Matrix.prototype.getCell = function (coordX, coordY) {
        return this.wrapperGame.getElementsByClassName('js-matrix-' + coordX + coordY)[0];
    };

    w.Matrix.prototype.getStatusGrid = function (coordX, coordY) {
        return this.grid[coordX][coordY];
    };

    w.Matrix.prototype.setStatusGrid = function (coordX, coordY, player) {
        this.grid[coordX][coordY] = !_.isNull(player) ? player.matrix.status : 0;
        this.getCell(coordX, coordY).className = !_.isNull(player) ?
            player.getClass(coordX , coordY) : this.getClass(coordX , coordY);
    };

    w.Matrix.prototype.getClass = function (coordX, coordY) {
        return [this.cellClass, this.cellHook + coordX + coordY].join(' ');
    };

    /**
     * Create own matrix css classes for board game
     * @function setGridCellClass
     * @memberof Matrix
     * @static
     */
    w.Matrix.setGridCellClass = function (cellClass, cellHook) {
        this.prototype.cellClass = cellClass;
        this.prototype.cellHook = cellHook;
    };

    w.Matrix.prototype.isEmptyTurn = function (coordX, coordY) {
        return this.grid[coordX][coordY] === 0;
    };

    /**
     * Set grid to initial Status
     */
    w.Matrix.prototype.clearGrid = function () {
        this.currentPlayerName = null;

        for (var x = 0; x < this.rows; x++) {
            for (var y = 0; y < this.columns; y++) {
                this.setStatusGrid(x, y, null);
            }
        }
    };
}(window, document));
