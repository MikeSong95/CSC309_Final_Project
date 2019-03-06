/* PATIENT DASHBOARD DOM FUNCTIONS */

// Make user a global variable for now
let user;

// Populate DOM with server data on page load
$(function() {
    $('[data-toggle="popover"]').popover()
    $().popover({container: 'body'})

    // Make a set of fake users for now
    // createPatient will be removed when server calls are implemented
    createPatient(0,'password','patient1@gmail.com', '(123) 456 - 7890', 'Tammy', 'Adams','Female','Feb 1', '1234');
    createPatient(1,'password','patient1@gmail.com', '(123) 111 - 1111', 'Joe', 'Adelaide','Male','Feb 1', '1234');
    createPatient(2,'password','patient1@gmail.com', '(123) 222 - 2222', 'Alan', 'Bell','Male','Feb 1', '1234');
    createPatient(3,'password','patient1@gmail.com', '(123) 333 - 3333', 'Derick', 'Benson','Male','Feb 1', '1234');
    createPatient(4,'password','patient1@gmail.com', '(123) 444 - 4444', 'Mark', 'Kazakevich','Male','Feb 1', '1234');

    getCurrentUser(2);
    populate_userInfo();
    populate_assignedDoctors();

    $("#sidebar-toggle").click(function(e) {
        console.log("sidebar-toggled click event handled!");
        e.preventDefault();
        $("#page-wrapper").toggleClass("sidebarDisplayed");
    });
});

// Function to return information of current user profile
function getCurrentUser(id) {
    // SERVER_CALL Get information of user profile from server
    // For now return fake user we created
    user = patientList.filter(function(account) {
        return account.id == id;
        })[0];
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


/*** Autocomplete ***/

function autocomplete(inp, arr) {
  /*the autocomplete function takes two arguments,
  the text field element and an array of possible autocompleted values:*/
  var currentFocus;
  /*execute a function when someone writes in the text field:*/
  inp.addEventListener("input", function(e) {
      var a, b, i, val = this.value;
      /*close any already open lists of autocompleted values*/
      closeAllLists();
      if (!val) { return false;}
      currentFocus = -1;
      /*create a DIV element that will contain the items (values):*/
      a = document.createElement("DIV");
      a.setAttribute("id", this.id + "autocomplete-list");
      a.setAttribute("class", "autocomplete-items");
      /*append the DIV element as a child of the autocomplete container:*/
      this.parentNode.appendChild(a);
      /*for each item in the array...*/
      for (i = 0; i < arr.length; i++) {
        /*check if the item starts with the same letters as the text field value:*/
        if (arr[i].lName.substr(0, val.length).toUpperCase() == val.toUpperCase()) {
          /*create a DIV element for each matching element:*/
          b = document.createElement("DIV");
          /*make the matching letters bold:*/
          b.innerHTML = "<strong>" + arr[i].lName.substr(0, val.length) + "</strong>";
          b.innerHTML += arr[i].lName.substr(val.length);
          /*insert a input field that will hold the current array item's value:*/
          b.innerHTML += "<input type='hidden' value='" + arr[i].lName + "'>";
          /*execute a function when someone clicks on the item value (DIV element):*/
          b.addEventListener("click", function(e) {
              /*insert the value for the autocomplete text field:*/
              inp.value = this.getElementsByTagName("input")[0].value; // Call populate_UserInfo() here.
              /*close the list of autocompleted values,
              (or any other open lists of autocompleted values:*/
              closeAllLists();
          });
          a.appendChild(b);
        }
      }
  });
  /*execute a function presses a key on the keyboard:*/
  inp.addEventListener("keydown", function(e) {
      var x = document.getElementById(this.id + "autocomplete-list");
      if (x) x = x.getElementsByTagName("div");
      if (e.keyCode == 40) {
        /*If the arrow DOWN key is pressed,
        increase the currentFocus variable:*/
        currentFocus++;
        /*and and make the current item more visible:*/
        addActive(x);
      } else if (e.keyCode == 38) { //up
        /*If the arrow UP key is pressed,
        decrease the currentFocus variable:*/
        currentFocus--;
        /*and and make the current item more visible:*/
        addActive(x);
      } else if (e.keyCode == 13) {
        /*If the ENTER key is pressed, prevent the form from being submitted,*/
        e.preventDefault();
        if (currentFocus > -1) {
          /*and simulate a click on the "active" item:*/
          if (x) x[currentFocus].click();
        }
      }
  });
  function addActive(x) {
    /*a function to classify an item as "active":*/
    if (!x) return false;
    /*start by removing the "active" class on all items:*/
    removeActive(x);
    if (currentFocus >= x.length) currentFocus = 0;
    if (currentFocus < 0) currentFocus = (x.length - 1);
    /*add class "autocomplete-active":*/
    x[currentFocus].classList.add("autocomplete-active");
  }
  function removeActive(x) {
    /*a function to remove the "active" class from all autocomplete items:*/
    for (var i = 0; i < x.length; i++) {
      x[i].classList.remove("autocomplete-active");
    }
  }
  function closeAllLists(elmnt) {
    /*close all autocomplete lists in the document,
    except the one passed as an argument:*/
    var x = document.getElementsByClassName("autocomplete-items");
    for (var i = 0; i < x.length; i++) {
      if (elmnt != x[i] && elmnt != inp) {
        x[i].parentNode.removeChild(x[i]);
      }
    }
  }
  /*execute a function when someone clicks in the document:*/
  document.addEventListener("click", function (e) {
      closeAllLists(e.target);
  });
} 
/*An array containing all the country names in the world:*/
var countries = ["Afghanistan","Albania","Algeria","Andorra","Angola","Anguilla","Antigua & Barbuda","Argentina","Armenia","Aruba","Australia","Austria","Azerbaijan","Bahamas","Bahrain","Bangladesh","Barbados","Belarus","Belgium","Belize","Benin","Bermuda","Bhutan","Bolivia","Bosnia & Herzegovina","Botswana","Brazil","British Virgin Islands","Brunei","Bulgaria","Burkina Faso","Burundi","Cambodia","Cameroon","Canada","Cape Verde","Cayman Islands","Central Arfrican Republic","Chad","Chile","China","Colombia","Congo","Cook Islands","Costa Rica","Cote D Ivoire","Croatia","Cuba","Curacao","Cyprus","Czech Republic","Denmark","Djibouti","Dominica","Dominican Republic","Ecuador","Egypt","El Salvador","Equatorial Guinea","Eritrea","Estonia","Ethiopia","Falkland Islands","Faroe Islands","Fiji","Finland","France","French Polynesia","French West Indies","Gabon","Gambia","Georgia","Germany","Ghana","Gibraltar","Greece","Greenland","Grenada","Guam","Guatemala","Guernsey","Guinea","Guinea Bissau","Guyana","Haiti","Honduras","Hong Kong","Hungary","Iceland","India","Indonesia","Iran","Iraq","Ireland","Isle of Man","Israel","Italy","Jamaica","Japan","Jersey","Jordan","Kazakhstan","Kenya","Kiribati","Kosovo","Kuwait","Kyrgyzstan","Laos","Latvia","Lebanon","Lesotho","Liberia","Libya","Liechtenstein","Lithuania","Luxembourg","Macau","Macedonia","Madagascar","Malawi","Malaysia","Maldives","Mali","Malta","Marshall Islands","Mauritania","Mauritius","Mexico","Micronesia","Moldova","Monaco","Mongolia","Montenegro","Montserrat","Morocco","Mozambique","Myanmar","Namibia","Nauro","Nepal","Netherlands","Netherlands Antilles","New Caledonia","New Zealand","Nicaragua","Niger","Nigeria","North Korea","Norway","Oman","Pakistan","Palau","Palestine","Panama","Papua New Guinea","Paraguay","Peru","Philippines","Poland","Portugal","Puerto Rico","Qatar","Reunion","Romania","Russia","Rwanda","Saint Pierre & Miquelon","Samoa","San Marino","Sao Tome and Principe","Saudi Arabia","Senegal","Serbia","Seychelles","Sierra Leone","Singapore","Slovakia","Slovenia","Solomon Islands","Somalia","South Africa","South Korea","South Sudan","Spain","Sri Lanka","St Kitts & Nevis","St Lucia","St Vincent","Sudan","Suriname","Swaziland","Sweden","Switzerland","Syria","Taiwan","Tajikistan","Tanzania","Thailand","Timor L'Este","Togo","Tonga","Trinidad & Tobago","Tunisia","Turkey","Turkmenistan","Turks & Caicos","Tuvalu","Uganda","Ukraine","United Arab Emirates","United Kingdom","United States of America","Uruguay","Uzbekistan","Vanuatu","Vatican City","Venezuela","Vietnam","Virgin Islands (US)","Yemen","Zambia","Zimbabwe"];

/*initiate the autocomplete function on the "myInput" element, and pass along the countries array as possible autocomplete values:*/
autocomplete(document.getElementById("myInput"), patientList);
