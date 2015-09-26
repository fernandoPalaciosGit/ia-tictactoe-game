;(function (w, d) {
    'use strict';

    /**
     * create initial srtatus of matrix
     * @param grid javascript object to logic game
     * @param rows number of rows
     * @param columns number of columns¡
     * @param wrapperName class dom from matrix element game
     * @param cellName class dom from cell element game
     */
    w.Matrix = function (rows, columns, wrapperName, cellName) {
        var _initGrid = function () {
            this.grid = new Array(this.columns);

            for (var i = 0; i < this.rows; i++) {
                this.grid[i] = new Array(this.columns);
            }
        };

        this.grid = null;
        this.wrapperGame = d.getElementsByClassName(wrapperName)[0];
        this.cellName = cellName;
        this.rows = rows || 3;
        this.columns = columns || 3;
        _initGrid.call(this);
    };

    /**
     * Status values for matrix cell
     */
    w.Matrix.STATUSCELL = {
        EMPTY: {
            value: 0,
            getClass: function (coordX, coordY) {
                return [this.cellName,
                    'js-matrix-' + coordX + coordY].join(' ');
            }
        },
        CIRCLE: {
            value: 1,
            getClass: function (coordX, coordY) {
                return [this.cellName,
                    'js-matrix-' + coordX + coordY,
                    'ia-matrix-game__cell--fill ia-matrix-game__cell--circle'].join(' ');
            }
        },
        CROSS: {
            value: 2,
            getClass: function (coordX, coordY) {
                return [this.cellName,
                    'js-matrix-' + coordX + coordY,
                    'ia-matrix-game__cell--fill ia-matrix-game__cell--cross'].join(' ');
            }
        }
    };

    /**
     * dom class name structure : {className}-{column}{row}
     */
    w.Matrix.prototype.getCell = function (coordX, coordY) {
        return this.wrapperGame.getElementsByClassName('js-matrix-' + coordX + coordY)[0];
    };

    w.Matrix.prototype.setStatusGrid = function (coordX, coordY, status) {
        this.grid[coordX][coordY] = status.value;
        this.getCell(coordX, coordY).className = status.getClass.call(this, coordX , coordY);
    };

    /**
     * Set grid to initial Status
     */
    w.Matrix.prototype.clearGrid = function () {
        for (var x = 0; x < this.rows; x++) {
            for (var y = 0; y < this.columns; y++) {
                this.setStatusGrid(x, y, this.constructor.STATUSCELL.EMPTY);
            }
        }
    };
}(window, document));
