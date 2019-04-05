'use strict';

const mongoose = require('mongoose');
//const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/MedAPI'
// mongoose.connect(mongoURI, { useNewUrlParser: true});

mongoose.connect(process.env.MONGODB_URI || 'mongodb://heroku_5xc2vgqp:621t31ltt3mdmibfimoo2nh9ae@ds211096.mlab.com:11096/heroku_5xc2vgqp', { useNewUrlParser: true, useCreateIndex: true});

module.exports = {
	mongoose
}
