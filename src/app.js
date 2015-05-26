var React = require('react');
var Board = require('./components/board/Board');

var App = React.createClass({
    render: function () {
        return <Board/>;
    }
});

React.render(<App/>, document.body);


