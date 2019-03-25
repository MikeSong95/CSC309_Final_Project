/* E4 server.js */
'use strict';
const log = console.log;

const express = require('express')
const bodyParser = require('body-parser')
const { ObjectID } = require('mongodb')

// Mongoose
const { mongoose } = require('./db/mongoose');
const { Patient } = require('./models/patient')

// Express
const port = process.env.PORT || 3000
const app = express();
app.use(bodyParser.json());

