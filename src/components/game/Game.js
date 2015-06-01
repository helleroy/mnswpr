var React = require('react');
var Immutable = require('immutable');

var Board = require('../board/Board');

var boards = Immutable.Map({
    easy: {cols: 8, rows: 8, mines: 10},
    intermediate: {cols: 16, rows: 16, mines: 40},
    hard: {cols: 32, rows: 16, mines: 99}
});

module.exports = React.createClass({
    getInitialState: function () {
        return {board: boards.get('intermediate')};
    },
    setBoard: function (board) {
        this.setState({board: board});
    },
    render: function () {
        var difficulty = boards.map(function (board, difficulty) {
            return <a role="button" onClick={this.setBoard.bind(this, board)}>{difficulty}</a>;
        }.bind(this));
        return <div className="game">
            <div className="difficultyPicker">
                <p>Choose difficulty:</p>
                {difficulty}
            </div>
            <Board board={this.state.board}/>
        </div>
    }
});