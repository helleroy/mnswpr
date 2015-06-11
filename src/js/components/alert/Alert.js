var React = require('react');

var GameConstants = require('../../constants/GameConstants');
var GameActions = require('../../actions/GameActions');

module.exports = React.createClass({
    shouldComponentUpdate: function (nextProps) {
        return shouldBeOpen(this.props) !== shouldBeOpen(nextProps);
    },
    restart: function () {
        GameActions.restartGame(this.props.board);
    },
    render: function () {
        var alertContent = null;
        if (this.props.gameState === GameConstants.gameStates.FAILURE) {
            alertContent = <div>
                <p>You failed!</p><a onClick={this.restart}>Retry</a>
            </div>;
        } else if (this.props.gameState === GameConstants.gameStates.VICTORY) {
            alertContent = <div>
                <p>You won!</p><a onClick={this.restart}>Play again</a>
            </div>;
        }

        return shouldBeOpen(this.props) ?
            <div className="alert">
                {alertContent}
            </div> : null;
    }
});

function shouldBeOpen(props) {
    return props.gameState === GameConstants.gameStates.VICTORY || props.gameState === GameConstants.gameStates.FAILURE;
}
