var keyMirror = require('keymirror');

module.exports = {
    actions: keyMirror({
        GAME_RESTART: null,
        TILE_REVEAL: null,
        TILE_FLAG: null
    }),
    gameStates: keyMirror({
        PLAYING: null,
        VICTORY: null,
        FAILURE: null
    }),
    boards: {
        EASY: {difficulty: 'EASY', cols: 8, rows: 8, mines: 10},
        INTERMEDIATE: {difficulty: 'INTERMEDIATE', cols: 16, rows: 16, mines: 40},
        HARD: {difficulty: 'HARD', cols: 32, rows: 16, mines: 99}
    }
};
