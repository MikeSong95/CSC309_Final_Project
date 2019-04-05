'use strict';

const mongoose = require('mongoose');
//const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/MedAPI'
// mongoose.connect(mongoURI, { useNewUrlParser: true});

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/MedAPI', { useNewUrlParser: true, useCreateIndex: true});

module.exports = {
	mongoose
}
