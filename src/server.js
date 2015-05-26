'use strict';

var express = require('express');

var app = express();

app.set('port', process.env.PORT || 4000);

app.use(express.static('src/public'));

app.listen(app.get('port'), function () {
    console.log('Started server on ', app.get('port'))
});