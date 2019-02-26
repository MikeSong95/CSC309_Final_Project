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
        this.appointments = [];    // Empty list of appointment IDs
        this.assignedDoctors = []; // Empty list of assigned doctors
        this.medications = [];     // Empty list of assigned medications
    }

    /* Accessors */

    getMedications() {
        return this.medications;
    }

    getDoctors() {
        return this.assignedDoctors;
    }

    getAppointments() {
        return this.appointments;
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
}

// Doctor class inherits general user class
class Doctor extends User {
    constructor (id_, password_, email_, phoneNum_, fName_, lName_, specialty_, address_) {
        super (id_, password_, email_, phoneNum_, fName_, lName_);
        this.specialty = specialty_;
        this.address = address_;
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

    /* Mutators */

    assignPatient(patient) {
        this.assignedPatients.push(patient);

        // Add this doctor to assignedDoctors list for patient
        patient.assignDoctor(this);
    }

    /**
     * @param {Appointment} appt The appointment, stored as an Appointment object. 
     */
    addAppointment(patient, appt) {
        this.appointments.push(appt);
        patient.addAppointment(appt);
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