;(function (w, d, Matrix) {
    'use strict';

    var IAGame = {
        matrix: new Matrix(3, 3, 'js-matrix-'),
        init: function () {
            this.matrix.clearGrid();
            console.dir(this.matrix.grid);
        }
    };

    d.addEventListener('DOMContentLoaded', IAGame.init.bind(IAGame));
}(window, document, window.Matrix));
