window.CheckMatrixManager = ( function () {
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
        getFirstCellLineFilled = function (matrix, player, column, row) {
            var i, grid, cellFill = null;

            for (i = 0; i < matrix.hits; i++) {
                grid = (_.isNull(column) && !_.isNull(row)) ? matrix.grid[i][row] : matrix.grid[column][i];
                if (grid === player.matrix.status) {
                    cellFill = [i, row];
                    break;
                }
            }

            return cellFill;
        },
        getCellDiagonalEmpty = function (matrix, diagonal) {
            var cellEmpty = null,
                lineDiagonals = [[0, 1 - diagonal], [1, 1], [2, 1 + diagonal]];

            _.every(lineDiagonals, function (lineDiagonal) {
                if (matrix.isEmptyTurn.apply(matrix, lineDiagonal)) {
                    cellEmpty = lineDiagonal;
                }

                return _.isNull(cellEmpty);
            });

            return cellEmpty;
        },
        getFirstCellDiagonalFilled = function (matrix, player, diagonal) {
            var cellEmpty = null,
                lineDiagonals = [[0, 1 - diagonal], [1, 1], [2, 1 + diagonal]];

            _.every(lineDiagonals, function (lineDiagonal) {
                if (matrix.getStatusGrid.apply(matrix, lineDiagonal) === player.matrix.status) {
                    cellEmpty = lineDiagonal;
                }

                return _.isNull(cellEmpty);
            });

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
                hitsToComplete = matrix.hits - 1,
                moveToComplete = getCellLineEmpty(matrix, null, row);

            return (!_.isNull(moveToComplete) && countHitsRow(row, player, matrix) === hitsToComplete) ?
                moveToComplete : null;
        },
        completeColumn = function (column) {
            var player = this.player,
                matrix = this.matrix,
                hitsToComplete = matrix.hits - 1,
                moveToComplete = getCellLineEmpty(matrix, column, null);

            return (!_.isNull(moveToComplete) && countHitsColumn(column, player, matrix) === hitsToComplete) ?
                moveToComplete : null;
        },
        completeDiagonal = function (diagonal) {
            var player = this.player,
                matrix = this.matrix,
                hitsToComplete = matrix.hits - 1,
                moveToComplete = getCellDiagonalEmpty(matrix, diagonal);

            return (!_.isNull(moveToComplete) && countHitsDiagonal(diagonal, player, matrix) === hitsToComplete) ?
                moveToComplete : null;

        },
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
        _getMoveTocompleteLine = function (player, matrix) {
            var StatusComplete = { player: player, matrix: matrix },
                moveToComplete = null;

            _.every(_.range(matrix.rows), function (row) {
                moveToComplete = completeRow.call(StatusComplete, row);
                return _.isNull(moveToComplete); // stop iteration until we catch a movement
            });

            if (_.isNull(moveToComplete)) {
                _.every(_.range(matrix.columns), function (column) {
                    moveToComplete = completeColumn.call(StatusComplete, column);
                    return _.isNull(moveToComplete);
                });
            }

            if (_.isNull(moveToComplete)) {
                _.every([1, -1], function (diagonal) {
                    moveToComplete =  completeDiagonal.call(StatusComplete, diagonal);
                    return _.isNull(moveToComplete);
                });
            }

            return moveToComplete;
        },
        _getMoveTodiscartLine = function (player, matrix) {
            var moveToDiscart = null;

            _.every(_.range(matrix.rows), function (row) {
                if (countHitsRow(row, player, matrix) === 1) {
                    moveToDiscart = getFirstCellLineFilled(matrix, player, null, row);
                }

                return _.isNull(moveToDiscart);
            });

            if (_.isNull(moveToDiscart)) {
                _.every(_.range(matrix.columns), function (column) {
                    if (countHitsColumn(column, player, matrix) === 1) {
                        moveToDiscart = getFirstCellLineFilled(matrix, player, column, null);
                    }

                    return _.isNull(moveToDiscart);
                });
            }

            if (_.isNull(moveToDiscart)) {
                _.every([1, -1], function (diagonal) {
                    if (countHitsDiagonal(diagonal, player, matrix) === 1) {
                        moveToDiscart =  getFirstCellDiagonalFilled(matrix, player, diagonal);
                    }

                    return _.isNull(moveToDiscart);
                });
            }

            return moveToDiscart;
        },
        // check into lines player do a strike
        _isCheckedlineToComplete = function (move, player, matrix, hits) {
            var column = move[0],
                row = move[1];

            return countHitsRow(row, player, matrix) ===  hits ||
                countHitsColumn(column, player, matrix) === hits ||
                countHitsDiagonal(1, player, matrix) === hits ||
                countHitsDiagonal(-1, player, matrix) === hits;
        };

    return {
        isCellUnBlockLine : _isCellUnBlockLine,
        getMoveTocompleteLine : _getMoveTocompleteLine,
        getMoveTodiscartLine: _getMoveTodiscartLine,
        isCheckedlineToComplete : _isCheckedlineToComplete
    };
}());
