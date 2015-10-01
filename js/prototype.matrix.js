;(function (w, d) {
    'use strict';

    /**
     * create initial srtatus of matrix
     * @param rows number of rows
     * @param columns number of columns¡
     * @param wrapperName class dom from matrix element game
     */
    w.Matrix = function (rows, columns, wrapperName) {
        var _initGrid = function () {
            this.grid = new Array(this.columns);

            for (var i = 0; i < this.rows; i++) {
                this.grid[i] = new Array(this.columns);
            }
        };

        this.grid = null;
        this.wrapperGame = d.getElementsByClassName(wrapperName)[0];
        this.rows = rows || 3;
        this.columns = columns || 3;
        this.currentPlayerName = null;
        _initGrid.call(this);
    };

    /**
     * dom class name structure : {className}-{column}{row}
     */
    w.Matrix.prototype.getCell = function (coordX, coordY) {
        return this.wrapperGame.getElementsByClassName('js-matrix-' + coordX + coordY)[0];
    };

    w.Matrix.prototype.setStatusGrid = function (coordX, coordY, player) {
        this.grid[coordX][coordY] = !_.isNull(player) ? player.matrix.status : 0;
        this.getCell(coordX, coordY).className = !_.isNull(player) ?
            player.getClass(coordX , coordY) : this.getClass(coordX , coordY);
    };

    w.Matrix.prototype.getClass = function (coordX, coordY) {
        return [this.cellClass, this.cellHook + coordX + coordY].join(' ');
    };

    w.Matrix.setGridCellClass = function (cellClass, cellHook) {
        this.prototype.cellClass = cellClass;
        this.prototype.cellHook = cellHook;
    };

    w.Matrix.prototype.isAviableTurn = function (coordX, coordY) {
        return this.grid[coordX][coordY] !== 0;
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
