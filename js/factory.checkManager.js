window.CheckMatrixManager = ( function () {
    'use strict';
    var _completeRow = function (/*row, player, matrix*/) {
            //ticTacToeUtils.triggerPlayTurn('machine', move);
        },
        _completeColumn = function (/*column, player, matrix*/) {
            //ticTacToeUtils.triggerPlayTurn('machine', move);
        },
        _completeDiagonal = function (/*diagonal, player, matrix*/) {
            //ticTacToeUtils.triggerPlayTurn('machine', move);
        },
        _isHitsRow = function (row, player, matrix) {
            var i, hits = 0;

            for (i = 0; i < matrix.hits; i++) {
                hits += matrix.grid[i][row] === player.matrix.status ? 1 : 0;
            }

            matrix.setWinnerCellHits('row', row, hits);
            return hits;
        },
        _isHitsColumn = function (column, player, matrix) {
            var i, hits = 0;

            for (i = 0; i < matrix.columns; i++) {
                hits += matrix.grid[column][i] === player.matrix.status ? 1 : 0;
            }

            matrix.setWinnerCellHits('column', column, hits);
            return hits;
        },
        _isHitsDiagonal = function (diagonal, player, matrix) {
            var status = player.matrix.status,
                grid = matrix.grid,
                hits = 0;

            hits += grid[0][1 - diagonal] === status ? 1 : 0;
            hits += grid[1][1] === status ? 1 : 0;
            hits += grid[2][1 + diagonal] === status ? 1 : 0;
            matrix.setWinnerCellHits('diagonal', diagonal === 1 ? 1 : 2, hits);
            return hits;
        },
        // check with this movement if a line is going to empty for opponent winner
        _isCellUnBlockLine = function (move, player, matrix) {
            var column = move[0],
                row = move[1],
                needHits = matrix.hits - 1,
                isMoveOnDiagonal = function (moveA, moveB) {
                    return _.isEqual(move, moveA) || _.isEqual(move, [1, 1]) || _.isEqual(move, moveB);
                };

            return _isHitsRow(row, player, matrix) === needHits ||
                _isHitsColumn(column, player, matrix) === needHits ||
                (isMoveOnDiagonal([0, 0], [2, 2]) && _isHitsDiagonal(1, player, matrix) === needHits) ||
                (isMoveOnDiagonal([0, 2], [2, 0]) && _isHitsDiagonal(-1, player, matrix) === needHits);
        },
        // move to aviable cell to do a line
        _completeCellToLine = function (player, matrix) {
            _.range(matrix.rows).every(_completeRow.bind(this, player, matrix));
            _.range(matrix.columns).every(_completeColumn.bind(this, player, matrix));
            _.range([1, -1]).every(_completeDiagonal.bind(this, player, matrix));
        },
        _isCheckedlineToWin = function (move, player, matrix) {
            var column = move[0],
                row = move[1],
                needHits = matrix.hits;

            return _isHitsRow(row, player, matrix) ===  needHits ||
                _isHitsColumn(column, player, matrix) === needHits ||
                _isHitsDiagonal(1, player, matrix) === needHits ||
                _isHitsDiagonal(-1, player, matrix) === needHits;
        };

    return {
        isCellUnBlockLine : _isCellUnBlockLine,
        completeLine : _completeCellToLine,
        isCheckedlineToWin : _isCheckedlineToWin
    };
}());
