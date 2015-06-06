var Immutable = require('immutable');

module.exports = {
    Tile: Immutable.Record({
        index: -1,
        revealed: false,
        flagged: false,
        hasMine: false,
        adjacentMineCount: 0
    })
};