/* PATIENT DASHBOARD DOM FUNCTIONS */

// Make user a global variable for now
let user;

// Populate DOM with server data on page load
$(function() {
    $('[data-toggle="popover"]').popover()
    $().popover({container: 'body'})

    // Make a fake user for now
    // createPatient will be removed when server calls are implemented
    createPatient(0,'password','patient1@gmail.com', '(123) 456 - 7890', 'Mark', 'Kazakevich','Male','Feb 1', '1234');
    getCurrentUser();
    populate_userInfo();
    populate_assignedDoctors();
    populate_medications();
    populate_appointments();
});

// Function to return information of current user profile
function getCurrentUser() {
    // SERVER_CALL Get information of user profile from server
    // For now return fake user we created
    user = patientList[0];
}

// Function to get assigned doctors of current user
// Will be replaced by user.getAssignedDoctors() eventually when server functionality is added
function getAssignedDoctors() {
    // Make fake doctors for now 
    createDoctor(0, 'password', 'doctor1@gmail.com', '(123) 456 - 7890', 'Doc', 'Tor', 'Cardiology', '123 Fake Street');
    createDoctor(1, 'password', 'doctor2@gmail.com', '(123) 456 - 7890', 'Some', 'Doctor', 'Neurology', '123 Fake Avenue');
    createDoctor(2, 'password', 'doctor3@gmail.com', '(123) 456 - 7890', 'Test', 'Name', 'ENT', '123 Fake Crecent');
    createDoctor(3, 'password', 'doctor4@gmail.com', '(123) 456 - 7890', 'Test', 'Name 2', 'General Surgeon' , '123 Fake Crecent');
    
    // Hard-code assign them to current user
    // Note: Assigning patients is done from doctor's side
    doctorList[0].assignPatient(user);
    doctorList[1].assignPatient(user);
    doctorList[2].assignPatient(user);
    doctorList[3].assignPatient(user);

    return user.getDoctors();
}

// Function to get list of medications user is on
// Will be replaced by user.getMedications() eventually when server functionality added
function getUserMedications() {
    // Hard-code in medications for now
    user.assignMedication(medicationList[0]);
    user.assignMedication(medicationList[1]);

    return user.getMedications();
}

// Function to get list of user's appointments
// Will be replaced by user.getAppointments() eventually when server functionality added
function getUserAppointments() {
    // Hard-code in appointments for now
    const appt1 = new Appointment(0, "Regular Checkup", new dateTime("2019", "Feb","28",1100), new dateTime("2019", "Feb","28",1200));

    // Note: Adding appointments is done from doctor's side
    // Rescheduling appointments is a different functionality and may be initiated by either patients or doctors
    doctorList[1].addAppointment(user, appt1);
 
    return user.getAppointments();
}

// Populates the User Profile information
// Convert to jQuery idk why I wrote this in vanilla JS
function populate_userInfo() {
    // User name
    const nameContainer = document.querySelector("#user-name");
    nameContainer.setAttribute('class', 'card-subsection-name')
    const name = document.createTextNode(user.getFName() + " " + user.getLName());
    const nameElement = document.createElement('h4');
    nameElement.appendChild(name);
    nameContainer.appendChild(nameElement);

    // Contact info
    const contactInfoContainer = document.querySelector('.contact-info');
    const phoneNumNode = document.createTextNode(user.getPhoneNum());
    contactInfoContainer.appendChild(phoneNumNode);
    const emailElement = document.createElement('span');
    const emailNode = document.createTextNode(user.getEmail());
    emailElement.setAttribute('class', 'scaling-text-size');
    emailElement.appendChild(emailNode);
    contactInfoContainer.appendChild(document.createElement('br'));
    contactInfoContainer.appendChild(emailElement);
}

// Populates the "Assigned Doctors" section
// Convert to jQuery idk why I wrote this in vanilla JS
function populate_assignedDoctors() {
    // Will be replaced by user.getAssignedDoctors() eventually when server functionality is added
    const doctors = getAssignedDoctors();      

    const assignedDoctorSection = document.querySelector('#assigned-doctors');

    for (let i = 0; i < doctors.length; i++) {
        // Create doctor container element
        const mainContainer = document.createElement('div');
        mainContainer.setAttribute('class', 'doctor-container');

        // Create doctor picture element
        const pictureContainer = document.createElement('div');
        pictureContainer.setAttribute('class', 'doctor-picture-container');
        const picture = document.createElement('img');
        picture.setAttribute('class', 'doctor-picture');
        picture.setAttribute('src', './resources/images/icons/stockdoctor-icon.png');
        pictureContainer.append(picture);

        // Create doctor name / specialty element
        const nameContainer = document.createElement('div');
        nameContainer.setAttribute('class', 'doctor-name-container card-subsection-notes');
        const nameNode = document.createTextNode("Dr. " + doctors[i].getFName() + " " + doctors[i].getLName());
        const nameElement = document.createElement('strong');
        nameElement.appendChild(nameNode);
        nameElement.appendChild(document.createElement('br'));
        const specialtyNode = document.createTextNode(doctors[i].getSpecialty());
        const specialtyElement = document.createElement('span');
        specialtyElement.setAttribute('class', 'font-12');
        specialtyElement.appendChild(specialtyNode);
        nameContainer.appendChild(nameElement);
        nameContainer.appendChild(specialtyElement);

        // Add both to doctor container
        mainContainer.appendChild(pictureContainer);
        mainContainer.appendChild(nameContainer);

        // Add to assigned doctor section
        assignedDoctorSection.appendChild(mainContainer);
    }
}

// Populate the "Medications" section
function populate_medications() {
    // Will be replaced by user.getMedications() eventually when server functionality added
    const medicationList = getUserMedications();

    for (let i = 0; i < medicationList.length; i++) {
        $('#med-list').append('<div class="item-container">'+
                                '<div class="info-container">'+
                                    '<p class="med-info">'+
                                        '<span class="card-subsection-name">'+
                                            medicationList[i]['name']+
                                        '</span>'+
                                        '<div class="card-subsection-notes">'+
                                            medicationList[i]['description']+
                                        '</div>'+
                                    '</p>'+
                                '</div>'+
                                '<div class="med-reminder-container">'+
                                    '<a class="hover-pointer"><img class="invert-color" src="./resources/images/icons/med-notification-icon.png"></a>'+
                                '</div>'+
                            '</div>');
    }
}

// Populate the "Appointments" section
function populate_appointments() {
    const appointmentList = getUserAppointments();

    for (let i = 0; i < appointmentList.length; i++) { 
        $('#appt-list').append('<div class="item-container">'+
                                    '<div class="info-container">'+
                                        '<p class="med-info">'+
                                            '<span class="card-subsection-name">'+
                                                appointmentList[i].getName()+
                                            '</span>'+
                                            '<div class="card-subsection-h1">'+
                                                appointmentList[i].getStartTime()+ " - " + appointmentList[i].getEndTime()+
                                            '</div>'+
                                            '<div class="card-subsection-h1">'+
                                                appointmentList[i].getDate()+
                                            '</div>'+
                                        '</p>'+
                                    '</div>'+
                                    '<div class="med-reminder-container">'+
                                        '<a><img class="appt-icon invert-color" src="./resources/images/icons/med-notification-icon.png"></a>'+
                                        '<a><img class="" src="./resources/images/icons/calendar-icon-sm.png"></a>'+
                                    '</div>'+
                                '</div>')
    }
}