window.TicTacToeUtils = ( function (w, d) {
    'use strict';

    var createEvent = function (eventName, eventData) {
            var utilEvent = new CustomEvent(eventName, { detail: eventData });

            w.dispatchEvent(utilEvent);
        },
        getEventHandler = function (arg) {
            var Ev = Array.prototype.slice.call(arg, -1)[0];

            return !_.isUndefined(Ev.currentTarget) ? Ev : null;
        },
        _triggerCompleteTurn = function (name, move) {
            var dataPlay = {
                    playerName: _.isString(name) ? name : null,
                    preselectedMove: _.isArray(move) ? move : null
                };

            createEvent('completeTurn', dataPlay);
        },
        _triggerDiscartTurn = function (name, move) {
            var dataPlay = {
                    playerName: _.isString(name) ? name : null,
                    preselectedMove: _.isArray(move) ? move : null
                };

            createEvent('discartTurn', dataPlay);
        },
        _triggerPlayTurn = function (name) {
            var dataPlay = {
                    playerEvent: getEventHandler(arguments),
                    playerName: _.isString(name) ? name : null
                };

            createEvent('playTurn', dataPlay);
        },
        _triggerPlayWinner = function (winnerName) {
            var dataPlay = {
                    playerName : winnerName
                };

            createEvent('showWinner', dataPlay);
        },
        _toogleInfoViewsByData = function (dataSelector, toggleData) {
            _.map(d.querySelectorAll('[data-' + dataSelector + ']'), function (link) {
                link.dataset[_.camelCase(dataSelector)] = toggleData;
            });
        };

    return {
        triggerPlayTurn : _triggerPlayTurn,
        triggerCompleteTurn : _triggerCompleteTurn,
        triggerDiscartTurn : _triggerDiscartTurn,
        triggerPlayWinner: _triggerPlayWinner,
        toogleInfoViewsByData: _toogleInfoViewsByData
    };
}(window, document));
