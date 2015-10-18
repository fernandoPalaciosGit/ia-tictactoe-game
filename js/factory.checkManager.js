window.CheckMatrixManager = ( function (ticTacToeUtils) {
    'use strict';

    var getCellLineEmpty = function (matrix, column, row) {
            var i, coords, cellEmpty = null;

            for (i = 0; i < matrix.hits; i++) {
                coords = (_.isNull(column) && !_.isNull(row)) ? [i, row] : [column, i];
                if (matrix.isEmptyTurn.apply(matrix, coords)) {
                    cellEmpty = coords;
                    break;
                }
            }

            return cellEmpty;
        },

        /**
         * Counters of line matches into cell
         *
         * {Function, Function, Function} countHitsRow countHitsColumn countHitsDiagonal
         * @param {Number, Number, Number} row column diagonal - line index into matrix
         * @param {Object} player - @see window.Player
         * @param {Object} matrix - @see window.Matrix
         * */
        countHitsRow = function (row, player, matrix) {
            var i, hits = 0;

            for (i = 0; i < matrix.hits; i++) {
                hits += matrix.grid[i][row] === player.matrix.status ? 1 : 0;
            }

            matrix.setWinnerCellHits('row', row, hits);
            return hits;
        },
        countHitsColumn = function (column, player, matrix) {
            var i, hits = 0;

            for (i = 0; i < matrix.columns; i++) {
                hits += matrix.grid[column][i] === player.matrix.status ? 1 : 0;
            }

            matrix.setWinnerCellHits('column', column, hits);
            return hits;
        },
        countHitsDiagonal = function (diagonal, player, matrix) {
            var status = player.matrix.status,
                grid = matrix.grid,
                hits = 0;

            hits += grid[0][1 - diagonal] === status ? 1 : 0;
            hits += grid[1][1] === status ? 1 : 0;
            hits += grid[2][1 + diagonal] === status ? 1 : 0;
            matrix.setWinnerCellHits('diagonal', diagonal === 1 ? 1 : 2, hits);
            return hits;
        },

        /**
         * there is 2 turns from player in row/column AND
         * search cell to complete row/column if is empty the cell for play
         *
         * {Function, Function, Function} completeRow completeColumn completeDiagonal
         * @namespace {Object} StatusComplete
         * @this {Object} this.player - @reference window.Player
         * @this {Object} this.matrix - @reference window.Matrix
         * @param {Number, Number, Number} row column diagonal- line index into matrix
         * */
        completeRow = function (row) {
            var player = this.player,
                matrix = this.matrix,
                hasCompleted = false,
                moveToComplete = getCellLineEmpty(matrix, null, row);

            if (countHitsRow(row, player, matrix) === 2 && !_.isNull(moveToComplete)) {
                hasCompleted = true;
                console.info(moveToComplete);
                //ticTacToeUtils.triggerCompleteTurn('machine', moveToComplete);
            }

            return hasCompleted;
        },/*
        completeColumn = function (column) {},
        completeDiagonal = function (diagonal) {},*/

        // check with this movement if a line is going to empty for opponent winner
        _isCellUnBlockLine = function (move, player, matrix) {
            var column = move[0],
                row = move[1],
                needHits = matrix.hits - 1,
                isMoveOnDiagonal = function (moveA, moveB) {
                    return _.isEqual(move, moveA) || _.isEqual(move, [1, 1]) || _.isEqual(move, moveB);
                };

            return countHitsRow(row, player, matrix) === needHits ||
                countHitsColumn(column, player, matrix) === needHits ||
                (isMoveOnDiagonal([0, 0], [2, 2]) && countHitsDiagonal(1, player, matrix) === needHits) ||
                (isMoveOnDiagonal([0, 2], [2, 0]) && countHitsDiagonal(-1, player, matrix) === needHits);
        },
        // move to aviable cell to do a line
        _completeCellToLine = function (player, matrix) {
            var StatusComplete = { player: player, matrix: matrix };

            return !_.isEmpty(_.filter(_.range(matrix.rows), completeRow, StatusComplete))/* ||
                !_.isEmpty(_.filter(_.range(matrix.columns), completeColumn, StatusComplete)) ||
                _.forEach([1, -1], completeDiagonal, StatusComplete)*/;
        },
        // check into lines player do a strike
        _isCheckedlineToWin = function (move, player, matrix) {
            var column = move[0],
                row = move[1],
                needHits = matrix.hits;

            return countHitsRow(row, player, matrix) ===  needHits ||
                countHitsColumn(column, player, matrix) === needHits ||
                countHitsDiagonal(1, player, matrix) === needHits ||
                countHitsDiagonal(-1, player, matrix) === needHits;
        };

    return {
        isCellUnBlockLine : _isCellUnBlockLine,
        completeLine : _completeCellToLine,
        isCheckedlineToWin : _isCheckedlineToWin
    };
}(window.TicTacToeUtils));
