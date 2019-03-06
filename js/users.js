/* USER MODULE */

/* Global array of patients and doctors */
const patientList = [];
const doctorList = [];

// General user class
class User {
    constructor  (id_, password_, email_, phoneNum_, fName_, lName_) {
        this.id = id_;
        this.password = password_;
        this.email = email_;
        this.phoneNum = phoneNum_;
        this.fName = fName_;
        this.lName = lName_;
    }

    getID() {
        return this.id;
    }
    getEmail() {
        return this.email;
    }

    getPhoneNum() {
        return this.phoneNum;
    }

    getFName() {
        return this.fName;
    }

    getLName() {
        return this.lName;
    }
}

// Patient class inherits general user class
class Patient extends User {
    constructor  (id_, password_, email_, phoneNum_, fName_, lName_, gender_, bday_, hcNum_) {
        super (id_, password_, email_, phoneNum_, fName_, lName_);
        this.gender = gender_;
        this.bday = bday_;
        this.hcNum = hcNum_;
        this.notifications = [];
        this.appointments = [];    // Empty list of appointment IDs
        this.assignedDoctors = []; // Empty list of assigned doctors
        this.medications = [];     // Empty list of assigned medications
    }

    /* Accessors */
    getID() {
        return this.id;
    }

    getMedications() {
        return this.medications;
    }

    getDoctors() {
        return this.assignedDoctors;
    }

    getAppointments() {
        return this.appointments;
    }

    getNotifications() {
        return this.notifications;
    }

    /* Mutators */

    assignDoctor(doctor) {
        this.assignedDoctors.push(doctor);
    }

    assignMedication(medication) {
        this.medications.push(medication);
    }

    /**
     * @param {Appointment} appt The appointment stored as an Appointment object. 
     */
    addAppointment(appt) {
        this.appointments.push(appt);
    }

    setNotification(notification) {
        const _this = this;
        notification.intervalFunc = setInterval(function() {
            _this.notifications.push(notification);
            $('#navbar-notif-icon').attr("src","./resources/images/icons/notification-icon.png")
        }, notification.alertFreq); 
    }

    clearNotification(notification) {
        // Find notification
        const notif_desc = "Reminder for: " + notification;
        for (let i = 0; i < this.notifications.length; i++) {
            if (notif_desc === this.notifications[i].description) {
                clearInterval(this.notifications[i].intervalFunc);
            }
        }
    }
}

// Doctor class inherits general user class
class Doctor extends User {
    constructor (id_, password_, email_, phoneNum_, fName_, lName_, specialty_, address_) {
        super (id_, password_, email_, phoneNum_, fName_, lName_);
        this.specialty = specialty_;
        this.address = address_;
        this.notifications = [];
        this.assignedPatients = [];
        this.appointments = [];
    }

    /* Accessors */
    
    getPatients() {
        return this.assignedPatients;
    }

    getAppointments() {
        return this.appointments;
    }

    getSpecialty () {
        return this.specialty;
    }

    getNotifications() {
        return this.notifications;
    }

    /* Mutators */

    assignPatient(patient) {
        this.assignedPatients.push(patient);

        // Add this doctor to assignedDoctors list for patient
        patient.assignDoctor(this);
    }

    unassignPatient(patientID) {
        for (let i = 0; i < this.assignedPatients.length; i++) {
            if (this.assignedPatients[i].getID() == patientID) {
                this.assignedPatients.splice(i, 1);
                break;
            }
        } 
    }

    /**
     * @param {Appointment} appt The appointment, stored as an Appointment object. 
     */
    addAppointment(patient, appt) {
        this.appointments.push(appt);
        patient.addAppointment(appt);
    }

    setNotification(notification) {
        const _this = this;
        notification.intervalFunc = setInterval(function() {
            _this.notifications.push(notification);
            $('#navbar-notif-icon').attr("src","./resources/images/icons/notification-icon.png")
        }, notification.alertFreq); 
    }

    clearNotification(notification) {
        // Find notification
        const notif_desc = "Reminder for: " + notification;
        for (let i = 0; i < this.notifications.length; i++) {
            if (notif_desc === this.notifications[i].description) {
                clearInterval(this.notifications[i].intervalFunc);
            }
        }
    }
}

// Creates a new patient object and adds it to the global array
function createPatient(id_, password_, email_, phoneNum_,fName_, lName_, gender_, bday_, hcNum_) {
    const newPatient = new Patient (id_, password_, email_, phoneNum_,fName_, lName_, gender_, bday_, hcNum_);
    patientList.push(newPatient);
}

// Creates a new doctor object and adds it to the global array
function createDoctor(id_, password_, email_, phoneNum_, fName_, lName_, specialty_, address_) {
    const newDoctor = new Doctor (id_, password_, email_, phoneNum_, fName_, lName_, specialty_, address_);
    doctorList.push(newDoctor);
}

function clearNotification(userID, notif) {
    // Find user from userID

    for (let i = 0; i < patientList.length; i++) {
        if (patientList[i].getID() == userID) {
            patientList[i].clearNotification(notif);
            break;
        }
    }
}

function createNotification(userID, item, freq) {
    const description = "Reminder for: " + item;
    if (freq === 'demo') {
        freq = 5000;
    } else if (freq === 'daily') {

    } else if (freq === 'weekly') {

    } 

    const newNotification = new Notification(description, freq);
    
    // Find user from userID

    for (let i = 0; i < patientList.length; i++) {
        if (patientList[i].getID() == userID) {
            patientList[i].setNotification(newNotification);
            break;
        }
    }
}

function removeNotification(userID, notificationNum) {
    // Find user from userID
    for (let i = 0; i < patientList.length; i++) {
        if (patientList[i].getID() == userID) {
            patientList[i].notifications.splice(notificationNum,1);
            if (patientList[i].notifications.length === 0) {
                $('#navbar-notif-icon').attr("src","./resources/images/icons/notification-none-icon.png")
            }
            break;
        }
    }
}

// Cannot detect user vs doctor yet until SERVER CALL so make separate functions for now

function createDoctorNotification(userID, item, freq) {
    const description = "Reminder for: " + item;
    if (freq === 'demo') {
        freq = 5000;
    } else if (freq === 'daily') {

    } else if (freq === 'weekly') {

    } 

    const newNotification = new Notification(description, freq);
    
    // Find user from userID

    for (let i = 0; i < doctorList.length; i++) {
        if (doctorList[i].getID() == userID) {
            doctorList[i].setNotification(newNotification);
            break;
        }
    }
}

function clearDoctorNotification(userID, notif) {
    // Find user from userID

    for (let i = 0; i < doctorList.length; i++) {
        if (doctorList[i].getID() == userID) {
            doctorList[i].clearNotification(notif);
            break;
        }
    }
}

function removeDoctorNotification(userID, notificationNum) {
    // Find user from userID
    for (let i = 0; i < doctorList.length; i++) {
        if (doctorList[i].getID() == userID) {
            doctorList[i].notifications.splice(notificationNum,1);
            if (doctorList[i].notifications.length === 0) {
                $('#navbar-notif-icon').attr("src","./resources/images/icons/notification-none-icon.png")
            }
            break;
        }
    }
}
