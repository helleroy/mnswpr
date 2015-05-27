var React = require('react');
var _ = require('lodash');

var Tile = require('../tile/Tile');

var boards = {
    easy: {cols: 8, rows: 8, mines: 10},
    intermediate: {cols: 16, rows: 16, mines: 40},
    hard: {cols: 32, rows: 16, mines: 99}
};

module.exports = React.createClass({
    getDefaultProps: function () {
        return {board: boards.intermediate}
    },
    getInitialState: function () {
        return {tiles: generateTiles(this.props.board.rows, this.props.board.cols, this.props.board.mines)};
    },
    reveal: function (index) {
        var tiles = this.state.tiles.slice(0);
        revealTile(index, tiles, this.props.board.cols);
        this.setState({tiles: tiles});
    },
    flag: function (index) {
        var tiles = this.state.tiles.slice(0);
        tiles[index].flagged = true;
        this.setState({tiles: tiles})
    },
    render: function () {
        var tiles = _.chunk(this.state.tiles, this.props.board.cols);
        return <table className="board">
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
        </table>;
    }
});

function revealTile(index, tiles, cols) {
    if (tiles[index].revealed || tiles[index].adjacentMineCount !== 0) {
        tiles[index].revealed = true;
        return;
    }

    tiles[index].revealed = true;

    getAdjacentTiles(tiles, cols, index).forEach(function (tile) {
        if (tile.key !== undefined) {
            revealTile(tile.key, tiles, cols);
        }
    });
}

function generateTiles(rows, cols, numberOfMines) {
    var numberOfTiles = rows * cols;
    var mines = generateMineIndicies(numberOfMines, numberOfTiles);
    var tiles = [];

    for (var i = 0; i < numberOfTiles; i++) {
        tiles.push({key: i, hasMine: _.includes(mines, i)});
    }

    return tiles.map(function (tile, index) {
        return _.assign(tile, {
            adjacentMineCount: countAdjacentMines(tiles, cols, index),
            revealed: false,
            flagged: false
        })
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

function getAdjacentTiles(tiles, cols, index) {
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

function countAdjacentMines(tiles, cols, index) {
    var count = 0;
    getAdjacentTiles(tiles, cols, index).forEach(function (adjacentTile) {
        if (adjacentTile.hasMine) {
            count++;
        }
    });
    return count;
}
