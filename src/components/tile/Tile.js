var React = require('react');

module.exports = React.createClass({
    getInitialState: function () {
        return {
            revealed: false,
            flagged: false
        };
    },
    onClick: function (event) {
        if (this.state.revealed) {
            return;
        }

        if (event.ctrlKey) {
            this.setState({flagged: !this.state.flagged})
        } else if (!this.state.flagged) {
            this.reveal();
        }
    },
    reveal: function () {
        this.setState({revealed: true})
    },
    render: function () {
        var className = 'tile';
        if (this.state.revealed) {
            className += ' revealed';
            if (this.props.hasMine) {
                className += ' mine';
            } else if (this.props.neighborMineCount !== 0) {
                className += ' neighborcount' + this.props.neighborMineCount;
            }
        }
        return (
            <div className={className} onClick={this.onClick}>
                {this.state.revealed ? this.props.hasMine ? <div>[B]</div> :
                    <div>[{this.props.neighborMineCount}]</div> :
                    this.state.flagged ? <div>[?]</div> : <div>[X]</div>}
            </div>
        );
    }
})
;