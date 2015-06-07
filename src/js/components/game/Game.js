var React = require('react');
var moment = require('moment');
var Immutable = require('immutable');
var _ = require('lodash');

var GameActions = require('../../actions/GameActions');
var GameStore = require('../../stores/GameStore');
var GameConstants = require('../../constants/GameConstants');
var Board = require('../board/Board');
var Alert = require('../alert/Alert');

module.exports = React.createClass({
    getInitialState: function () {
        return GameStore.getState();
    },
    componentDidMount: function () {
        GameStore.addChangeListener(this._onChange);
    },
    componentWillUnmount: function () {
        GameStore.removeChangeListener(this._onChange);
    },
    restart: function (board) {
        GameActions.restartGame(board);
    },
    render: function () {
        var alertContent = this.state.gameState === GameConstants.gameStates.FAILURE ?
            <div>
                <p>You failed!</p><a onClick={this.restart.bind(this, this.state.board)}>Retry</a>
            </div> :
            this.state.gameState === GameConstants.gameStates.VICTORY ?
                <div>
                    <p>You won!</p><a onClick={this.restart.bind(this, this.state.board)}>Play again</a>
                </div> : null;

        var difficulty = _.map(GameConstants.boards, function (board, difficulty) {
            var className = this.state.board === board ? 'selected' : '';
            return <a role="button" key={difficulty} className={className} onClick={this.restart.bind(this, board)}>
                {difficulty.toLowerCase()}
            </a>;
        }.bind(this));

        var bestTime = this.state.bestTimes[this.state.board.difficulty] ?
            <p className="bestTime">
                <span>Your best time on this difficulty: </span>
                <span className="time bold">
                    {moment(this.state.bestTimes[this.state.board.difficulty]).format('mm:ss')}
                </span>
            </p> : null;

        return <div className="game">
            <Alert isOpen={this.state.gameState != GameConstants.gameStates.PLAYING}>{alertContent}</Alert>

            <div className="difficultyPicker">
                <p>Choose difficulty:</p>
                {difficulty}
            </div>

            <Board board={this.state.board} tiles={this.state.tiles} gameState={this.state.gameState}/>

            <div className="timer time">{moment(this.state.timer.current).format('mm:ss')}</div>
            {bestTime}
            <div className="howto">
                <h2>How to play:</h2>

                <p><i>Left-click</i> to reveal. <i>ALT + left-click</i> to flag.</p>
            </div>
        </div>
    },
    _onChange: function () {
        this.setState(GameStore.getState());
    }
});
