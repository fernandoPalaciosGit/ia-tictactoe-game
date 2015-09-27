;(function (w, d) {
    'use strict';

    /**
     * create initial srtatus of matrix
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
        this.turn = null;
        this.countTurn = 0;
        _initGrid.call(this);
    };

    /**
     * Game turns
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
            player: 'machine',
            opponent: 'human',
            value: 1,
            getClass: function (coordX, coordY) {
                return [this.cellName,
                    'js-matrix-' + coordX + coordY,
                    'ia-matrix-game__cell--fill ia-matrix-game__cell--circle'].join(' ');
            }
        },
        CROSS: {
            player: 'human',
            opponent: 'machine',
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

    w.Matrix.prototype.setStatusGrid = function (coordX, coordY) {
        this.setTurn(null);
        this.grid[coordX][coordY] = this.turn.value;
        this.getCell(coordX, coordY).className = this.turn.getClass.call(this, coordX , coordY);
    };

    /**
     * empty --> EMPTY
     * machine --> CIRCLE
     * human --> CROSS
     * null || undefined --> reverse turn
     * @param selectTurn turrn selected into game
     */
    w.Matrix.prototype.setTurn = function (selectTurn) {
        var turn = '',
            gameStatus = this.constructor.STATUSCELL;

        if (this.isInitializeTurn()) {
            this.countTurn++;

        } else {
            turn = gameStatus['EMPTY'];
        }

        // select especific turn
        if (_.isString(selectTurn)) {
            selectTurn = selectTurn.trim().toLowerCase();
            turn = _.find(gameStatus, { player: selectTurn });

        // reverse turn after the first round
        } else if (this.isInitializeTurn() && this.countTurn > 1) {
            turn = _.find(gameStatus, { player: this.turn.opponent });
        }

        this.turn = turn || this.turn;
    };

    w.Matrix.prototype.isInitializeTurn = function () {
        return !_.isNull(this.turn) && this.turn.value !== 0;
    };

    /**
     * Set grid to initial Status
     */
    w.Matrix.prototype.clearGrid = function () {
        this.turn = null;
        this.countTurn = 0;
        this.setTurn('empty');

        for (var x = 0; x < this.rows; x++) {
            for (var y = 0; y < this.columns; y++) {
                this.setStatusGrid(x, y);
            }
        }
    };
}(window, document));
