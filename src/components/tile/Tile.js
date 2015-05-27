var React = require('react');

module.exports = React.createClass({
    onClick: function (event) {
        if (this.props.revealed) {
            return;
        }
        if (event.ctrlKey) {
            this.props.flag(this.props.index);
        } else if (!this.props.flagged) {
            this.props.reveal(this.props.index);
        }
    },
    render: function () {
        var className = 'tile';
        if (this.props.revealed) {
            className += ' revealed';
            if (this.props.hasMine) {
                className += ' mine';
            } else if (this.props.adjacentMineCount !== 0) {
                className += ' neighborcount' + this.props.adjacentMineCount;
            }
        }
        return (
            <div className={className} onClick={this.onClick}>
                {this.props.revealed ? this.props.hasMine ? <div>[B]</div> :
                    <div>[{this.props.adjacentMineCount}]</div> :
                    this.props.flagged ? <div>[?]</div> : <div>[X]</div>}
            </div>
        );
    }
})
;