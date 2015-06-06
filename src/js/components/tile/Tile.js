var React = require('react');

var GameActions = require('../../actions/GameActions');
var GameConstants = require('../../constants/GameConstants');

module.exports = React.createClass({
    shouldComponentUpdate: function (nextProps) {
        return this.props.tile !== nextProps.tile;
    },
    onClick: function (event) {
        if (this.props.tile.revealed || this.props.gameState !== GameConstants.gameStates.PLAYING) {
            return;
        }
        if (event.altKey) {
            GameActions.flagTile(this.props.tile.index);
        } else if (!this.props.tile.flagged) {
            GameActions.revealTile(this.props.tile.index);
        }
    },
    render: function () {
        var className = 'tile';
        if (this.props.tile.revealed) {
            className += ' revealed';
            if (this.props.tile.hasMine) {
                className += ' mine';
            } else if (this.props.tile.adjacentMineCount !== 0) {
                className += ' neighborcount' + this.props.tile.adjacentMineCount;
            }
        } else if (this.props.tile.flagged) {
            className += ' flagged';
        }
        var content = this.props.tile.revealed && !this.props.tile.hasMine && this.props.tile.adjacentMineCount !== 0 ? this.props.tile.adjacentMineCount : '';
        return (
            <div className={className} onClick={this.onClick}>
                {content}
            </div>
        );
    }
});
