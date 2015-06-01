var React = require('react');

var Game = require('./components/game/Game');

var App = React.createClass({
    render: function () {
        return <Game/>;
    }
});

React.render(<App/>, document.getElementById('app'));
