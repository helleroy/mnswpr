var React = require('react');
var _ = require('lodash');

var Tile = require('../tile/Tile');

var boards = {
    easy: {cols: 8, rows: 8, mines: 8},
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
        this.updateTile(index, {revealed: true});
    },
    flag: function (index) {
        this.updateTile(index, {flagged: true});
    },
    updateTile: function (index, newState) {
        var tiles = this.state.tiles.slice(0);
        tiles[index] = _.assign(tiles[index], newState);
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
    var topLeft = tiles[index - cols - 1] || {};
    var top = tiles[index - cols] || {};
    var topRight = tiles[index - cols + 1] || {};
    var right = tiles[index + 1] || {};
    var bottomRight = tiles[index + cols + 1] || {};
    var bottom = tiles[index + cols] || {};
    var bottomLeft = tiles[index + cols - 1] || {};
    var left = tiles[index - 1] || {};

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
