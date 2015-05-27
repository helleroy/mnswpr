'use strict';

var express = require('express');

var app = express().use(express.static('src/public'));

var server = app.listen(process.env.PORT || 4000, function () {
    console.log('Started server on http://%s:%s', server.address().address, server.address().port);
});