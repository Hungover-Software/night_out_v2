import './landing.html';

import {Events} from '../../api/events.js';

Template.landing.onCreated(function() {
    Meteor.subscribe('events');
});

Template.landing.helpers({
    eventList(){
        //Events.find({creator_ID:Meteor.userId() || atendees.friend_ID:Meteor.userId()})
        console.log('here');
        console.log(Events.find().fetch);
        return Events.find({creator_ID:Meteor.userId()});
        
    },
})