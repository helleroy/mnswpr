var React = require('react');

module.exports = React.createClass({
    onClick: function (event) {
        if (this.props.revealed) {
            return;
        } else if (event.altKey) {
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
        var content = this.props.revealed ?
            this.props.hasMine ? 'B' : this.props.adjacentMineCount === 0 ? '' : this.props.adjacentMineCount :
            this.props.flagged ? '?' : '';
        return (
            <div className={className} onClick={this.onClick}>
                {content}
            </div>
        );
    }
})
;