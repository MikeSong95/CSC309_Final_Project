const mongoose = require('mongoose');

// Reservations will be embedded in the Restaurant model
const AppointmentSchema = new mongoose.Schema({
    id_: Number,
});

const Appointment = mongoose.model('Appointment', AppointmentSchema);

module.exports = Appointment ;
