var React = require('react');

var GameActions = require('../../actions/GameActions');
var GameConstants = require('../../constants/GameConstants');

module.exports = React.createClass({
    onClick: function (event) {
        if (this.props.revealed || this.props.gameState !== GameConstants.gameStates.PLAYING) {
            return;
        } else if (event.altKey) {
            GameActions.flagTile(this.props.index);
        } else if (!this.props.flagged) {
            GameActions.revealTile(this.props.index);
        }
    },
    render: function () {
        var className = 'tile';
        if (this.props.revealed) {
            className += ' revealed';
            if (this.props.hasMine) {
                className += ' mine';
            } else if (this.props.adjacentMineCount !== 0) {
                className += ' neighborcount' + this.props.adjacentMineCount;
            }
        } else if (this.props.flagged) {
            className += ' flagged';
        }
        var content = this.props.revealed && !this.props.hasMine && this.props.adjacentMineCount !== 0 ? this.props.adjacentMineCount : '';
        return (
            <div className={className} onClick={this.onClick}>
                {content}
            </div>
        );
    }
});