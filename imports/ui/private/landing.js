import './landing.html';

import {Events} from '../../api/events.js';

Template.landing.onCreated(function() {
    Meteor.subscribe('events');
});

Template.landing.helpers({
    eventList(){
        return Events.find();
    },
});
