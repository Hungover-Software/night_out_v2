import './event_new.html';

import { Events } from '../../api/events.js';
import { Friends } from '../../api/friends.js';

Template.event_new.onCreated(function() {
    Meteor.subscribe('events');
    Meteor.subscribe('friends');
});

Template.event_new.onRendered(function() {
    $('.datepicker').pickadate({
        selectMonths: true, // Creates a dropdown to control month
        selectYears: 15, // Creates a dropdown of 15 years to control year,
        today: 'Today',
        clear: 'Clear',
        close: 'Ok',
        closeOnSelect: false // Close upon selecting a date,
    });
    
    $('.timepicker').pickatime({
        default: 'now', // Set default time: 'now', '1:30AM', '16:30'
        fromnow: 0,       // set default time to * milliseconds from now (using with default = 'now')
        twelvehour: true, // Use AM/PM or 24-hour format
        donetext: 'OK', // text for done-button
        cleartext: 'Clear', // text for clear-button
        canceltext: 'Cancel', // Text for cancel-button
        autoclose: false, // automatic close timepicker
        ampmclickable: true, // make AM PM clickable
        aftershow: function(){}, //Function for after opening timepicker
        format: 'HH:MM',
    });
    
    $('.modal').modal();
});

function convert12to24(timeStr) {
    var meridian = timeStr.substr(timeStr.length-2).toLowerCase();;
    var hours =  timeStr.substr(0, timeStr.indexOf(':'));
    var minutes = timeStr.substring(timeStr.indexOf(':')+1, timeStr.indexOf(':')+3);
    if (meridian=='pm')
    {
        if (hours!=12)
        {
            hours=hours*1+12;
        }
        else
        {
            hours = (minutes!='00') ? '0' : '24' ;
        }
    }

    return hours+':'+minutes;
}

Template.event_new.helpers({
    friendGroup() {
        
        return [{name: 'test'}];
    },
    
    friendList(){
        return Friends.find();
    },
});

Template.event_new.events({
    'submit #new'(event) {
        event.preventDefault();
        
        const target = event.target;
        const eventName = target.event_name.value;
        const eventDate = target.event_date.value;
        const eventTime = target.event_time.value;
        
        const combinedDate = eventDate + ' ' + convert12to24(eventTime);
        
        Meteor.call('events.insert', eventName, combinedDate, []);
    },
});