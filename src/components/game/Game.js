var React = require('react');
var moment = require('moment');
var Immutable = require('immutable');

var Common = require('../common/Common');
var Board = require('../board/Board');
var Alert = require('../alert/Alert');

module.exports = React.createClass({
    getInitialState: function () {
        return {
            board: Common.Board.get('INTERMEDIATE'),
            gameState: Common.GameState.get('PLAYING'),
            timer: Immutable.Map({start: Date.now(), current: 0})
        };
    },
    componentDidMount: function () {
        this.createTimerInterval();
    },
    componentWillUpdate: function (nextProps, nextState) {
        if (nextState.gameState !== Common.GameState.get('PLAYING')) {
            clearInterval(this.timerInterval);
        }
    },
    setBoard: function (board) {
        this.setState({board: board});
    },
    setGameState: function (gameState) {
        this.setState({gameState: gameState});
    },
    createTimerInterval: function () {
        clearInterval(this.timerInterval);
        this.timerInterval = setInterval(function () {
            this.setState({timer: this.state.timer.merge({current: Date.now() - this.state.timer.get('start')})});
        }.bind(this), 1000);
    },
    restart: function (board) {
        this.setBoard(board);
        this.setGameState(Common.GameState.get('PLAYING'));
        this.setState({timer: Immutable.Map({start: Date.now(), current: 0})});
        this.createTimerInterval();
    },
    render: function () {
        var alertContent = this.state.gameState === Common.GameState.get('FAILURE') ?
            <div><p>You failed!</p><a onClick={this.restart.bind(this, this.state.board)}>Retry</a></div> :
            this.state.gameState === Common.GameState.get('VICTORY') ?
                <div><p>You won!</p><a onClick={this.restart.bind(this, this.state.board)}>Play again</a></div> : null;
        var difficulty = Common.Board.map(function (board, difficulty) {
            return <a role="button" onClick={this.restart.bind(this, board)}>{difficulty.toLowerCase()}</a>;
        }.bind(this));
        return <div className="game">
            <Alert isOpen={this.state.gameState != Common.GameState.get('PLAYING')}>{alertContent}</Alert>

            <div className="difficultyPicker">
                <p>Choose difficulty:</p>
                {difficulty}
            </div>

            <Board board={this.state.board} gameState={this.state.gameState} setGameState={this.setGameState}/>

            <div className="timer">{moment(this.state.timer.get('current')).format('mm:ss')}</div>
        </div>
    }
});
