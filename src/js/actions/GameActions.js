var GameConstants = require('../constants/GameConstants');
var Dispatcher = require('../dispatcher/Dispatcher');

module.exports = {
    revealTile: function (id) {
        Dispatcher.dispatch({
            actionType: GameConstants.actions.TILE_REVEAL,
            id: id
        });
    },
    flagTile: function (id) {
        Dispatcher.dispatch({
            actionType: GameConstants.actions.TILE_FLAG,
            id: id
        });
    },
    restartGame: function (board) {
        Dispatcher.dispatch({
            actionType: GameConstants.actions.GAME_RESTART,
            board: board
        });
    }
};
