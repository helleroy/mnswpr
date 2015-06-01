var Immutable = require('immutable');

var Board = Immutable.Map({
    EASY: {cols: 8, rows: 8, mines: 10},
    INTERMEDIATE: {cols: 16, rows: 16, mines: 40},
    HARD: {cols: 32, rows: 16, mines: 99}
});

var GameState = Immutable.Map({
    PLAYING: 1,
    VICTORY: 2,
    FAILURE: 3
});

module.exports = {
    GameState: GameState,
    Board: Board
};
