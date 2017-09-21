import { SimpleSchema } from 'meteor/aldeed:simple-schema';

export const Events = new Mongo.Collection('events');

if (Meteor.isServer) {
  // This code only runs on the server
  // Only publish tasks that are public or belong to the current user
  Meteor.publish('events', function tasksPublication() {
    return Events.find();
  });
}

var eventSchema = new SimpleSchema({
    creator_ID: {
        type: String,
        label: 'Createor ID',
    },
    event_name: {
        type: String,
        label: 'Event Name',
        max: 20,
    },
    event_date: {
        type: Date,
        label: 'Event Date and Time',
    },
    invitees: {
        type: [String],
        label: 'Invitees User ID',
    },
    attendees: {
        type: [String],
        label: 'Attendees User ID',
    },
});

Events.attachSchema(eventSchema);

Meteor.methods({
    'events.insert'(event_name, event_date, invitees) {
        
        if (! this.userId) {
            throw new Meteor.Error('not-authorized');
        }
        
        Events.insert({
            creator_ID: this.userId,
            event_name: event_name,
            event_date: event_date,
            invitees: invitees,
            attendees: [],
        });
    },
    'events.remove'(eventId) {
        const event = Events.findOne(eventId);
        
        if (event.creator_ID !== this.userId) {
          // If the task is private, make sure only the owner can delete it
          throw new Meteor.Error('not-authorized');
        }
     
        Events.remove(eventId);
    },
});