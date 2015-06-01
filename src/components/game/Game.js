var React = require('react');

var Common = require('../common/Common');
var Board = require('../board/Board');
var Modal = require('../modal/Modal');

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
    restart: function () {
        this.setBoard(this.state.board);
        this.setGameState(Common.GameState.get('PLAYING'));
    },
    render: function () {
        var modalContent = this.state.gameState === Common.GameState.get('FAILURE') ?
            <div>You failed! <a onClick={this.restart}>Retry</a></div> :
            this.state.gameState === Common.GameState.get('VICTORY') ?
                <div>You won! <a onClick={this.restart}>Play again</a></div> : null;
        var difficulty = Common.Board.map(function (board, difficulty) {
            return <a role="button" onClick={this.setBoard.bind(this, board)}>{difficulty.toLowerCase()}</a>;
        }.bind(this));
        return <div className="game">
            <div className="difficultyPicker">
                <p>Choose difficulty:</p>
                {difficulty}
            </div>
            <Board board={this.state.board} gameState={this.state.gameState} setGameState={this.setGameState}/>
            <Modal isOpen={this.state.gameState != Common.GameState.get('PLAYING')}>{modalContent}</Modal>
        </div>
    }
});
