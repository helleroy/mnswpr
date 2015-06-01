var React = require('react');

var Common = require('../common/Common');
var Board = require('../board/Board');
var Alert = require('../alert/Alert');

module.exports = React.createClass({
    getInitialState: function () {
        return {
            board: Common.Board.get('INTERMEDIATE'),
            gameState: Common.GameState.get('PLAYING')
        };
    },
    setBoard: function (board) {
        this.setState({board: board});
    },
    setGameState: function (gameState) {
        this.setState({gameState: gameState});
    },
    restart: function (board) {
        this.setBoard(board);
        this.setGameState(Common.GameState.get('PLAYING'));
    },
    render: function () {
        var alertContent = this.state.gameState === Common.GameState.get('FAILURE') ?
            <div>You failed! <a onClick={this.restart.bind(this, this.state.board)}>Retry</a></div> :
            this.state.gameState === Common.GameState.get('VICTORY') ?
                <div>You won! <a onClick={this.restart.bind(this, this.state.board)}>Play again</a></div> : null;
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
        </div>
    }
});
