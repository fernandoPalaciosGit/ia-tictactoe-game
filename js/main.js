;(function (w, d, Matrix) {
    'use strict';

    var IAGame = {
        matrix: new Matrix(3, 3, 'ia-matrix-game', 'ia-matrix-game__cell-box'),
        init: function () {
            this.matrix.clearGrid();
            this.matrix.setStatusGrid(1, 1, Matrix.STATUSCELL.CIRCLE);
            this.matrix.setStatusGrid(0, 2, Matrix.STATUSCELL.CROSS);
        }
    };

    d.addEventListener('DOMContentLoaded', IAGame.init.bind(IAGame));
}(window, document, window.Matrix));
