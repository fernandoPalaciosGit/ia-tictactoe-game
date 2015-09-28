;(function (w) {
    'use strict';

    w.Smart = function () {

    };

    // get random coords into empty grid cells
    w.Smart.prototype.getRandomEmptyCell = function (matrix) {
        var randomX = null,
            randomY = null,
            matrixIndexX = matrix.rows - 1,
            matrixIndexY = matrix.columns - 1,
            isEmptyRandomCell = false;

        while (!isEmptyRandomCell) {
            randomX = _.random(0, matrixIndexX);
            randomY = _.random(0, matrixIndexY);
            isEmptyRandomCell = matrix.grid[randomX][randomY] === 0;
        }

        return [randomX, randomY];
    };
}(window));
