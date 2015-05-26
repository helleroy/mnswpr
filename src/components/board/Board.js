var React = require('react');

var Tile = require('../tile/Tile');

module.exports = React.createClass({
    getDefaultProps: function () {
        return {size: {width: 16, height: 16}}
    },
    getInitialState: function () {
        return {tiles: this.generateBoard()};
    },
    generateBoard: function () {
        var tiles = [];

        for (var i = 0; i <= this.props.size.height; i++) {
            var row = [];
            for (var j = 0; j <= this.props.size.width; j++) {
                row.push(<Tile key={this.props.size.height + this.props.size.width}/>)
            }
            tiles.push(row);
        }

        return tiles;
    },
    render: function () {
        return <table>
            {this.state.tiles.map(function (row) {
                return <tr>
                    {row.map(function (tile) {
                        return <td>{tile}</td>
                    })}
                </tr>
            })}
        </table>;
    }
});