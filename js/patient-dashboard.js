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
    populate_assigned_medications();
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



// *************** Patient Profile Page ****************


$(document).on("click", "#update-med", edit_medications_form);
$(document).on("click", "#add-med", medication_form);
$(document).on("click", "#new-med-button", add_medication);
$(document).on("click", "#cancel-update", cancel_update);
$(document).on("click", "#delete-med", delete_medication);
$(document).on("click", "#cancel-new-med", cancel_new_medication);

function edit_medications_form() {
    const button = $(this)[0].children[0]
    const textDiv = $($($(this).parent()).parent()[0]).children()[1];
    if ($(button).text() == "Update Medication") {
        const original_text = $(textDiv).text();
        $(textDiv).empty();
        $(textDiv).append(
            '<textarea rows="4" cols= "75" type="text" >' +
            original_text +
            '</textarea>'
        );
        $(button).text("Save and Submit")
        const next_button = $($(button).parent()[0]).next()[0]
        $(next_button).removeAttr("delete-med")
        $(next_button).attr("id", "cancel-update")
        $($(next_button).children()[0]).text("Cancel")
    } else if ($(button).text() == "Save and Submit") {
        const new_text = $($(textDiv).children()[0]).val();
        const med_container = $($(textDiv).parent()[0]).prev()[0]
        const med_name = $($(med_container).children()[0]).text();
        for (let i = 0; i < user.medications.length; i++) {
            if (user.medications[i]["name"] == med_name) {
                user.medications[i]["description"] = new_text;
            }
        }
        $(textDiv).empty();
        $(textDiv).append(new_text);
        $(button).text("Update Medication")
        const next_button = $($(button).parent()).next()[0]
        $(next_button).removeAttr("cancel-update")
        $(next_button).attr("id", "delete-med")
        $($(next_button).children()[0]).text("Delete Medication")
    }
}

function cancel_update() {
    console.log(this)
    const container_to_update = $($(this).parent()[0]).parent()[0];
    const med_list = user.getMedications();
    const med_name = $($($(container_to_update).prev()[0]).children()[0]).text();
    for (let i = 0; i < med_list.length; i++) {
        if (med_list[i]["name"] == med_name) {
            const text = med_list[i]["description"]
            $(container_to_update).empty()
            $(container_to_update).append(
                '<span class="med-edit">'+
                    '<div id="update-med">' + 
                        '<button type="button" class="btn btn-outline-light">Update Medication</button>' +
                    '</div>' +
                    '<div id="delete-med">' + 
                        '<button type="button" class="btn btn-outline-light">Delete Medication</button>' +
                    '</div>' +
                '</span>'
                );
            $(container_to_update).append('<div class="med-notes">'+
                text +
                '</div>')
        }
    }
}

function medication_form() {
    if ($(this).text() == "Add Medication") {
        const med_add = $(this).parent()
        $(med_add).empty()
        $(med_add).append(
        '<div id="new-medication-form">' +
            '<span class="med-input">' +
                '<div>Medication name: </div>' +
                '<textarea rows="1" type="text"></textarea>' +
            '</span>' +
            '<span class="med-input">' +
                '<div>Dosage: </div>' +
                '<textarea rows="1" type="text"></textarea>' +
            '</span>' +
            '<div>Description: </div>' +
            '<textarea rows="4" cols= "75" type="text" ></textarea>' +
        '</div>' +
        '<button type="button" class="btn btn-outline-light" id="new-med-button">Save and Submit</button>' +
        '<button type="button" class="btn btn-outline-light" id="cancel-new-med">Cancel</button>'
        );
    }
}

function add_medication(){
    const med_form = $(this).prev()[0].children;
    user.assignMedication({
        name: $($(med_form)[0].children[1]).val(),
        dosage: $($(med_form)[1].children[1]).val(),
        description: $($(med_form)[3]).val()
    })
    populate_assigned_medications();
}

function delete_medication() {
    const med_container = $($($(this).parent()[0]).parent()[0]).prev()[0];
    const med_name = $($(med_container).children()[0]).text()
    for (let i = 0; i < user.medications.length; i++) {
        console.log(med_name)
        console.log(user.medications[i]["name"])
        if (med_name == user.medications[i]["name"]) {
            user.medications.splice(i, 1)
            populate_assigned_medications();
        }
    }
}

function cancel_new_medication() {
    const med_add = $($(this).parent())[0];
    $(med_add).empty()
    $(med_add).append( 
        '<button type="button" class="btn btn-outline-light" id="add-med">Add Medication</button>' 
        );
}


function populate_assigned_medications() {
    $('#assigned-med-list').empty();
    const medicationList = user.getMedications();
    
    for (let i = 0; i < medicationList.length; i++) {
        $('#assigned-med-list').append(
            '<div class="med-list-item">'+
                '<p>'+
                    '<span class="med-title">'+
                        medicationList[i]['name']+
                    '</span>'+
                    '<span>' +
                        " (" + medicationList[i]['dosage'] + ")" +
                    '</span>' + 
                    '<img src="./resources/images/icons/expandplus-icon.png" class="expand" data-toggle="collapse" href="#collapseExample' + i + 
                            '" role="button" aria-expanded="false" aria-controls="collapseExample"/>' +
                    
                    '<div class="collapse" id="collapseExample' + i + '">' +
                        '<span class="med-edit">'+
                            '<div id="update-med">' + 
                                '<button type="button" class="btn btn-outline-light">Update Medication</button>' +
                            '</div>' +
                            '<div id="delete-med">' + 
                                '<button type="button" class="btn btn-outline-light">Delete Medication</button>' +
                            '</div>' +
                        '</span>'+
                        '<div class="med-notes">'+
                            medicationList[i]['description']+
                        '</div>'+
                    '</div>' +
                    
                '</p>'+
            '</div>' +
            '<hr >'
                );
    }
    $('#assigned-med-list').append(
        '<div class="med-add">'+
            '<button type="button" class="btn btn-outline-light" id="add-med">Add Medication</button>' +
        '</div>' 
        
    );
}
