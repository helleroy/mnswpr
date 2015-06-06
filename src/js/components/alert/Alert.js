var React = require('react');

module.exports = React.createClass({
    getDefaultProps: function () {
        return {isOpen: false};
    },
    shouldComponentUpdate: function (nextProps) {
        return this.props.isOpen !== nextProps.isOpen;
    },
    render: function () {
        return this.props.isOpen ? <div className="alert">
            {this.props.children}
        </div> : null;
    }
});
