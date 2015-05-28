var React = require('react');
var _ = require('lodash');

var Tile = require('../tile/Tile');

var boards = {
    easy: {cols: 8, rows: 8, mines: 10},
    intermediate: {cols: 16, rows: 16, mines: 40},
    hard: {cols: 32, rows: 16, mines: 99}
};

module.exports = React.createClass({
    getInitialState: function () {
        var board = boards.intermediate;
        return {
            board: board,
            tiles: generateTiles(board.rows, board.cols, board.mines)
        };
    },
    setBoard: function (board) {
        this.setState({
            board: board,
            tiles: generateTiles(board.rows, board.cols, board.mines)
        });
    },
    reveal: function (index) {
        var tiles = this.state.tiles.slice(0);
        revealTile(index, tiles, this.state.board.cols);
        this.setState({tiles: tiles});
    },
    flag: function (index) {
        var tiles = this.state.tiles.slice(0);
        tiles[index].flagged = true;
        this.setState({tiles: tiles})
    },
    render: function () {
        var difficulty = _.map(boards, function (board, difficulty) {
            return <a role="button" onClick={this.setBoard.bind(this, board)}>{difficulty}</a>
        }.bind(this));
        var tiles = _.chunk(this.state.tiles, this.state.board.cols);
        return <div className="board">
            <div className="difficultyPicker">
                <p>Choose difficulty:</p>
                {difficulty}
            </div>
            <table>
                <tbody>
                {tiles.map(function (row) {
                    return <tr>
                        {row.map(function (tile) {
                            return <td><Tile index={tile.key}
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
        </div>;
    }
});

function revealTile(index, tiles, cols) {
    if (tiles[index].revealed || tiles[index].hasMine || tiles[index].adjacentMineCount !== 0) {
        tiles[index].revealed = true;
        return;
    }
    revealAdjacentTiles(index, tiles, cols);
}

function revealAdjacentTiles(index, tiles, cols) {
    tiles[index].revealed = true;

    getAdjacentTiles(index, tiles, cols).forEach(function (tile) {
        if (tile.key !== undefined) {
            revealTile(tile.key, tiles, cols);
        }
    });
}

function generateTiles(rows, cols, numberOfMines) {
    var numberOfTiles = rows * cols;
    var mines = generateMineIndicies(numberOfMines, numberOfTiles);

    return _.fill(new Array(numberOfTiles), {}).map(function (tile, index) {
        return {hasMine: _.includes(mines, index)};
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
    var mines = [];
    while (mines.length < numberOfMines) {
        var random = _.random(0, numberOfTiles - 1);
        if (!_.includes(mines, random)) {
            mines.push(random);
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
    var leftEdge = index % cols === 0;
    var rightEdge = index % cols === cols - 1;

    var topLeft = leftEdge ? {} : tiles[index - cols - 1] || {};
    var left = leftEdge ? {} : tiles[index - 1] || {};
    var bottomLeft = leftEdge ? {} : tiles[index + cols - 1] || {};
    var topRight = rightEdge ? {} : tiles[index - cols + 1] || {};
    var right = rightEdge ? {} : tiles[index + 1] || {};
    var bottomRight = rightEdge ? {} : tiles[index + cols + 1] || {};
    var top = tiles[index - cols] || {};
    var bottom = tiles[index + cols] || {};

    return [topLeft, top, topRight, right, bottomRight, bottom, bottomLeft, left];
}
