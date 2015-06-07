var EventEmitter = require('events').EventEmitter;
var _ = require('lodash');
var Immutable = require('immutable');

var Dispatcher = require('../dispatcher/Dispatcher');
var GameConstants = require('../constants/GameConstants');
var Tile = require('../constants/Records').Tile;
var Timer = require('../constants/Records').Timer;

var CHANGE_EVENT = 'changed';
var BEST_TIMES_KEY = 'bestTimes';

var initialBoard = GameConstants.boards.INTERMEDIATE;
var timerInterval = null;

var state = {
    tiles: generateTiles(initialBoard),
    board: initialBoard,
    gameState: newGameState(GameConstants.gameStates.PLAYING),
    timer: newTimer(),
    bestTimes: getFromLocalStorage(BEST_TIMES_KEY)
};

var GameStore = _.assign({}, EventEmitter.prototype, {
    getState: function () {
        return state;
    },
    emitChange: function () {
        this.emit(CHANGE_EVENT);
    },
    addChangeListener: function (callback) {
        this.on(CHANGE_EVENT, callback);
    },
    removeChangeListener: function (callback) {
        this.removeListener(CHANGE_EVENT, callback);
    }
});

function generateTiles(board) {
    var mines = generateMineIndicies(board);

    return Immutable.List(_.fill(new Array(numberOfTiles(board)), {})).map(function (tile, index) {
        return new Tile({hasMine: mines.includes(index)});
    }).map(function (tile, index, tiles) {
        return tile.merge({
            index: index,
            adjacentMineCount: countAdjacentMines(index, tiles, board.cols),
            revealed: false,
            flagged: false
        });
    });
}

function generateMineIndicies(board) {
    var mines = Immutable.List([]);
    while (mines.size < board.mines) {
        var random = _.random(0, numberOfTiles(board) - 1);
        if (!mines.includes(random)) {
            mines = mines.push(random);
        }
    }
    return mines;
}

function revealTiles(revealing, tiles, board) {
    if (revealing.hasMine) {
        state.gameState = newGameState(GameConstants.gameStates.FAILURE);
        return tiles.map(function (tile) {
            return tile.hasMine ? tile.merge({revealed: true}) : tile;
        });
    } else if (revealing.revealed || revealing.adjacentMineCount !== 0) {
        tiles = tiles.set(revealing.index, revealing.merge({revealed: true}));
        return checkCompleteness(tiles, board);
    }

    tiles = tiles.set(revealing.index, revealing.merge({revealed: true}));

    getAdjacentTiles(revealing.index, tiles, board.cols).forEach(function (tile) {
        tiles = revealTiles(tile, tiles, board);
    });

    return checkCompleteness(tiles, board);
}

function toggleFlag(id, tiles) {
    var flagging = tiles.get(id);
    return state.tiles.set(id, flagging.merge({flagged: !flagging.flagged}));
}

function checkCompleteness(tiles, board) {
    if (countRevealedTiles(tiles) === numberOfTiles(board) - board.mines) {
        state.gameState = newGameState(GameConstants.gameStates.VICTORY);
    }
    return tiles;
}

function countAdjacentMines(index, tiles, cols) {
    return getAdjacentTiles(index, tiles, cols).reduce(function (prev, cur) {
        return prev + (cur.hasMine ? 1 : 0);
    }, 0);
}

function countRevealedTiles(tiles) {
    return tiles.reduce(function (prev, cur) {
        return prev + (cur.revealed ? 1 : 0);
    }, 0);
}

function numberOfTiles(board) {
    return board.rows * board.cols;
}

function getAdjacentTiles(index, tiles, cols) {
    var topEdge = index - cols < 0;
    var bottomEdge = index + cols >= tiles.size;
    var leftEdge = index % cols === 0;
    var rightEdge = index % cols === cols - 1;

    var topLeft = leftEdge || topEdge ? null : tiles.get(index - cols - 1);
    var left = leftEdge ? null : tiles.get(index - 1);
    var bottomLeft = leftEdge || bottomEdge ? null : tiles.get(index + cols - 1);
    var topRight = rightEdge || topEdge ? null : tiles.get(index - cols + 1);
    var right = rightEdge ? null : tiles.get(index + 1);
    var bottomRight = rightEdge || bottomEdge ? null : tiles.get(index + cols + 1);
    var top = topEdge ? null : tiles.get(index - cols);
    var bottom = bottomEdge ? null : tiles.get(index + cols);

    return Immutable.List([topLeft, top, topRight, right, bottomRight, bottom, bottomLeft, left])
        .filter(function (tile) {
            return tile !== null;
        });
}

function newGameState(newGameState) {
    switch (newGameState) {
        case GameConstants.gameStates.VICTORY:
            state.bestTimes = updateBestTime(state.board.difficulty, state.timer.current);
            GameStore.emitChange();
            break;
    }
    clearInterval(timerInterval);
    return newGameState;
}

function restartGame(board) {
    state.board = board;
    state.tiles = generateTiles(board);
    state.gameState = newGameState(GameConstants.gameStates.PLAYING);
    state.timer = newTimer();
}

function newTimer() {
    clearInterval(timerInterval);
    timerInterval = setInterval(function () {
        state.timer = state.timer.merge({current: Date.now() - state.timer.start});
        GameStore.emitChange();
    }, 1000);
    return new Timer({start: Date.now()});
}

function updateBestTime(difficulty, time) {
    state.bestTimes[difficulty] = state.bestTimes[difficulty] || Number.MAX_VALUE;
    if (state.bestTimes[difficulty] > time) {
        var newBestTime = _.assign({}, state.bestTimes, Immutable.Map({}).set(difficulty, time).toObject());
        setInLocalStorage(BEST_TIMES_KEY, newBestTime);
        return newBestTime;
    }
    return state.bestTimes;
}

function getFromLocalStorage(key) {
    return window.localStorage ? JSON.parse(window.localStorage.getItem(key)) || {} : {};
}

function setInLocalStorage(key, value) {
    if (window.localStorage) {
        window.localStorage.setItem(key, JSON.stringify(value));
    }
}

Dispatcher.register(function (action) {
    switch (action.actionType) {
        case GameConstants.actions.TILE_REVEAL:
            state.tiles = revealTiles(state.tiles.get(action.id), state.tiles, state.board);
            GameStore.emitChange();
            break;
        case GameConstants.actions.TILE_FLAG:
            state.tiles = toggleFlag(action.id, state.tiles);
            GameStore.emitChange();
            break;
        case GameConstants.actions.GAME_RESTART:
            restartGame(action.board);
            GameStore.emitChange();
            break;
    }
});

module.exports = GameStore;
