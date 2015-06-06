var React = require('react');

module.exports = React.createClass({
    getDefaultProps: function () {
        return {isOpen: false};
    },
    render: function () {
        return this.props.isOpen ? <div className="alert">
            {this.props.children}
        </div> : null;
    }
});
