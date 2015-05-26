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
        return (
            <div onClick={this.onClick}>
                {this.state.revealed ? this.props.hasMine ? <div>[B]</div> : <div>[ ]</div> :
                    this.state.flagged ? <div>[?]</div> : <div>[X]</div>}
            </div>
        );
    }
})
;