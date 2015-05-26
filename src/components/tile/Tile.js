var React = require('react');

module.exports = React.createClass({
    getInitialState: function () {
        return {
            revealed: false,
            flagged: false
        };
    },
    reveal: function () {
        this.setState({revealed: true});
    }
    ,
    render: function () {
        return (
            <div onClick={this.reveal}>
                {this.state.revealed ? <div>[]</div> : <div>[X]</div>}
            </div>
        );
    }
})
;