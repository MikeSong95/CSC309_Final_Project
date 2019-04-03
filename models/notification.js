const mongoose = require('mongoose');

// Reservations will be embedded in the Restaurant model
const NotificationSchema = new mongoose.Schema({
    id_: Number,
});

const Notification = mongoose.model('Notification', NotificationSchema);

module.exports = Notification ;
