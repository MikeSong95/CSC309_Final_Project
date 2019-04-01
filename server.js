/* E4 server.js */
'use strict';
const log = console.log;

const express = require('express')
const bodyParser = require('body-parser')
const { ObjectID } = require('mongodb')
const path = require('path');

// Mongoose
//const { mongoose } = require('./db/mongoose');
//const { Patient } = require('./models/patient')

// Express
const port = process.env.PORT || 3000
const app = express();
app.use(bodyParser.json());

app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + '/index.html'));
});

app.listen(port, () => {
	log(`Listening on port ${port}...`)
});
