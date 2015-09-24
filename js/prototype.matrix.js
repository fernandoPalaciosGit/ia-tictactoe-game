;(function (w) {
    'use strict';

    w.Matrix = function (rows, columns, className) {
        var _initGrid = function () {
            this.grid = new Array(this.columns);

            for (var i = 0; i < this.rows; i++) {
                this.grid[i] = new Array(this.columns);
            }
        };

        this.grid = null;
        this.className = className || 'js-matrix-';
        this.rows = rows || 3;
        this.columns = columns || 3;
        /**
         * status from each movement
         */
        this.STATUS = {
            EMPTY: 0,
            CIRCLE: 1,
            CROSS: 2
        };
        _initGrid.call(this);
    };

    /**
     * coordenates : {className}-{column}-{row}
     */
    w.Matrix.prototype.clearGrid = function () {
        for (var i = 0; i < this.rows; i++) {
            for (var j = 0; j < this.columns; j++) {
                this.grid[i][j] = this.STATUS.EMPTY;
            }
        }
    };
}(window));
