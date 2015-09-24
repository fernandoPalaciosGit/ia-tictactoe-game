;(function () {
    'use strict';

    var matrix = {
        grid: [],
        class: 'js-matrix-',
        columns: 3,
        rows: 3
    };

    // coordenates : js-matrix-{column}-{row}
    for (var i = 0; i < matrix.rows; i++) {
        matrix.grid.push(new Array(matrix.columns));

        for (var j = 0; j < matrix.columns; j++) {
            matrix.grid[i][j] = matrix.class + j + i;
        }
    }

    console.dir(matrix.grid);
}(window, document));
