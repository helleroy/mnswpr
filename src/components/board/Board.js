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
        return {tiles: generateBoard(this.props.board.rows, this.props.board.cols, this.props.board.mines)};
    },
    render: function () {
        return <table>
            {this.state.tiles.map(function (row) {
                return <tr>
                    {row.map(function (tile) {
                        return <td>{tile}</td>;
                    })}
                </tr>;
            })}
        </table>;
    }
});

function generateBoard(rows, cols, numberOfMines) {
    var length = rows * cols;
    var mines = [];
    var tiles = [];

    while (mines.length < numberOfMines) {
        var random = _.random(0, length - 1);
        if (!_.includes(mines, random)) {
            mines.push(random);
        }
    }

    for (var i = 0; i < length; i++) {
        tiles.push(<Tile hasMine={_.includes(mines, i)}/>);
    }

    return _.chunk(tiles, cols);
}
