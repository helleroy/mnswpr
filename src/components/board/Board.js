var React = require('react');
var _ = require('lodash');
var Immutable = require('immutable');

var Common = require('../common/Common');
var Tile = require('../tile/Tile');

module.exports = React.createClass({
    getInitialState: function () {
        return {tiles: generateTiles(this.props.board)};
    },
    componentWillReceiveProps: function (nextProps) {
        if (this.props.board !== nextProps.board) {
            this.newBoard(nextProps.board);
        } else if (this.props.gameState !== nextProps.gameState && nextProps.gameState === Common.GameState.get('PLAYING')) {
            this.newBoard(nextProps.board);
        }
    },
    newBoard: function (board) {
        this.setState({tiles: generateTiles(board)});
    },
    setGameState: function (gameState) {
        this.props.setGameState(gameState);
    },
    reveal: function (index) {
        this.setState({tiles: revealTiles(this.state.tiles.get(index), this.state.tiles, this.props.board, this.setGameState)});
    },
    flag: function (index) {
        var tile = this.state.tiles.get(index);
        this.setState({tiles: this.state.tiles.set(index, _.assign(tile, {flagged: !tile.flagged}))})
    },
    render: function () {
        var tiles = _.chunk(this.state.tiles.toArray(), this.props.board.cols);
        return <div className="board">
            <table>
                <tbody>
                {tiles.map(function (row, index) {
                    return <tr key={'row' + index}>
                        {row.map(function (tile, index) {
                            return <td key={'tile' + index}>
                                <Tile {...tile}
                                    gameState={this.props.gameState}
                                    flag={this.flag}
                                    reveal={this.reveal}/></td>;
                        }.bind(this))}
                    </tr>;
                }.bind(this))}
                </tbody>
            </table>
        </div>;
    }
});

function revealTiles(revealing, tiles, board, gameStateCb) {
    if (revealing.hasMine) {
        gameStateCb(Common.GameState.get('FAILURE'));
        return tiles.map(function (tile) {
            return tile.hasMine ? _.assign(tile, {revealed: true}) : tile;
        });
    } else if (revealing.revealed || revealing.adjacentMineCount !== 0) {
        tiles = tiles.set(revealing.index, _.assign(revealing, {revealed: true}));
        return checkCompleteness(tiles, board, gameStateCb);
    }

    tiles = tiles.set(revealing.index, _.assign(revealing, {revealed: true}));

    getAdjacentTiles(revealing.index, tiles, board.cols).forEach(function (tile) {
        tiles = revealTiles(tile, tiles, board, gameStateCb);
    });

    return checkCompleteness(tiles, board, gameStateCb);
}

function checkCompleteness(tiles, board, gameStateCb) {
    if (revealedTiles(tiles) === (board.rows * board.cols) - board.mines) {
        gameStateCb(Common.GameState.get('VICTORY'));
    }
    return tiles;
}

function revealedTiles(tiles) {
    return tiles.reduce(function (prev, cur) {
        return prev + (cur.revealed ? 1 : 0);
    }, 0);
}

function generateTiles(board) {
    var numberOfTiles = board.rows * board.cols;
    var mines = generateMineIndicies(board.mines, numberOfTiles);

    return Immutable.List(_.fill(new Array(numberOfTiles), {})).map(function (tile, index) {
        return {hasMine: mines.includes(index)};
    }).map(function (tile, index, tiles) {
        return _.assign(tile, {
            index: index,
            adjacentMineCount: countAdjacentMines(index, tiles, board.cols),
            revealed: false,
            flagged: false
        });
    });
}

function generateMineIndicies(numberOfMines, numberOfTiles) {
    var mines = Immutable.List([]);
    while (mines.size < numberOfMines) {
        var random = _.random(0, numberOfTiles - 1);
        if (!mines.includes(random)) {
            mines = mines.push(random);
        }
    }
    return mines;
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
