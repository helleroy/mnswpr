var React = require('react');
var _ = require('lodash');
var Immutable = require('immutable');

var Tile = require('../tile/Tile');
var Modal = require('../modal/Modal');

var boards = Immutable.Map({
    easy: {cols: 8, rows: 8, mines: 10},
    intermediate: {cols: 16, rows: 16, mines: 40},
    hard: {cols: 32, rows: 16, mines: 99}
});

var gameStates = Immutable.Map({
    PLAYING: 1,
    VICTORY: 2,
    FAILURE: 3
});

module.exports = React.createClass({
    getInitialState: function () {
        var board = boards.get('intermediate');
        return {
            board: board,
            tiles: generateTiles(board.rows, board.cols, board.mines),
            gameState: gameStates.get('PLAYING')
        };
    },
    setBoard: function (board) {
        this.setState({
            board: board,
            tiles: generateTiles(board.rows, board.cols, board.mines),
            gameState: gameStates.get('PLAYING')
        });
    },
    restart: function () {
        this.setBoard(this.state.board);
    },
    setGameState: function (gameState) {
        this.setState({gameState: gameState});
    },
    reveal: function (index) {
        this.setState({tiles: revealTiles(this.state.tiles.get(index), this.state.tiles, this.state.board, this.setGameState)});
    },
    flag: function (index) {
        this.setState({tiles: this.state.tiles.set(index, {flagged: true})})
    },
    render: function () {
        var modalContent = this.state.gameState === gameStates.get('FAILURE') ?
            <div>You failed! <a onClick={this.restart}>Retry</a></div> :
            this.state.gameState === gameStates.get('VICTORY') ?
                <div>You won! <a onClick={this.restart}>Play again</a></div> : null;
        var difficulty = boards.map(function (board, difficulty) {
            return <a role="button" onClick={this.setBoard.bind(this, board)}>{difficulty}</a>
        }.bind(this));
        var tiles = _.chunk(this.state.tiles.toArray(), this.state.board.cols);
        return <div className="board">
            <div className="difficultyPicker">
                <p>Choose difficulty:</p>
                {difficulty}
            </div>
            <table>
                <tbody>
                {tiles.map(function (row, index) {
                    return <tr key={'row' + index}>
                        {row.map(function (tile, index) {
                            return <td key={'tile' + index}>
                                <Tile index={tile.key}
                                      hasMine={tile.hasMine}
                                      adjacentMineCount={tile.adjacentMineCount}
                                      revealed={tile.revealed}
                                      flagged={tile.flagged}
                                      flag={this.flag}
                                      reveal={this.reveal}/></td>;
                        }.bind(this))}
                    </tr>;
                }.bind(this))}
                </tbody>
            </table>
            <Modal isOpen={this.state.gameState != gameStates.get('PLAYING')}>{modalContent}</Modal>
        </div>;
    }
});

function revealTiles(revealing, tiles, board, gameStateCb) {
    if (revealing.hasMine) {
        gameStateCb(gameStates.get('FAILURE'));
        return tiles.map(function (tile) {
            return tile.hasMine ? _.assign(tile, {revealed: true}) : tile;
        });
    } else if (revealing.revealed || revealing.adjacentMineCount !== 0) {
        return tiles.set(revealing.key, _.assign(revealing, {revealed: true}));
    }

    tiles = tiles.set(revealing.key, _.assign(revealing, {revealed: true}));

    if (isComplete(tiles, board)) {
        gameStateCb(gameStates.get('VICTORY'));
        return tiles;
    }

    getAdjacentTiles(revealing.key, tiles, board.cols).forEach(function (tile) {
        tiles = revealTiles(tile, tiles, board, gameStateCb);
    });

    return tiles;
}

function isComplete(tiles, board) {
    return revealedTiles(tiles) === (board.rows * board.cols) - board.mines;
}

function revealedTiles(tiles) {
    return tiles.reduce(function (prev, cur) {
        return prev + (cur.revealed ? 1 : 0);
    }, 0);
}

function generateTiles(rows, cols, numberOfMines) {
    var numberOfTiles = rows * cols;
    var mines = generateMineIndicies(numberOfMines, numberOfTiles);

    return Immutable.List(_.fill(new Array(numberOfTiles), {})).map(function (tile, index) {
        return {hasMine: mines.includes(index)};
    }).map(function (tile, index, tiles) {
        return _.assign(tile, {
            key: index,
            adjacentMineCount: countAdjacentMines(index, tiles, cols),
            revealed: false,
            flagged: false
        });
    });
}

function generateMineIndicies(numberOfMines, numberOfTiles) {
    return Immutable.List(_.fill(new Array(numberOfMines), {})).map(function (mine, index, mines) {
        var random;
        do {
            random = _.random(0, numberOfTiles - 1);
        } while (mines.includes(random));
        return random;
    });
}

function countAdjacentMines(index, tiles, cols) {
    return getAdjacentTiles(index, tiles, cols).reduce(function (prev, cur) {
        return prev + (cur.hasMine ? 1 : 0);
    }, 0);
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
