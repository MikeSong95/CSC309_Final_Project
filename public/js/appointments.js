/* APPOINTMENT MODULE */

// Month Enum
const MonthEnum = {"Jan":1, "Feb":2, "Mar":3, "Apr":4, "May":5, "Jun":6, "Jul":7, "Aug":8, "Sep":9, "Oct":10, "Nov":11, "Dec":12};

// Date and time of appointment object
/**
 * 
 * @param {string} year_ The year
 * @param {string} month_ Three letter abbreviation of month (e.g. Jan, Jul)
 * @param {int} date_ Numerical value of date
 * @param {int} time_ Numerical value of time in military format (e.g. 1100, 2100)
 */
function dateTime (year_, month_, date_, time_) {
    this.year = year_;
    this.month = month_;
    this.date = date_;
    this.time = time_;
}

// Convert military time to standard time
function convertTimeToStandard(time) {
    let AM_PM;

    if (time >= 1300) {         // Double digit hour PM time
        time -= 1200;
        AM_PM = " PM";
    } else if (time >= 1200) {  // Single digit hour PM time
        AM_PM = " PM";
    } else if (time < 0100) {   // 12:00 - 12:59 AM
        time += 1200
        AM_PM = " AM";
    } else {                    // Everything else
        AM_PM = " AM";
    }

    let standardTime = time.toString();

    if (standardTime.length === 3) {
        standardTime = standardTime.slice(0, 1) + ":" + standardTime.slice(1);
    } else {
        standardTime = standardTime.slice(0, 2) + ":" + standardTime.slice(2);
    }

    standardTime += AM_PM;

    return standardTime;
}

// Appointment class
class Appointment {
    /**
     * 
     * @param {int} id_ Appointment ID
     * @param {string} name_ 
     * @param {dateTime} start_ 
     * @param {dateTime} end_ 
     * @param {Patient or Doctor} with_ The person whom the meeting is with 
     */
    constructor (id_, name_, start_, end_, patient_, doctor_) {
        this.id = id_;
        this.name = name_;
        this.start = start_;    // Start dateTime object
        this.end = end_;        // End dateTime object
        this.patient = patient_;
        this.doctor = doctor_;
    }
    
    getID () {
        return this.id;
    }
    
    getName () {
        return this.name;
    }

    /**
     * Returns time as string in standard format (HH:MM AM/PM)
     */
    getStartTime () {
        return convertTimeToStandard(this.start.time);
    }

    /**
     * Returns time as string in standard format (HH:MM AM/PM)
     */
    getEndTime () {
        return convertTimeToStandard(this.end.time);
    }

    /**
     * Returns date of appointment in MMM DD, YYYY format
     */
    getDate() {
        const date = this.start.month + " " + this.start.date.toString() + ", " + this.start.year;

        return date;
    }

    getPatient() {
        return this.patient_;
    }

    getDoctor() {
        return this.doctor_;
    }
}

