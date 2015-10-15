window.TicTacToeUtils = ( function (w) {
    'use strict';

    var _getEventHandler = function (arg) {
            var Ev = Array.prototype.slice.call(arg, -1)[0];

            return !_.isUndefined(Ev.currentTarget) ? Ev : null;
        },
        _triggerPlayTurn = function (name, move) {
        var dataPlay = {
                playerEvent: _getEventHandler(arguments),
                playerName: _.isString(name) ? name : null,
                preselectedMove: _.isArray(move) ? move : null
            },
            playTurn = new CustomEvent('playTurn', { detail: dataPlay });

        w.dispatchEvent(playTurn);
    };

    return {
        triggerPlayTurn : _triggerPlayTurn
    };
}(window));
