;(function (w) {
    'use strict';

    w.Smart = function () {

    };

    // get random coords into empty grid cells
    w.Smart.prototype.getRandomEmptyCell = function (matrix) {
        var matrixIndexX = matrix.rows - 1,
            matrixIndexY = matrix.columns - 1;

        return [_.random(0, matrixIndexX), _.random(0, matrixIndexY)];
    };
}(window));
