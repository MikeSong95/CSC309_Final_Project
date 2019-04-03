/* NOTIFICATIONS MODULE */

// Notification object
class Notification {
    /**
     * 
     * @param {string} desc_ Notification text
     * @param {int} alertFreq_ Time in milliseconds
     */
    constructor (desc_,alertFreq_) {
        this.description = desc_;
        this.alertFreq = alertFreq_;
        this.intervalFunc = null;
    }
}

