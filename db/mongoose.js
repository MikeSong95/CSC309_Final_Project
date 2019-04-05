'use strict';

const mongoose = require('mongoose');
// connect to our database
//const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/MedAPI'

mongoose.connect(process.env.MONGODB_URI || 'mongodb://heroku_5xc2vgqp:621t31ltt3mdmibfimoo2nh9ae@ds211096.mlab.com:11096/heroku_5xc2vgqp', { useNewUrlParser: true, useCreateIndex: true});
//mongoose.connect(mongoURI, { useNewUrlParser: true});
module.exports = {
	mongoose
}
