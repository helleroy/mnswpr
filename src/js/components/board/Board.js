var React = require('react');
var _ = require('lodash');

var Tile = require('../tile/Tile');

module.exports = React.createClass({
    shouldComponentUpdate: function (nextProps) {
        return this.props.tiles !== nextProps.tiles;
    },
    render: function () {
        var tiles = _.chunk(this.props.tiles.toArray(), this.props.board.cols);
        return <div className="board">
            <table>
                <tbody>
                {tiles.map(function (row, index) {
                    return <tr key={'row' + index}>
                        {row.map(function (tile, index) {
                            return <td key={'tile' + index}>
                                <Tile tile={tile} gameState={this.props.gameState}/>
                            </td>;
                        }.bind(this))}
                    </tr>;
                }.bind(this))}
                </tbody>
            </table>
        </div>;
    }
});
