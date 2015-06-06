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
        return _.assign({}, GameStore.getState(), {timer: Immutable.Map({start: Date.now(), current: 0})});
    },
    componentDidMount: function () {
        GameStore.addChangeListener(this._onChange);
        this.createTimerInterval();
    },
    componentWillUnmount: function () {
        GameStore.removeChangeListener(this._onChange);
        clearInterval(this.timerInterval);
    },
    componentWillUpdate: function (nextProps, nextState) {
        if (nextState.gameState !== GameConstants.gameStates.PLAYING) {
            clearInterval(this.timerInterval);
        }
    },
    createTimerInterval: function () {
        clearInterval(this.timerInterval);
        this.timerInterval = setInterval(function () {
            this.setState({timer: this.state.timer.merge({current: Date.now() - this.state.timer.get('start')})});
        }.bind(this), 1000);
    },
    restart: function (board) {
        GameActions.restartGame(board);
        this.setState({timer: Immutable.Map({start: Date.now(), current: 0})});
        this.createTimerInterval();
    },
    render: function () {
        var alertContent = this.state.gameState === GameConstants.gameStates.FAILURE ?
            <div><p>You failed!</p><a onClick={this.restart.bind(this, this.state.board)}>Retry</a></div> :
            this.state.gameState === GameConstants.gameStates.VICTORY ?
                <div><p>You won!</p><a onClick={this.restart.bind(this, this.state.board)}>Play again</a></div> : null;
        var difficulty = _.map(GameConstants.boards, function (board, difficulty) {
            return <a role="button" onClick={this.restart.bind(this, board)}>{difficulty.toLowerCase()}</a>;
        }.bind(this));
        return <div className="game">
            <Alert isOpen={this.state.gameState != GameConstants.gameStates.PLAYING}>{alertContent}</Alert>

            <div className="difficultyPicker">
                <p>Choose difficulty:</p>
                {difficulty}
            </div>

            <Board board={this.state.board} tiles={this.state.tiles} gameState={this.state.gameState}/>

            <div className="timer">{moment(this.state.timer.get('current')).format('mm:ss')}</div>
        </div>
    },
    _onChange: function () {
        this.setState(GameStore.getState());
    }
});
