window.TicTacToeUtils = ( function (w) {
    'use strict';

    var _getEventHandler = function (arg) {
            var Ev = Array.prototype.slice.call(arg, -1)[0];

            return !_.isUndefined(Ev.currentTarget) ? Ev : null;
        },
        _triggerCompleteTurn = function (name, move) {
            var dataPlay = {
                    playerName: _.isString(name) ? name : null,
                    preselectedMove: _.isArray(move) ? move : null
                },
                playTurn = new CustomEvent('completeTurn', { detail: dataPlay });

            w.dispatchEvent(playTurn);
        },
        _triggerDiscartTurn = function (name, move) {
            var dataPlay = {
                    playerName: _.isString(name) ? name : null,
                    preselectedMove: _.isArray(move) ? move : null
                },
                playTurn = new CustomEvent('discartTurn', { detail: dataPlay });

            w.dispatchEvent(playTurn);
        },
        _triggerPlayTurn = function (name) {
            var dataPlay = {
                    playerEvent: _getEventHandler(arguments),
                    playerName: _.isString(name) ? name : null
                },
                playTurn = new CustomEvent('playTurn', { detail: dataPlay });

            w.dispatchEvent(playTurn);
        },
        _triggerPlayWinner = function (winnerName) {
            var dataPlay = {
                    playerName : winnerName
                },
                showWinner = new CustomEvent('showWinner', { detail: dataPlay });

            w.dispatchEvent(showWinner);
        };

    return {
        triggerPlayTurn : _triggerPlayTurn,
        triggerCompleteTurn : _triggerCompleteTurn,
        triggerDiscartTurn : _triggerDiscartTurn,
        triggerPlayWinner: _triggerPlayWinner
    };
}(window));
